import * as THREE from 'three';

export const shaderLib = {
  noise: `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `,
  
  fbm: `
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < octaves; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }
  `,
  
  glow: `
    float glow(vec2 uv, vec2 center, float radius, float softness) {
      float dist = length(uv - center);
      return 1.0 - smoothstep(radius - softness, radius + softness, dist);
    }
  `,
  
  vignette: `
    vec3 vignette(vec3 color, vec2 uv, float intensity, float smoothness) {
      float dist = distance(uv, vec2(0.5));
      float vignette = smoothstep(0.8, 0.8 - smoothness, dist * (1.0 + intensity));
      return color * vignette;
    }
  `,
};

export const vertexShaders = {
  particles: `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandom;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    ${shaderLib.noise}
    
    void main() {
      vec3 pos = position;
      
      float noiseVal = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.2));
      pos += aRandom * noiseVal * 0.5;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      float sizeAtten = (1.0 / -mvPosition.z);
      gl_PointSize = uSize * uPixelRatio * aScale * sizeAtten;
      
      vColor = mix(vec3(0.0, 0.51, 0.85), vec3(0.2, 0.8, 1.0), aRandom.x);
      vAlpha = 0.6 + 0.4 * aRandom.y;
    }
  `,
  
  wave: `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    varying vec2 vUv;
    varying float vElevation;
    
    ${shaderLib.noise}
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noise = snoise(vec3(pos.x * uFrequency, pos.y * uFrequency, uTime * 0.5));
      pos.z += noise * uAmplitude;
      
      vElevation = noise;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  
  distortion: `
    uniform float uTime;
    uniform float uDistortion;
    
    varying vec2 vUv;
    varying float vDistortion;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      pos.x += sin(pos.y * 10.0 + uTime) * uDistortion;
      pos.y += cos(pos.x * 10.0 + uTime) * uDistortion;
      
      vDistortion = sin(pos.y * 10.0 + uTime) * uDistortion;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
};

export const fragmentShaders = {
  particles: `
    uniform float uTime;
    uniform vec3 uColor;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      strength = pow(strength, 1.5);
      
      gl_FragColor = vec4(vColor * uColor, strength * vAlpha);
    }
  `,
  
  wave: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      float mixStrength = (vElevation + 1.0) * 0.5;
      vec3 color = mix(uColorA, uColorB, mixStrength);
      
      float brightness = 0.8 + 0.2 * sin(vElevation * 10.0 + uTime * 2.0);
      color *= brightness;
      
      gl_FragColor = vec4(color, 0.9);
    }
  `,
  
  grid: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uGridSize;
    uniform float uLineWidth;
    
    varying vec2 vUv;
    
    void main() {
      vec2 grid = fract(vUv * uGridSize);
      float lineX = step(1.0 - uLineWidth, grid.x);
      float lineY = step(1.0 - uLineWidth, grid.y);
      float lines = max(lineX, lineY);
      
      float fade = 1.0 - length(vUv - 0.5) * 1.5;
      fade = clamp(fade, 0.0, 1.0);
      
      gl_FragColor = vec4(uColor, lines * fade * 0.5);
    }
  `,
  
  chromatic: `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform float uAngle;
    
    varying vec2 vUv;
    
    void main() {
      vec2 offset = uAmount * vec2(cos(uAngle), sin(uAngle));
      
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
  
  scanlines: `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uCount;
    
    varying vec2 vUv;
    
    void main() {
      float scanline = sin(vUv.y * uCount + uTime * 5.0) * 0.5 + 0.5;
      scanline = pow(scanline, 1.5);
      
      gl_FragColor = vec4(vec3(scanline * uIntensity), 1.0);
    }
  `,
};

export function createShaderMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createUniforms<T extends Record<string, any>>(values: T): Record<string, THREE.IUniform> {
  const uniforms: Record<string, THREE.IUniform> = {};
  for (const [key, value] of Object.entries(values)) {
    uniforms[key] = { value };
  }
  return uniforms;
}