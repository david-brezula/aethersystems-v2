import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import { LiquidWake, WAKE_COUNT } from "./liquidWake";

// Height/previous-height ping-pong, following Three.js's GPGPU water approach.
const waterStep = `
  uniform vec2 uWorld;
  uniform float uRadius;
  uniform vec4 uStrokes[${WAKE_COUNT}];
  uniform int uStrokeCount;
  void main() {
    vec2 texel=1./resolution;
    vec2 uv=gl_FragCoord.xy*texel;
    vec2 state=texture2D(heightmap,uv).rg;
    float neighbors=texture2D(heightmap,uv+vec2(texel.x,0.)).r
      +texture2D(heightmap,uv-vec2(texel.x,0.)).r
      +texture2D(heightmap,uv+vec2(0.,texel.y)).r
      +texture2D(heightmap,uv-vec2(0.,texel.y)).r;
    float height=state.x+(state.x-state.y)*.978+.24*(neighbors-4.*state.x);
    vec2 p=(uv-.5)*uWorld;
    for(int i=0;i<${WAKE_COUNT};i++) {
      if(i>=uStrokeCount) break;
      vec2 stroke=uStrokes[i].zw;
      float along=clamp(dot(p-uStrokes[i].xy,stroke)/max(dot(stroke,stroke),.000001),0.,1.);
      vec2 offset=p-uStrokes[i].xy-stroke*along;
      float d2=dot(offset,offset)/(uRadius*uRadius);
      // A depression and raised rim displace water without adding a lasting volume.
      height+=(d2-1.)*exp(-d2)*.007*min(length(stroke)/.035,2.);
    }
    vec2 edge=min(uv,1.-uv)*resolution;
    float absorb=mix(.85,1.,smoothstep(0.,10.,min(edge.x,edge.y)));
    gl_FragColor=vec4(height*absorb*.9995,state.x*absorb,0.,1.);
  }
`;

export function createWaterSurface(
  renderer: THREE.WebGLRenderer,
  width: number,
  height: number,
  wake: LiquidWake,
) {
  if (!renderer.extensions.has("EXT_color_buffer_float")) return null;
  const scale = 384 / Math.max(width, height);
  const nx = Math.max(32, Math.round(width * scale));
  const ny = Math.max(32, Math.round(height * scale));
  const compute = new GPUComputationRenderer(nx, ny, renderer);
  compute.setDataType(THREE.HalfFloatType);
  const seed = compute.createTexture();
  const water = compute.addVariable("heightmap", waterStep, seed);
  water.minFilter = water.magFilter = THREE.LinearFilter;
  compute.setVariableDependencies(water, [water]);
  const uniforms = water.material.uniforms;
  uniforms.uWorld = { value: new THREE.Vector2((width / height) * 3.3, 3.3) };
  uniforms.uRadius = { value: (26 / height) * 3.3 };
  uniforms.uStrokes = { value: wake.segments };
  uniforms.uStrokeCount = { value: 0 };
  if (compute.init()) {
    water.material.dispose();
    compute.dispose();
    return null;
  }
  let accumulator = 0;
  return {
    texel: new THREE.Vector2(1 / nx, 1 / ny),
    get texture() { return compute.getCurrentRenderTarget(water).texture; },
    step(dt: number) {
      accumulator += Math.min(dt, 0.05);
      while (accumulator >= 1 / 60) {
        uniforms.uStrokeCount.value = wake.consume();
        compute.compute();
        accumulator -= 1 / 60;
      }
    },
    reset() {
      accumulator = 0;
      compute.renderTexture(seed, compute.getCurrentRenderTarget(water));
      compute.renderTexture(seed, compute.getAlternateRenderTarget(water));
    },
    dispose() {
      water.material.dispose();
      compute.dispose();
    },
  };
}
