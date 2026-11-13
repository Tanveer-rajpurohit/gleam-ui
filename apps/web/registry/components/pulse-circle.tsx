"use client";

import { useEffect, useRef } from "react";

export interface PulseCircleProps {
  mode?: "pulse" | "sonar";
  size?: number;
  color?: string;
  rings?: number;
  speed?: number;
  thickness?: number;
  wobble?: number;
  intensity?: number;
  opacity?: number;
  className?: string;
}

const VERTEX = `attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uForce;
uniform float uMode;
uniform float uRings;
uniform float uThickness;
uniform float uWobble;
uniform vec3 uColor;
uniform float uOpacity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += noise(p) * amp;
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

float organicRing(vec2 st, float radius, float t) {
  float angle = atan(st.y, st.x);
  float wob = fbm(vec2(cos(angle), sin(angle)) * 1.6 + t * 0.35) - 0.5;
  return abs(length(st) - (radius + wob * uWobble * 0.12));
}

void main() {
  vec2 st = gl_FragCoord.xy / uResolution - 0.5;
  float t = uTime;
  vec2 m = uPointer - 0.5;
  float md = length(st - m);
  float influence = smoothstep(0.55, 0.0, md) * uForce;
  st += normalize(st - m + 0.0001) * influence * -0.08;
  st += vec2(noise(st * 24.0 + t), noise(st * 24.0 - t)) * influence * 0.05;

  float alpha = 0.0;
  if (uMode < 0.5) {
    float radius = 0.2 + 0.05 * sin(t * 2.0);
    float d = organicRing(st, radius, t);
    float core = 1.0 - smoothstep(0.0, 0.012, length(st) - (radius - 0.02));
    float halo = smoothstep(0.16, 0.0, d) * 0.35;
    float edge = smoothstep(0.008 + uThickness * 0.01, 0.0, d);
    alpha = max(core * 0.9, max(halo, edge));
  } else {
    for (float i = 0.0; i < 6.0; i++) {
      if (i >= uRings) break;
      float phase = fract(t * 0.3 + i / uRings);
      float radius = mix(0.02, 0.46, phase);
      float d = organicRing(st, radius, t + i * 7.0);
      float ring = smoothstep(0.006 + uThickness * 0.008, 0.0, d);
      alpha += ring * (1.0 - phase);
    }
    alpha += (1.0 - smoothstep(0.02, 0.035, length(st))) * 0.9;
  }
  alpha *= 1.0 - influence * 0.6;
  float a = clamp(alpha, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(uColor * a, a);
}`;

type UniformValue = number | string;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

export function PulseCircle({ mode = "sonar", size = 160, color = "#a3b5cc", rings = 3, speed = 1, thickness = 1, wobble = 0.5, intensity = 1, opacity = 1, className = "" }: PulseCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef<Record<string, UniformValue>>({});
  const motionRef = useRef({ speed, intensity });

  useEffect(() => {
    uniformsRef.current = { uMode: mode === "pulse" ? 0 : 1, uRings: Math.min(rings, 6), uThickness: thickness, uWobble: wobble, uColor: color, uOpacity: opacity };
    motionRef.current = { speed, intensity };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const locations = new Map<string, WebGLUniformLocation | null>();
    const locate = (name: string) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
      return locations.get(name) ?? null;
    };

    const pointer = { x: -10, y: -10, tx: -10, ty: -10, force: 0, inside: false };
    const reach = 0.5;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      pointer.inside = x > -reach && x < 1 + reach && y > -reach && y < 1 + reach;
      if (!pointer.inside) return;
      if (pointer.x < -5) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.75);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let isVisible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
    });
    const sizing = new ResizeObserver(resize);
    visibility.observe(canvas);
    sizing.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = Math.random() * 40;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisible) return;
      const { speed: rate, intensity: strength } = motionRef.current;
      if (!reduce) time += delta * rate;
      const follow = Math.min(delta * 7, 1);
      pointer.x += (pointer.tx - pointer.x) * follow;
      pointer.y += (pointer.ty - pointer.y) * follow;
      const target = pointer.inside && !reduce ? strength : 0;
      pointer.force += (target - pointer.force) * Math.min(delta * 5, 1);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(locate("uTime"), time);
      gl.uniform2f(locate("uResolution"), canvas.width, canvas.height);
      gl.uniform2f(locate("uPointer"), pointer.x, pointer.y);
      gl.uniform1f(locate("uForce"), pointer.force);
      for (const [name, value] of Object.entries(uniformsRef.current)) {
        if (typeof value === "number") gl.uniform1f(locate(name), value);
        else gl.uniform3f(locate(name), ...toRgb(value));
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizing.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`block ${className}`} style={{ width: size, height: size }} />;
}
