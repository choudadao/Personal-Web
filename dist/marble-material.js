import * as THREE from 'three';

// Independent procedural black marble, inspired by the supplied visual reference.
// The premium Textures.com asset is not downloaded or redistributed.
// Screen-space masking guarantees a circular reveal at every viewing angle.
export function createMarbleReveal(renderer, scene, settings = {}) {
  const uniforms = {
    uRevealPointer: { value: new THREE.Vector2(-10000, -10000) },
    uRevealAmount: { value: 0 },
    uRevealRadius: { value: settings.radius ?? 38 },
    uRevealFeather: { value: settings.feather ?? 10 },
    uRevealDpr: { value: renderer.getPixelRatio() },
    uStoneMin: { value: new THREE.Vector3() },
    uStoneScale: { value: 1 },
    uMarbleMap: { value: null },
    uMarbleRoughnessMap: { value: null },
    uUseMarbleMap: { value: 0 },
    uUseMarbleRoughness: { value: 0 },
    uMarbleRepeat: { value: settings.repeat ?? 1.5 },
  };

  // A small generated studio reflection gives polished stone readable highlights.
  // Only the marble page receives this environment; the original page is untouched.
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const c = canvas.getContext('2d');
  c.fillStyle = '#22232a'; c.fillRect(0, 0, 1024, 512);
  const g = c.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#626574'); g.addColorStop(.45, '#191b22'); g.addColorStop(1, '#343740');
  c.fillStyle = g; c.fillRect(0, 0, 1024, 512);
  c.filter = 'blur(7px)';
  c.fillStyle = '#ffffff'; c.fillRect(125, 60, 70, 280);
  c.fillStyle = '#b9c3dc'; c.fillRect(670, 115, 95, 225);
  c.fillStyle = '#eeeeef'; c.fillRect(320, 35, 310, 26);
  const environment = new THREE.CanvasTexture(canvas);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const reflection = pmrem.fromEquirectangular(environment);
  scene.environment = reflection.texture;
  environment.dispose(); pmrem.dispose();

  const helpers = /* glsl */`
    uniform vec2 uRevealPointer;
    uniform float uRevealAmount, uRevealRadius, uRevealFeather, uRevealDpr;
    uniform vec3 uStoneMin;
    uniform float uStoneScale, uUseMarbleMap, uUseMarbleRoughness, uMarbleRepeat;
    uniform sampler2D uMarbleMap, uMarbleRoughnessMap;
    varying vec3 vStonePosition;
    float stoneHash(vec3 p) {
      p = fract(p * .3183099 + vec3(.1, .2, .3));
      p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float stoneNoise(vec3 p) {
      vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
      return mix(mix(mix(stoneHash(i),stoneHash(i+vec3(1,0,0)),f.x),
                     mix(stoneHash(i+vec3(0,1,0)),stoneHash(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(stoneHash(i+vec3(0,0,1)),stoneHash(i+vec3(1,0,1)),f.x),
                     mix(stoneHash(i+vec3(0,1,1)),stoneHash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    float stoneFbm(vec3 p) {
      float n=0., a=.5;
      for(int i=0;i<4;i++){n+=a*stoneNoise(p);p=p*2.07+vec3(5.2,1.3,8.7);a*=.5;}
      return n;
    }
    vec3 marbleAlbedo(vec3 pos) {
      vec3 p=(pos-uStoneMin)*uStoneScale;
      if(uUseMarbleMap>.5){
        vec3 weights=pow(abs(normalize(cross(dFdx(pos),dFdy(pos)))),vec3(4.));
        weights/=max(dot(weights,vec3(1.)),.001);
        return texture2D(uMarbleMap,p.yz*uMarbleRepeat).rgb*weights.x+
               texture2D(uMarbleMap,p.xz*uMarbleRepeat).rgb*weights.y+
               texture2D(uMarbleMap,p.xy*uMarbleRepeat).rgb*weights.z;
      }
      vec3 warp=vec3(stoneFbm(p*3.),stoneFbm(p*3.+8.),stoneFbm(p*3.+19.));
      float field=stoneFbm(p*4.+warp*2.4);
      float vein=1.-smoothstep(.003,.016,abs(field-.48));
      float hairline=(1.-smoothstep(.001,.006,abs(stoneFbm(p*7.+warp)-.53)))*.35;
      float grain=stoneNoise(p*95.);
      vec3 base=mix(vec3(.006,.007,.009),vec3(.019,.021,.025),stoneFbm(p*8.));
      return mix(base,vec3(.58,.59,.61),clamp(vein*.86+hairline,0.,1.))*(.95+.08*grain);
    }
  `;

  function apply(model) {
    const bounds = new THREE.Box3().setFromObject(model);
    uniforms.uStoneMin.value.copy(bounds.min);
    uniforms.uStoneScale.value = 1 / Math.max(bounds.getSize(new THREE.Vector3()).y, .001);
    model.traverse(object => {
      if (!object.isMesh) return;
      object.geometry.computeBoundingBox(); const localBounds=object.geometry.boundingBox; const localSize=localBounds.getSize(new THREE.Vector3()); const originalMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const materials = originalMaterials.map(original => {
        const material = original.clone();
        material.metalness = Math.min(material.metalness ?? 0, .25);
        material.roughness = Math.max(material.roughness ?? .6, .4);
        material.envMapIntensity = .7;
        material.customProgramCacheKey = () => 'marble-screen-reveal-v1';
        material.onBeforeCompile = shader => {
          Object.assign(shader.uniforms, uniforms); shader.uniforms.uStoneMin={value:localBounds.min.clone()};shader.uniforms.uStoneScale={value:1/Math.max(localSize.y,.001)};
          shader.vertexShader = 'varying vec3 vStonePosition;\n' + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvStonePosition=position;');
          shader.fragmentShader = helpers + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
            #include <map_fragment>
            float cursorDistance=length(gl_FragCoord.xy / uRevealDpr-uRevealPointer);
            float revealMask=(1.-smoothstep(max(0.,uRevealRadius-uRevealFeather),uRevealRadius,cursorDistance))*uRevealAmount;
            diffuseColor.rgb=mix(marbleAlbedo(vStonePosition),diffuseColor.rgb,revealMask);
          `);
          shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
            #include <roughnessmap_fragment>
            float stoneRoughness=.19;
            if(uUseMarbleRoughness>.5){stoneRoughness=clamp(texture2D(uMarbleRoughnessMap,(vStonePosition.xy-uStoneMin.xy)*uStoneScale*uMarbleRepeat).r,.08,.65);}
            roughnessFactor=mix(stoneRoughness,roughnessFactor,revealMask);
          `);
          shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
            #include <metalnessmap_fragment>
            metalnessFactor=mix(.02,metalnessFactor,revealMask);
          `);
          shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
            vec3 stoneSurfaceNormal=normal;
            #include <normal_fragment_maps>
            normal=normalize(mix(stoneSurfaceNormal,normal,revealMask));
          `);
          shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
            // Preserve the blue hover effect as a restrained rim around the reveal.
            float blueRim=exp(-pow((cursorDistance-uRevealRadius*.85)/7.,2.))*uRevealAmount;
            outgoingLight+=vec3(.006,.018,.16)*blueRim;
            #include <opaque_fragment>
          `);
        };
        return material;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
    });
  }

  async function loadMaps() {
    const loader = new THREE.TextureLoader();
    for (const [url,key,flag,srgb] of [[settings.albedo,'uMarbleMap','uUseMarbleMap',true],[settings.roughness,'uMarbleRoughnessMap','uUseMarbleRoughness',false]]) {
      if (!url) continue;
      try { const texture = await loader.loadAsync(url); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        if(srgb) texture.colorSpace = THREE.SRGBColorSpace;
        uniforms[key].value = texture; uniforms[flag].value = 1;
      } catch(error) { console.warn('Marble map unavailable; procedural marble remains active.',error); }
    }
  }

  return {
    apply, loadMaps, uniforms,
    update(pointer, amount, viewportWidth, viewportHeight) {
      uniforms.uRevealPointer.value.set((pointer.x+1)*viewportWidth/2,(pointer.y+1)*viewportHeight/2);
      uniforms.uRevealAmount.value = amount;
      uniforms.uRevealDpr.value = renderer.getPixelRatio();
      uniforms.uRevealRadius.value = viewportWidth<=640 ? (settings.mobileRadius??28) : (settings.radius??38);
    },
    dispose() { reflection.dispose(); },
  };
}

