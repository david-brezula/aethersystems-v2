import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LiquidWake, liquidPoint } from "./liquidWake";
import { createWaterSurface } from "./WaterSurface";

export const liquidFragment = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform sampler2D uWater;
  uniform vec2 uWaterTexel;
  varying vec2 vUv;
  vec3 mod289(vec3 x) { return x-floor(x*(1.0/289.0))*289.0; }
  vec2 mod289(vec2 x) { return x-floor(x*(1.0/289.0))*289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float noise(vec2 v) {
    const vec4 C=vec4(.2113248654,.3660254038,-.5773502692,.0243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=x0.x>x0.y?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5;
    vec3 ox=floor(x+.5); vec3 a=x-ox;
    m*=1.792842914-.85373472*(a*a+h*h);
    vec3 g; g.x=a.x*x0.x+h.x*x0.y; g.yz=a.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }
  float field(vec2 p) {
    float t=uTime*.022;
    p*=1.35;
    // Shared transport keeps fine folds attached to the larger moving surface.
    p+=vec2(t*.34,-t*.22);
    vec2 q=vec2(noise(p*.8+vec2(t*.16,0.)),noise(p*.8+vec2(4.2,1.3)));
    vec2 r=vec2(noise(p+.72*q+vec2(1.7,9.2)),noise(p+.72*q+vec2(8.3,2.8)));
    return noise(p+.64*r)*.65+noise(p*1.4+.55*q)*.075;
  }
  void main() {
    vec2 uv=vUv;
    vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.)*3.3;
    vec2 tap=uWaterTexel*2.;
    vec2 waterSlope=vec2(
      texture2D(uWater,uv+vec2(tap.x,0.)).r-texture2D(uWater,uv-vec2(tap.x,0.)).r,
      texture2D(uWater,uv+vec2(0.,tap.y)).r-texture2D(uWater,uv-vec2(0.,tap.y)).r
    )/(2.*tap*vec2(uResolution.x/uResolution.y,1.)*3.3);
    // Visible refraction follows the outward wave slope, not the cursor's drag vector.
    p-=waterSlope*.32/(1.+length(waterSlope)*1.8);
    float f=field(p);
    float e=.018;
    vec2 baseSlope=vec2(
      field(p+vec2(e,0.))-field(p-vec2(e,0.)),
      field(p+vec2(0.,e))-field(p-vec2(0.,e))
    )/(2.*e);
    vec3 n=normalize(vec3(baseSlope+waterSlope*2.4,2.2));
    vec3 reflected=reflect(vec3(0.,0.,-1.),n);
    // Broad studio reflections give folds volume without repeated contour bands.
    float softbox=exp(-pow((reflected.x+.32)/.58,2.)-pow((reflected.y-.45)/.85,2.));
    float rim=exp(-pow((reflected.x-.65)/.25,2.)-pow((reflected.y+.2)/.9,2.));
    float body=smoothstep(-.42,.55,f)*.035;
    vec3 col=vec3(.009,.012,.016)+vec3(.11,.155,.19)*softbox;
    col+=vec3(.055,.08,.10)*rim+vec3(.6,.75,.85)*body;
    col*=.60+.4*smoothstep(0.,.7,uv.x);
    col*=.6+.4*smoothstep(0.,.45,uv.y);
    gl_FragColor=vec4(col,1.);
  }
`;

export default function LiquidScene({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const wake = new LiquidWake();
    const flatWater = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    flatWater.needsUpdate = true;
    let water: ReturnType<typeof createWaterSurface> = null;
    const uniforms = {
      uTime: { value: 18 },
      uResolution: { value: new THREE.Vector2() },
      uWater: { value: flatWater as THREE.Texture },
      uWaterTexel: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:
        "varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.);}",
      fragmentShader: liquidFragment,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    let visible = true;
    let frame = 0;
    let last = 0;
    const resize = () => {
      if (!container.clientWidth || !container.clientHeight) return;
      wake.clear();
      water?.dispose();
      water = createWaterSurface(renderer, container.clientWidth, container.clientHeight, wake);
      uniforms.uWater.value = water?.texture ?? flatWater;
      uniforms.uWaterTexel.value.copy(water?.texel ?? new THREE.Vector2(1, 1));
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.uResolution.value.set(
        container.clientWidth,
        container.clientHeight,
      );
      renderer.render(scene, camera);
    };
    const pointer = (event: PointerEvent) => {
      if (pausedRef.current || !visible || document.hidden || event.pointerType === "touch") {
        wake.leave();
        return;
      }
      const point = liquidPoint(event.clientX, event.clientY, container.getBoundingClientRect());
      if (point) wake.move(point.x, point.y, event.timeStamp);
      else wake.leave();
    };
    const leave = () => wake.leave();
    const pointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) leave();
    };
    const reset = () => {
      wake.clear();
      water?.reset();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) reset();
    });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerout", pointerOut);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", leave, { passive: true });
    document.addEventListener("visibilitychange", reset);
    // Target 60 fps without doubling the workload on high-refresh displays.
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (now - last < 1000 / 60 - 0.5) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden || pausedRef.current) {
        wake.clear();
        return;
      }
      uniforms.uTime.value += dt;
      water?.step(dt);
      uniforms.uWater.value = water?.texture ?? flatWater;
      renderer.render(scene, camera);
    };
    resize();
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("pointerout", pointerOut);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", leave);
      document.removeEventListener("visibilitychange", reset);
      geometry.dispose();
      material.dispose();
      water?.dispose();
      flatWater.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="liquid-scene" aria-hidden="true" />;
}
