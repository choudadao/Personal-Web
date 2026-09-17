import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { profile } from './content.js';
import { createMarbleReveal } from './marble-material.js';
import { createCameraMirror } from './camera-mirror.js';
const mirrorVersion=document.body.dataset.variant==='mirror';
const marbleVersion=document.body.dataset.variant==='marble';

const $ = s => document.querySelector(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = $('#stage'), main = $('#content');
const safe = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('.monogram').textContent = profile.monogram;
main.innerHTML = `<section id="intro"><div id="top"></div><div class="accessible"><h1>${safe(profile.introduction).replace(/\n/g,' ')}</h1><p>${safe(profile.location)}</p></div></section>` + profile.chapters.map(c => `<section id="${safe(c.id)}"><div class="accessible"><h2>${safe(c.title)}</h2><p>${safe(c.left)}</p><p>${safe(c.right)}</p></div></section>`).join('') + `<section id="contact"><div class="accessible"><h2>${safe(profile.closing)}</h2>${profile.contact.map(c => `<a href="${safe(c.url)}">${safe(c.label)} — ${safe(c.text)}</a>`).join('')}</div></section>`;
let renderer;
try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'}); }
catch (error) { document.body.classList.add('fallback'); $('#loading').classList.add('done'); throw error; }
renderer.setClearColor(0xffffff);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.autoClear=false;renderer.outputColorSpace=THREE.SRGBColorSpace;stage.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);
const avatarScene=new THREE.Scene(); avatarScene.add(new THREE.HemisphereLight(0xffffff,0x85899b,2.0)); const key=new THREE.DirectionalLight(0xffffff,3.0);key.position.set(-200,250,400);avatarScene.add(key);const fill=new THREE.DirectionalLight(0xe1e8ff,1.4);fill.position.set(200,30,200);avatarScene.add(fill);
const marbleReveal=marbleVersion?createMarbleReveal(renderer,avatarScene,profile.avatar.marble):null;
const cameraMirror=mirrorVersion?createCameraMirror(renderer,avatarScene,profile.avatar.mirror):null;
const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,2000);camera.position.z=1000;
const avatarCamera=new THREE.PerspectiveCamera(32,1,.1,3000);avatarCamera.position.z=600;
const rt=new THREE.WebGLRenderTarget(1,1,{depthBuffer:true});
const mouse=new THREE.Vector2(10,10),raycaster=new THREE.Raycaster(),lightPosition=new THREE.Vector3();
let width=innerWidth,height=innerHeight,mobile=false,scroll=window.scrollY,frame=0,previous=0;
let targetX=0,targetY=0,hover=0,hitTime=-10,activeHit=false,idleTime=performance.now(),sound=false;
let sectionTops=[],textItems=[],linkItems=[],lastLayoutW=0,layoutH=0,avatarLoaded=false;
let loadedMixer=null,loadedActions=[],gyro=false,gyroBase=null;
const waves=[];
const postScene=new THREE.Scene(),postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const post=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,
 uniforms:{uTexture:{value:rt.texture},uResolution:{value:new THREE.Vector2()},uTime:{value:0},uWaves:{value:[new THREE.Vector4(),new THREE.Vector4(),new THREE.Vector4()]}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
 fragmentShader:`precision highp float;uniform sampler2D uTexture;uniform vec2 uResolution;uniform float uTime;uniform vec4 uWaves[3];varying vec2 vUv;
 void main(){vec2 uv=vUv;vec2 shift=vec2(0.);float rim=0.;float fringe=0.;float halo=0.;
 for(int i=0;i<3;i++){vec4 w=uWaves[i];float age=uTime-w.z;if(w.w<.5||age<0.||age>2.4)continue;
 vec2 delta=(vUv-w.xy)*uResolution;float dist=length(delta);vec2 dir=delta/max(dist,.001);
 float t=clamp(age/2.4,0.,1.);float radius=(1.-pow(1.-t,3.))*min(uResolution.x,uResolution.y)*.9;
 float fade=(1.-smoothstep(.42,1.,t))*smoothstep(0.,.07,t);float ring=exp(-pow((dist-radius)/22.,2.));float inner=1.-smoothstep(radius-65.,radius,dist);
 float zoom=inner*pow(dist/max(radius,1.),2.)*18.;float wobble=sin((dist-radius)*.09-age*8.)*ring*16.;
 shift+=dir*(zoom+wobble)*fade/uResolution;rim+=ring*fade;fringe+=ring*fade*3.;halo+=exp(-pow((dist-radius)/55.,2.))*fade;}
 vec2 ca=normalize((uv-.5)*uResolution+vec2(.001))*fringe/uResolution;
 vec3 col=vec3(texture2D(uTexture,uv+shift+ca).r,texture2D(uTexture,uv+shift).g,texture2D(uTexture,uv+shift-ca).b);
 col=mix(col,vec3(.20,.26,1.),min(.26,rim*.22));col+=vec3(.045,.035,.12)*halo;gl_FragColor=vec4(col,1.);}`});
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),post));

// Original temporary chrome character. Set profile.avatar.url to replace it.
function makeMatcap(){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');
 let g=c.createRadialGradient(256,240,30,256,240,270);g.addColorStop(0,'#60616b');g.addColorStop(.36,'#111116');g.addColorStop(.72,'#272833');g.addColorStop(.90,'#bbbcc8');g.addColorStop(1,'#f8f8ff');c.fillStyle=g;c.fillRect(0,0,512,512);
 c.save();c.filter='blur(17px)';c.fillStyle='#ffffff';c.beginPath();c.ellipse(175,125,88,38,-.5,0,Math.PI*2);c.fill();c.fillStyle='#d8dce9';c.beginPath();c.ellipse(375,292,32,133,.18,0,Math.PI*2);c.fill();c.fillStyle='#eff0ff';c.beginPath();c.ellipse(190,420,102,24,.15,0,Math.PI*2);c.fill();c.restore();
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
let matcap=makeMatcap();
const surfaceUniforms={uHover:{value:0},uPoint:{value:lightPosition},uRadius:{value:70}};
function chromeMaterial(base='#dedee6'){const m=new THREE.MeshMatcapMaterial({matcap,color:base});m.onBeforeCompile=s=>{Object.assign(s.uniforms,surfaceUniforms);s.vertexShader='varying vec3 vGlowWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvGlowWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');s.fragmentShader='varying vec3 vGlowWorld;uniform float uHover;uniform vec3 uPoint;uniform float uRadius;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>','float proximity=exp(-pow(distance(vGlowWorld,uPoint)/uRadius,2.0)*2.0); outgoingLight += vec3(0.035,0.07,1.0)*proximity*uHover*1.3;\n#include <opaque_fragment>');};return m;}
const chrome=chromeMaterial(),black=chromeMaterial('#454552'),white=chromeMaterial('#ffffff');
const avatarPivot=new THREE.Group();avatarScene.add(avatarPivot);const avatar=new THREE.Group();avatarPivot.add(avatar);
const eyeGroup=new THREE.Group(),placeholder=new THREE.Group();avatar.add(placeholder);
function ellipsoid(parent,position,scale,material=chrome){const m=new THREE.Mesh(new THREE.SphereGeometry(1,48,40),material);m.position.set(...position);m.scale.set(...scale);parent.add(m);return m;}
ellipsoid(placeholder,[0,0,0],[57,72,48]);ellipsoid(placeholder,[-57,-3,0],[13,21,12]);ellipsoid(placeholder,[57,-3,0],[13,21,12]);ellipsoid(placeholder,[0,-15,47],[13,16,17]);placeholder.add(eyeGroup);
for(const x of [-23,23]){ellipsoid(eyeGroup,[x,14,42],[14,18,8],white);ellipsoid(eyeGroup,[x+2,14,49],[5.5,8,3.8],black);const brow=ellipsoid(placeholder,[x,37,35],[16,3.8,6],black);brow.rotation.z=x<0?.12:-.12;}
for(let i=0;i<5;i++){const hair=ellipsoid(placeholder,[-39+i*19,65+(i===2?7:0),-8],[17,27,33],black);hair.rotation.z=-.26+i*.07;}
const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-19,-33,41),new THREE.Vector3(-8,-39,45),new THREE.Vector3(7,-39,45),new THREE.Vector3(19,-32,41)]);placeholder.add(new THREE.Mesh(new THREE.TubeGeometry(curve,28,1.6,8,false),black));
async function loadAvatar(){
 if(profile.avatar.matcap){try{const tex=await new THREE.TextureLoader().loadAsync(profile.avatar.matcap);tex.colorSpace=THREE.SRGBColorSpace;matcap=tex;for(const m of [chrome,black,white]){m.matcap=tex;m.needsUpdate=true;}}catch(e){console.warn('Custom matcap unavailable; using generated matcap.',e);}}
 if(!profile.avatar.url)return;try{const gltf=await new GLTFLoader().loadAsync(profile.avatar.url),model=gltf.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const wrapper=new THREE.Group();model.position.sub(center);wrapper.add(model);wrapper.scale.setScalar(160/Math.max(size.y,.001)*profile.avatar.scale);wrapper.rotation.y=profile.avatar.rotationY;wrapper.position.y=profile.avatar.offsetY;
 if(marbleReveal){marbleReveal.apply(model);await marbleReveal.loadMaps();}
 if(cameraMirror){cameraMirror.apply(model);await cameraMirror.loadMaps();}
 model.traverse(o=>{if(o.isMesh){const materials=Array.isArray(o.material)?o.material:[o.material]; for(const material of materials){ if(!mirrorVersion){material.metalness=Math.min(material.metalness??0,.25);material.roughness=Math.max(material.roughness??.6,.4);} if(!marbleVersion&&!mirrorVersion){const glow=chromeMaterial();material.onBeforeCompile=glow.onBeforeCompile;} material.needsUpdate=true;}o.frustumCulled=false;}});avatar.remove(placeholder);avatar.add(wrapper);avatarLoaded=true;loadedMixer=new THREE.AnimationMixer(model);loadedActions=gltf.animations.map(clip=>({name:clip.name,action:loadedMixer.clipAction(clip)}));const idle=loadedActions.find(a=>/idle|blink/i.test(a.name));if(idle)idle.action.play();
 }catch(e){console.warn('Avatar could not be loaded. Keeping temporary model.',e);$('#hint').textContent='Preview avatar · your model is unavailable';}}
const measuring=document.createElement('canvas').getContext('2d');
function wrap(text,maxWidth,size,font='Editorial'){measuring.font=`${size}px ${font}`;const chinese=/[\u3400-\u9fff]/.test(text),tokens=chinese?Array.from(text):text.split(/\s+/),join=chinese?'':' ';let line='',lines=[];for(const token of tokens){const next=line?line+join+token:token;if(measuring.measureText(next).width>maxWidth&&line){lines.push(line);line=token;}else line=next;}if(line)lines.push(line);return lines;}
function textMesh(text,{size=18,font='Editorial',color='#171717',anchor='center',x=0,y=0,section=0,avoid=false,link=null}={}){
 measuring.font=`${size}px ${font}`;const logicalWidth=Math.ceil(measuring.measureText(text).width)+12,logicalHeight=Math.ceil(size*1.65),canvas=document.createElement('canvas'),resolution=Math.min(devicePixelRatio||1,2)*1.4;canvas.width=Math.ceil(logicalWidth*resolution);canvas.height=Math.ceil(logicalHeight*resolution);const ctx=canvas.getContext('2d');ctx.scale(resolution,resolution);ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.textBaseline='middle';ctx.fillText(text,6,logicalHeight/2);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,depthTest:false}),mesh=new THREE.Mesh(new THREE.PlaneGeometry(logicalWidth,logicalHeight),material);mesh.userData={width:logicalWidth,height:logicalHeight,baseX:x,baseY:y,section,avoid,anchor};scene.add(mesh);textItems.push(mesh);
 if(link){const el=document.createElement('a');el.className='contact-link';el.href=link;el.textContent=text;el.setAttribute('aria-label',text);document.body.append(el);linkItems.push({el,mesh});}return mesh;}
function clearText(){for(const m of textItems){scene.remove(m);m.geometry.dispose();m.material.map.dispose();m.material.dispose();}textItems=[];linkItems.forEach(l=>l.el.remove());linkItems=[];}
function layout(){width=innerWidth;height=innerHeight;mobile=width<=640;renderer.setSize(width,height);renderer.setPixelRatio(Math.min(devicePixelRatio,2));rt.setSize(Math.floor(width*renderer.getPixelRatio()),Math.floor(height*renderer.getPixelRatio()));camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();avatarCamera.aspect=width/height;avatarCamera.updateProjectionMatrix();post.uniforms.uResolution.value.set(width,height);
 const visibleHeight=2*Math.tan(THREE.MathUtils.degToRad(avatarCamera.fov/2))*600,headSize=(mobile?187.5:200)/180*visibleHeight/height;avatarPivot.scale.setScalar(headSize);surfaceUniforms.uRadius.value=70*headSize;sectionTops=[...main.querySelectorAll('section')].map(s=>s.offsetTop);
 if(lastLayoutW===width&&Math.abs(layoutH-height)<3)return;lastLayoutW=width;layoutH=height;clearText();if(!mobile)main.querySelectorAll('section').forEach(s=>{s.style.height='';s.style.maxHeight='';});
 let heroSize=mobile?Math.min(width*.091,39):Math.min(width*.052,76);const hero=profile.introduction.split('\n');measuring.font=`${heroSize}px Editorial`;const longest=Math.max(...hero.map(s=>measuring.measureText(s).width));heroSize*=Math.min(1,width*.90/longest);const leading=heroSize*1.15;
 hero.forEach((line,i)=>wrap(line,width*.91,heroSize).forEach((s,j)=>textMesh(s,{size:heroSize,y:height*.5+(i-(hero.length-1)/2)*leading+j*leading,section:0})));
 textMesh(profile.location,{size:mobile?10:13,font:'Arial',y:height*.5+leading*1.6+48,section:0});
 const bodySize=mobile?16:18,lineHeight=mobile?23:27,columnWidth=mobile?Math.max(82,width/2-82):Math.min(330,width*.28);
 profile.chapters.forEach((c,index)=>{const sec=index+1,titleY=mobile?145:160; textMesh(c.title,{size:mobile?49:66,y:titleY,section:sec});measuring.font=`${mobile?49:66}px Editorial`;const titleW=measuring.measureText(c.title).width;textMesh(c.label,{size:mobile?10:12,font:'Arial',anchor:'right',x:-titleW/2-(mobile?22:60),y:titleY+6,section:sec});textMesh(c.numeral,{size:mobile?10:12,font:'Arial',anchor:'left',x:titleW/2+(mobile?22:60),y:titleY+6,section:sec});
 const left=wrap(c.left,columnWidth,bodySize),right=wrap(c.right,columnWidth,bodySize),top=titleY+110;left.forEach((line,i)=>textMesh(line,{size:bodySize,anchor:'right',x:-9,y:top+i*lineHeight,section:sec,avoid:true}));const rightTop=mobile?top+left.length*lineHeight+30:top;if(mobile){const section=main.querySelectorAll('section')[sec];section.style.height=`${Math.max(height*1.1,rightTop+right.length*lineHeight+160)}px`;section.style.maxHeight='none';}right.forEach((line,i)=>textMesh(line,{size:bodySize,anchor:'left',x:9,y:rightTop+i*lineHeight,section:sec,avoid:true}));});
 const final=sectionTops.length-1;textMesh('A LITTLE MORE',{size:11,font:'Arial',y:height*.25,section:final});wrap(profile.closing,width*.85,mobile?38:65).forEach((line,i)=>textMesh(line,{size:mobile?38:65,y:height*.34+i*65,section:final}));profile.contact.forEach((c,i)=>textMesh(`${c.label} — ${c.text}`,{size:17,y:height*.66+i*36,section:final,link:c.url}));textMesh('Design. Explore. Repeat.',{size:13,font:'Arial',y:height*.82,section:final});sectionTops=[...main.querySelectorAll('section')].map(s=>s.offsetTop);updateText(1);}
function updateText(smoothing){const rx=mobile?97.5:125,ry=mobile?162:150;for(const mesh of textItems){const d=mesh.userData,screenY=sectionTops[d.section]+d.baseY-scroll;mesh.position.y=height/2-screenY;mesh.visible=screenY>-80&&screenY<height+80;let edge=d.baseX;if(d.avoid){const ratio=mesh.position.y/ry;if(Math.abs(ratio)<1){const delta=rx*Math.sqrt(1-ratio*ratio);edge=d.anchor==='right'?Math.min(edge,-delta):Math.max(edge,delta);}}let tx=edge;if(d.anchor==='left')tx+=d.width/2-6;if(d.anchor==='right')tx-=d.width/2-6;mesh.position.x=THREE.MathUtils.lerp(mesh.position.x,tx,smoothing);}for(const {el,mesh} of linkItems){const d=mesh.userData;el.style.display=mesh.visible?'block':'none';el.style.left=`${width/2+mesh.position.x-d.width/2}px`;el.style.top=`${height/2-mesh.position.y-d.height/2}px`;el.style.width=`${d.width}px`;el.style.height=`${d.height}px`;}}
let audioContext;
function playSound(){if(!sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const t=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(480,t);osc.frequency.exponentialRampToValueAtTime(95,t+.17);gain.gain.setValueAtTime(.08,t);gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+.26);}catch{}}
$('#sound').addEventListener('click',()=>{sound=!sound;$('#sound').setAttribute('aria-pressed',String(sound));$('#sound').setAttribute('aria-label',sound?'Turn sound off':'Turn sound on');playSound();});
function hit(){const now=performance.now()/1000;if(now-hitTime<.25)return;idleTime=performance.now();hitTime=now;activeHit=true;if(!reduceMotion){waves.unshift(new THREE.Vector4(.5,.5,now,1));waves.length=Math.min(waves.length,3);}playSound();const action=loadedActions.find(a=>/hit|shake/i.test(a.name));if(action)action.action.reset().setLoop(THREE.LoopOnce,1).play();$('#hint').textContent='A little ripple goes a long way.';}
$('#avatar-control').addEventListener('click',hit);
if(marbleVersion){
  const control=$('#avatar-control');
  const touchPoint=e=>{if(e.pointerType==='touch'){mouse.set(e.clientX/width*2-1,-e.clientY/height*2+1);idleTime=performance.now();}};
  control.addEventListener('pointerdown',touchPoint);control.addEventListener('pointermove',touchPoint);
  const release=e=>{if(e.pointerType==='touch')mouse.set(10,10);};
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
}
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;mouse.set(e.clientX/width*2-1,-e.clientY/height*2+1);if(!gyro){targetY=THREE.MathUtils.clamp(mouse.x*.65,-.6,.6);targetX=THREE.MathUtils.clamp(-mouse.y*.5,-.5,.5);}idleTime=performance.now();},{passive:true});window.addEventListener('pointerout',e=>{if(!e.relatedTarget){mouse.set(10,10);targetX=targetY=0;}});window.addEventListener('scroll',()=>{idleTime=performance.now();},{passive:true});
async function enableGyro(){try{if(typeof DeviceOrientationEvent==='undefined')return;if(typeof DeviceOrientationEvent.requestPermission==='function'){const state=await DeviceOrientationEvent.requestPermission();if(state!=='granted'){$('#motion').textContent='Motion not enabled';return;}}window.addEventListener('deviceorientation',orientation,{passive:true});$('#motion').hidden=true;}catch{$('#motion').textContent='Motion unavailable';}}
function orientation(e){if(e.beta==null||e.gamma==null)return;let x=e.beta,y=e.gamma;const angle=screen.orientation?.angle||0;if(angle===90){x=-e.gamma;y=e.beta;}else if(angle===270){x=e.gamma;y=-e.beta;}gyroBase??={x,y};gyro=true;targetX=THREE.MathUtils.clamp((x-gyroBase.x)/40,-.65,.65);targetY=THREE.MathUtils.clamp((y-gyroBase.y)/40,-.65,.65);idleTime=performance.now();}
if(matchMedia('(pointer:coarse)').matches&&typeof DeviceOrientationEvent!=='undefined'){if(typeof DeviceOrientationEvent.requestPermission==='function')$('#motion').hidden=false;else enableGyro();}$('#motion').addEventListener('click',enableGyro);screen.orientation?.addEventListener('change',()=>{gyroBase=null;});
window.addEventListener('resize',()=>{clearTimeout(window.__resizeTimer);window.__resizeTimer=setTimeout(layout,120);});document.addEventListener('visibilitychange',()=>{previous=performance.now()/1000;});
let startTime=performance.now()/1000;
function animate(ms){frame=requestAnimationFrame(animate);const now=ms/1000,dt=Math.min(now-previous||.016,.05);previous=now;const smoothing=1-Math.exp(-dt*10);scroll=reduceMotion?window.scrollY:THREE.MathUtils.lerp(scroll,window.scrollY,1-Math.exp(-dt*12));updateText(1-Math.exp(-dt*12));const sleeping=ms-idleTime>30000,tx=sleeping?.35:targetX,ty=sleeping?0:targetY,age=now-hitTime,bounce=activeHit&&!reduceMotion?Math.sin(age*21)*Math.exp(-age*4):0;if(age>1.7)activeHit=false;
 avatar.rotation.x=THREE.MathUtils.lerp(avatar.rotation.x,reduceMotion?0:tx+bounce*.18,smoothing);avatar.rotation.y=THREE.MathUtils.lerp(avatar.rotation.y,reduceMotion?0:ty+bounce*.25,smoothing);avatar.rotation.z=THREE.MathUtils.lerp(avatar.rotation.z,reduceMotion?0:ty*.17+bounce*.12,smoothing);avatar.position.y=reduceMotion?0:Math.sin(now*1.4)*(sleeping?5:2.2);const intro=reduceMotion?1:Math.min((now-startTime)/1.3,1);avatar.scale.setScalar((1-Math.pow(1-Math.max(0,intro),3))*(1+bounce*.05));if(!avatarLoaded){const blink=Math.pow(Math.max(0,Math.cos(now*1.25)),38);eyeGroup.scale.y=sleeping?.18:reduceMotion?1:1-blink*.87;}
 avatarScene.updateMatrixWorld();raycaster.setFromCamera(mouse,avatarCamera);const hits=raycaster.intersectObject(avatar,true);hover=THREE.MathUtils.lerp(hover,hits.length?1:0,1-Math.exp(-dt*12));surfaceUniforms.uHover.value=hover;if(hits.length)lightPosition.copy(hits[0].point);marbleReveal?.update(mouse,hover,width,height);cameraMirror?.update(dt,hover,lightPosition,surfaceUniforms.uRadius.value);loadedMixer?.update(dt);for(let i=0;i<3;i++){if(waves[i])post.uniforms.uWaves.value[i].copy(waves[i]);else post.uniforms.uWaves.value[i].set(0,0,0,0);}post.uniforms.uTime.value=now;
 renderer.setRenderTarget(rt);renderer.clear();renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.clear();renderer.render(postScene,postCamera);renderer.clearDepth();renderer.render(avatarScene,avatarCamera);
 const pageProgress=Math.max(0,Math.min(1,window.scrollY/(document.documentElement.scrollHeight-height)));$('#progress').style.width=`${pageProgress*100}%`;const current=Math.max(0,sectionTops.findLastIndex(t=>scroll+height*.4>=t));$('#chapter-number').textContent=String(current+1).padStart(3,'0');const active=current===0?'#intro':current===sectionTops.length-1?'#contact':'#quality';document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===active));}
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);document.body.classList.add('fallback');$('#hint').textContent='Reading mode';});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
await document.fonts.load('18px Editorial');await document.fonts.ready;await loadAvatar();layout();startTime=performance.now()/1000;requestAnimationFrame(animate);$('#loading').classList.add('done');
window.__aboutDebug={renderer,scene,avatar,profile,hit,marbleReveal,cameraMirror,get state(){return {variant:mirrorVersion?'mirror':marbleVersion?'marble':'original',width,height,scroll,hover,gyro,waves:waves.length,textLines:textItems.length,avatarLoaded};}};

