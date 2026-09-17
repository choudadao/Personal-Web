import fs from 'node:fs';
function edit(path,from,to){const s=fs.readFileSync(path,'utf8');if(!s.includes(from))throw new Error(path+' missing match');fs.writeFileSync(path,s.replace(from,to));}
edit('dist/app.js','(mobile?125:200)','(mobile?187.5:200)');
edit('dist/app.js','rx=mobile?65:125,ry=mobile?108:150','rx=mobile?97.5:125,ry=mobile?162:150');
edit('dist/content.js','mirror: { roughness: .055','mirror: { roughness: .22');
edit('dist/camera-mirror.js','roughness:settings.roughness??.055','roughness:settings.roughness??.22');
edit('dist/camera-mirror.js','clearcoat:.15,clearcoatRoughness:.045','clearcoat:.05,clearcoatRoughness:.22');
edit('dist/camera-mirror.js',"uCameraAspect: {value: 4/3}","uCameraBlur: {value: (settings.roughness??.22)*.12}, uCameraAspect: {value: 4/3}");
edit('dist/camera-mirror.js','uCameraLive,uCameraMirror,uCameraAspect,uMirrorHover,uMirrorRadius','uCameraLive,uCameraMirror,uCameraAspect,uMirrorHover,uMirrorRadius,uCameraBlur');
edit('dist/camera-mirror.js','vec3 liveColor=pow(max(texture2D(uCameraFeed,cameraUv).rgb,vec3(0.)),vec3(2.2));',`// A small weighted filter softens the live reflection as well as the studio material.
          vec3 liveColor=vec3(0.);
          vec2 blurStep=vec2(uCameraBlur/max(uCameraAspect,.1),uCameraBlur);
          for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
            float weight=float((x==0?2:1)*(y==0?2:1))/16.;
            vec2 sampleUv=clamp(cameraUv+vec2(float(x),float(y))*blurStep,.003,.997);
            liveColor+=pow(max(texture2D(uCameraFeed,sampleUv).rgb,vec3(0.)),vec3(2.2))*weight;
          }`);
fs.appendFileSync('dist/style.css',`\n/* Once mobile camera access succeeds, retain only compact camera controls. */
@media(max-width:640px){
 .camera-panel[data-state="live"]{width:auto;padding:6px 8px;border-radius:24px;}
 .camera-panel[data-state="live"] .camera-top,.camera-panel[data-state="live"] .camera-note{display:none;}
 .camera-panel[data-state="live"] .camera-actions{margin:0;}
 .camera-panel[data-state="live"] .camera-actions button{border-radius:18px;}
}\n`);
edit('scripts/qa-camera.cjs',"await mobile.locator('#camera-stop').click();",`assert.equal(await mobile.locator('.camera-top').isVisible(),false,'Mobile permission panel should collapse after camera starts');assert.equal(await mobile.locator('.camera-note').isVisible(),false);assert(await mobile.locator('#camera-stop').isVisible());await mobile.locator('#camera-stop').click();assert(await mobile.locator('.camera-top').isVisible());`);
