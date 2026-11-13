"use client";

import { useEffect, useRef } from "react";

export interface ParticleFieldProps {
  count?: number;
  near?: string;
  far?: string;
  size?: number;
  speed?: number;
  intensity?: number;
  mode?: "drift" | "pulse";
  opacity?: number;
  className?: string;
}

const SIMPLEX = `vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}`;

const VERTEX = `${SIMPLEX}
attribute vec3 position;
attribute float seed;
uniform mat4 uProjection;
uniform float uTime;
uniform float uSize;
uniform float uPulse;
uniform vec2 uPointer;
uniform float uForce;
varying float vSeed;
varying float vDepth;

void main() {
  vSeed = seed;
  vec3 pos = position;
  float t = uTime * 0.18;
  float amp = 0.65 + 0.35 * seed;
  amp *= mix(1.0, 0.72 + 0.28 * sin(uTime * 0.9 + seed * 6.283), uPulse);
  pos.x += snoise(position * 0.32 + vec3(t, 0.0, 0.0)) * amp;
  pos.y += snoise(position * 0.32 + vec3(0.0, t, 37.2)) * amp;
  pos.z += snoise(position * 0.32 + vec3(91.3, 0.0, t)) * amp * 0.6;
  vec2 away = pos.xy - uPointer;
  float push = smoothstep(2.4, 0.0, length(away)) * uForce;
  pos.xy += normalize(away + 0.0001) * push;
  vec4 view = vec4(pos.x, pos.y, pos.z - 8.0, 1.0);
  vDepth = clamp((-view.z - 4.0) / 8.0, 0.0, 1.0);
  gl_PointSize = uSize * (0.55 + 0.9 * seed) * (34.0 / -view.z);
  gl_Position = uProjection * view;
}`;

const FRAGMENT = `precision highp float;
uniform vec3 uNear;
uniform vec3 uFar;
uniform float uOpacity;
varying float vSeed;
varying float vDepth;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float alpha = pow(smoothstep(0.5, 0.02, d), 1.6) * uOpacity * (0.35 + 0.65 * (1.0 - vDepth));
  gl_FragColor = vec4(mix(uNear, uFar, vSeed) * alpha, alpha);
}`;

const FOV = (50 * Math.PI) / 180;
const CAMERA_DISTANCE = 8;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const perspective = (aspect: number) => {
  const f = 1 / Math.tan(FOV / 2);
  const near = 0.1;
  const far = 100;
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
};

export function ParticleField({
  count = 3200,
  near = "#a3b5cc",
  far = "#44607f",
  size = 1,
  speed = 1,
  intensity = 1,
  mode = "drift",
  opacity = 1,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ near, far, size, speed, intensity, mode, opacity });

  useEffect(() => {
    settingsRef.current = { near, far, size, speed, intensity, mode, opacity };
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

    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 14;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 3;
      seeds[index] = Math.random();
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    const seedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const seedLocation = gl.getAttribLocation(program, "seed");
    gl.enableVertexAttribArray(seedLocation);
    gl.vertexAttribPointer(seedLocation, 1, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const locate = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      projection: locate("uProjection"),
      time: locate("uTime"),
      size: locate("uSize"),
      pulse: locate("uPulse"),
      pointer: locate("uPointer"),
      force: locate("uForce"),
      near: locate("uNear"),
      far: locate("uFar"),
      opacity: locate("uOpacity"),
    };

    let dpr = 1;
    let halfHeight = 1;
    let halfWidth = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 1.75);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = canvas.width / canvas.height;
      halfHeight = Math.tan(FOV / 2) * CAMERA_DISTANCE;
      halfWidth = halfHeight * aspect;
      gl.uniformMatrix4fv(uniforms.projection, false, perspective(aspect));
    };

    const pointer = { x: 999, y: 999, tx: 999, ty: 999, force: 0, inside: false };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.inside = Math.abs(x) <= 1 && Math.abs(y) <= 1;
      pointer.tx = x * halfWidth;
      pointer.ty = y * halfHeight;
      if (pointer.x > 900) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = Math.random() * 30;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisible) return;
      const settings = settingsRef.current;
      if (!reduce) time += delta * settings.speed;
      const follow = Math.min(delta * 6, 1);
      pointer.x += (pointer.tx - pointer.x) * follow;
      pointer.y += (pointer.ty - pointer.y) * follow;
      pointer.force += ((pointer.inside && !reduce ? settings.intensity : 0) - pointer.force) * Math.min(delta * 4, 1);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.size, settings.size * dpr);
      gl.uniform1f(uniforms.pulse, settings.mode === "pulse" ? 1 : 0);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.force, pointer.force);
      gl.uniform3f(uniforms.near, ...toRgb(settings.near));
      gl.uniform3f(uniforms.far, ...toRgb(settings.far));
      gl.uniform1f(uniforms.opacity, settings.opacity);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizing.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(seedBuffer);
      gl.deleteProgram(program);
    };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
