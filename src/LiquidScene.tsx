import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LiquidWake, liquidPoint, WAKE_COUNT, WAKE_LIFETIME } from "./liquidWake";

const fragment = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec4 uWake[${WAKE_COUNT}];
  uniform float uAge[${WAKE_COUNT}];
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
    float t=uTime*.075;
    vec2 q=vec2(noise(p+vec2(t,0.)),noise(p+vec2(4.2,1.3)-t));
    vec2 r=vec2(noise(p+1.15*q+vec2(1.7,9.2)+t*.3),noise(p+1.15*q+vec2(8.3,2.8)-t*.2));
    return noise(p+.85*r)*.65+noise(p*1.4+q)*.1;
  }
  void main() {
    vec2 uv=vUv;
    vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.)*3.3;
    vec2 displacement=vec2(0.);
    for(int i=0;i<${WAKE_COUNT};i++) {
      vec2 stroke=uWake[i].zw;
      float age=uAge[i];
      float along=clamp(dot(p-uWake[i].xy,stroke)/max(dot(stroke,stroke),.00001),0.,1.);
      vec2 delta=p-(uWake[i].xy+stroke*along);
      float radius=.18+age*.075;
      float influence=exp(-dot(delta,delta)/(radius*radius));
      float life=exp(-age*1.5)*(1.-exp(-age*28.))*(1.-smoothstep(1.6,${WAKE_LIFETIME.toFixed(1)},age));
      vec2 drag=stroke*2.8/(1.+length(stroke)*5.);
      float curl=(delta.x*stroke.y-delta.y*stroke.x)/(radius*radius);
      displacement+=(drag+vec2(-delta.y,delta.x)*curl*1.8)*influence*life;
    }
    p-=displacement;
    float f=field(p);
    float e=.008;
    vec3 n=normalize(vec3((field(p+vec2(e,0.))-f)/e,(field(p+vec2(0.,e))-f)/e,1.7));
    vec3 light=normalize(vec3(-.6,.9,1.));
    float spec=pow(max(dot(reflect(-light,n),vec3(0.,0.,1.)),0.),13.);
    float ridge=pow(.5+.5*sin(f*12.+p.y*.7),8.);
    float sheen=pow(max(dot(n,normalize(vec3(.4,-.6,1.))),0.),6.);
    vec3 col=vec3(.012,.016,.020)+vec3(.095,.12,.14)*sheen;
    col+=vec3(.13,.17,.20)*ridge+vec3(.20,.24,.27)*spec;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const wake = new LiquidWake();
    const uniforms = {
      uTime: { value: 18 },
      uResolution: { value: new THREE.Vector2() },
      uWake: { value: wake.segments },
      uAge: { value: wake.ages },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:
        "varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.);}",
      fragmentShader: fragment,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    let visible = true;
    let frame = 0;
    let last = 0;
    const resize = () => {
      wake.clear();
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
    const reset = () => wake.clear();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) wake.clear();
    });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerout", pointerOut);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", leave, { passive: true });
    document.addEventListener("visibilitychange", reset);
    // Limit the shader to 30 fps and suspend its work outside the viewport.
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (now - last < 32) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden || pausedRef.current) {
        wake.leave();
        return;
      }
      uniforms.uTime.value += dt;
      wake.advance(dt);
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
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="liquid-scene" aria-hidden="true" />;
}
