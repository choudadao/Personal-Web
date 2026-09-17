import * as THREE from 'three';

/** Live single-camera reflection approximation. No recording, uploads or audio. */
export function createCameraMirror(renderer, scene, settings = {}) {
  const video = document.querySelector('#mirror-video');
  const panel = document.querySelector('#camera-panel');
  const startButton = document.querySelector('#camera-start');
  const stopButton = document.querySelector('#camera-stop');
  const switchButton = document.querySelector('#camera-switch');
  const status = document.querySelector('#camera-status');
  let stream = null, generation = 0, phase = 'off', facing = 'user';
  let liveFrames = 0, lastTime = -1, videoTexture = null, disposed = false;
  const materials = [];
  const empty = new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);
  empty.needsUpdate = true;
  const uniforms = {
    uCameraFeed: {value: empty}, uCameraLive: {value: 0}, uCameraMirror: {value: 1},
    uCameraAspect: {value: 4/3}, uMirrorHover: {value: 0},
    uMirrorPoint: {value: new THREE.Vector3()}, uMirrorRadius: {value: 35},
  };

  // Studio lighting remains available with the camera off or permission denied.
  const canvas = document.createElement('canvas');canvas.width=1024;canvas.height=512;
  const ctx = canvas.getContext('2d');
  const gradient=ctx.createLinearGradient(0,0,0,512);
  gradient.addColorStop(0,'#dadce2');gradient.addColorStop(.45,'#24252b');gradient.addColorStop(.65,'#101015');gradient.addColorStop(1,'#828794');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,512);ctx.filter='blur(4px)';
  ctx.fillStyle='#ffffff';ctx.fillRect(130,60,110,330);ctx.fillRect(600,80,60,270);ctx.fillRect(350,20,230,42);
  const studio=new THREE.CanvasTexture(canvas);studio.colorSpace=THREE.SRGBColorSpace;studio.mapping=THREE.EquirectangularReflectionMapping;
  const pmrem=new THREE.PMREMGenerator(renderer);const studioTarget=pmrem.fromEquirectangular(studio);
  scene.environment=studioTarget.texture;pmrem.dispose();studio.dispose();

  function apply(model) {
    model.traverse(object => {
      if(!object.isMesh)return;
      const material=new THREE.MeshPhysicalMaterial({color:0xe3e6eb,metalness:1,roughness:settings.roughness??.055,envMapIntensity:1.25,clearcoat:.15,clearcoatRoughness:.045,side:THREE.DoubleSide});
      material.customProgramCacheKey=()=> 'camera-chrome-reflection-v1';
      material.onBeforeCompile=shader=>{
        Object.assign(shader.uniforms,uniforms);
        shader.vertexShader='varying vec3 vMirrorWorld;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvMirrorWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
        shader.fragmentShader=`uniform sampler2D uCameraFeed;
          uniform float uCameraLive,uCameraMirror,uCameraAspect,uMirrorHover,uMirrorRadius;
          uniform vec3 uMirrorPoint;varying vec3 vMirrorWorld;\n`+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>', `
          // Reflect the camera ray using the actual per-fragment surface normal.
          // A single live frame supplies a virtual distant environment, not 360 capture.
          vec3 reflectionRay=reflect(-normalize(vViewPosition),normal);
          vec2 cameraUv=vec2(atan(reflectionRay.x,reflectionRay.z)/6.2831853+.5,
                             asin(clamp(reflectionRay.y,-1.,1.))/3.14159265+.5);
          cameraUv=(cameraUv-.5)*vec2(1.35,1.15)+.5;
          // Maintain the source frame aspect while filling the reflection field.
          if(uCameraAspect>1.)cameraUv.x=(cameraUv.x-.5)/uCameraAspect+.5;
          else cameraUv.y=(cameraUv.y-.5)*uCameraAspect+.5;
          cameraUv=clamp(cameraUv,.003,.997);
          cameraUv.x=mix(cameraUv.x,1.-cameraUv.x,uCameraMirror);
          vec3 liveColor=pow(max(texture2D(uCameraFeed,cameraUv).rgb,vec3(0.)),vec3(2.2));
          float fresnel=.84+.16*pow(1.-max(dot(normal,normalize(vViewPosition)),0.),5.);
          vec3 liveChrome=liveColor*vec3(.94,.96,1.)*fresnel*1.2;
          // Keep a little studio reflection so grazing angles retain a chrome silhouette.
          outgoingLight=mix(outgoingLight,liveChrome+outgoingLight*.12,uCameraLive*.94);
          float glow=exp(-pow(distance(vMirrorWorld,uMirrorPoint)/max(uMirrorRadius,.001),2.)*2.);
          outgoingLight+=vec3(.012,.03,.38)*glow*uMirrorHover;
          #include <opaque_fragment>
        `);
      };
      materials.push(material);object.material=material;
    });
  }

  async function loadMaps() {
    const loader=new THREE.TextureLoader();
    for(const [url,slot,srgb] of [[settings.albedo,'map',true],[settings.normal,'normalMap',false],[settings.roughnessMap,'roughnessMap',false],[settings.metalnessMap,'metalnessMap',false]]){
      if(!url)continue;
      try{const texture=await loader.loadAsync(url);if(srgb)texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;
        materials.forEach(m=>{m[slot]=texture;if(slot==='roughnessMap')m.roughness=1;m.needsUpdate=true;});
      }catch(error){console.warn('Optional chrome map unavailable; using clean polished chrome.',error);}
    }
  }

  function setStatus(next,message){
    phase=next;panel.dataset.state=next;status.textContent=message;
    const pending=next==='requesting',on=next==='live';
    startButton.hidden=on;startButton.disabled=pending;
    startButton.textContent=pending?'Waiting for permission…':'Enable camera';
    stopButton.hidden=!(on||pending);stopButton.textContent=pending?'Cancel':'Stop';
    switchButton.hidden=!on;video.hidden=!on;
  }
  function releaseStream(){
    const old=stream;stream=null;
    if(old)old.getTracks().forEach(t=>t.stop());
    video.pause();video.srcObject=null;uniforms.uCameraLive.value=0;
    if(videoTexture){videoTexture.dispose();videoTexture=null;uniforms.uCameraFeed.value=empty;}
  }
  function stop(message='Studio reflection · camera off'){
    generation++;releaseStream();setStatus('off',message);
  }
  function friendlyError(error){
    if(error.name==='NotAllowedError'||error.name==='SecurityError')return 'Camera not allowed. Enable permission in Safari or Chrome, then retry.';
    if(error.name==='NotFoundError'||error.name==='OverconstrainedError')return 'No available camera. Studio reflection is still active.';
    if(error.name==='NotReadableError'||error.name==='AbortError')return 'Camera is busy or unavailable. Close other camera apps and retry.';
    return 'Camera could not start. Studio reflection is still active.';
  }
  async function start(requestedFacing=facing){
    if(disposed||phase==='requesting')return;
    if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){setStatus('error','Open this page over HTTPS in Safari or Chrome to enable your camera.');return;}
    const operation=++generation;releaseStream();setStatus('requesting','Allow camera access to reflect your surroundings.');
    let acquired;
    try{
      acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:requestedFacing},width:{ideal:960},height:{ideal:720},frameRate:{ideal:24,max:30}}});
      if(operation!==generation||disposed||document.hidden){acquired.getTracks().forEach(t=>t.stop());return;}
      stream=acquired;video.srcObject=stream;video.muted=true;video.playsInline=true;
      await video.play();
      if(operation!==generation||disposed){acquired.getTracks().forEach(t=>t.stop());return;}
      const track=stream.getVideoTracks()[0];facing=track.getSettings().facingMode||requestedFacing;
      uniforms.uCameraMirror.value=facing==='user'?1:0;
      video.style.transform=facing==='user'?'scaleX(-1)':'none';
      videoTexture=new THREE.VideoTexture(video);videoTexture.colorSpace=THREE.NoColorSpace;
      videoTexture.minFilter=videoTexture.magFilter=THREE.LinearFilter;videoTexture.generateMipmaps=false;
      uniforms.uCameraFeed.value=videoTexture;liveFrames=0;lastTime=-1;
      track.addEventListener('ended',()=>{if(stream===acquired)stop('Camera disconnected · studio reflection restored');},{once:true});
      setStatus('live',facing==='user'?'Live · front camera':'Live · rear camera');
    }catch(error){
      if(operation!==generation){acquired?.getTracks().forEach(t=>t.stop());return;}
      releaseStream();setStatus('error',friendlyError(error));
    }
  }
  startButton.addEventListener('click',()=>start());stopButton.addEventListener('click',()=>stop());
  switchButton.addEventListener('click',()=>start(facing==='user'?'environment':'user'));
  const onHidden=()=>{if(document.hidden&&(stream||phase==='requesting'))stop('Camera paused · tap Enable camera to resume');};
  const onPageHide=()=>stop();
  document.addEventListener('visibilitychange',onHidden);window.addEventListener('pagehide',onPageHide);
  renderer.domElement.addEventListener('webglcontextlost',onPageHide);
  setStatus('off','Studio reflection · camera off');

  return {apply,loadMaps,start,stop,uniforms,
    update(dt,hover,point,radius){
      uniforms.uMirrorHover.value=hover;uniforms.uMirrorPoint.value.copy(point);uniforms.uMirrorRadius.value=radius;
      const ready=phase==='live'&&video.readyState>=2&&video.videoWidth>0;
      if(ready){uniforms.uCameraAspect.value=video.videoWidth/video.videoHeight;if(video.currentTime!==lastTime){liveFrames++;lastTime=video.currentTime;}}
      uniforms.uCameraLive.value=THREE.MathUtils.lerp(uniforms.uCameraLive.value,ready?1:0,1-Math.exp(-dt*8));
    },
    get state(){return {phase,facing,liveFrames,reflectionMix:uniforms.uCameraLive.value,activeTracks:stream?.getTracks().filter(t=>t.readyState==='live').length||0,audioTracks:stream?.getAudioTracks().length||0};},
    dispose(){disposed=true;stop();studioTarget.dispose();empty.dispose();document.removeEventListener('visibilitychange',onHidden);window.removeEventListener('pagehide',onPageHide);}
  };
}
