"use client";

import { useEffect, useRef } from "react";

export interface DitherWaveProps {
  speed?: number;
  pixel?: number;
  front?: string;
  back?: string;
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
uniform float uPixel;
uniform vec3 uFront;
uniform vec3 uBack;

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
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

float bayer8(vec2 a) {
  return bayer4(0.5 * a) * 0.25 + bayer2(a);
}

void main() {
  float size = max(1.0, uPixel);
  vec2 cell = floor(gl_FragCoord.xy / size);
  vec2 uv = cell * size / uResolution.y;
  float t = uTime * 0.4;
  float field = fbm(uv * 3.0 + vec2(t, t * 0.6));
  field += 0.3 * sin(uv.x * 4.0 + t * 2.0 + field * 6.0);
  vec2 pointer = uPointer * vec2(uResolution.x / uResolution.y, 1.0);
  float reach = length(uv - pointer);
  field += 0.45 * exp(-reach * reach * 9.0);
  float lit = step(bayer8(cell), clamp(field * 0.85, 0.0, 1.0));
  gl_FragColor = vec4(mix(uBack, uFront, lit), 1.0);
}`;

type UniformValue = number | string;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

export function DitherWave({ speed = 1, pixel = 4, front = "#a3b5cc", back = "#0b0d10", className = "" }: DitherWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef<Record<string, UniformValue>>({});
  const speedRef = useRef(speed);

  useEffect(() => {
    uniformsRef.current = { uPixel: pixel, uFront: front, uBack: back };
    speedRef.current = speed;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: true });
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

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
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
    window.addEventListener("pointermove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisible) return;
      if (!reduce) time += delta * speedRef.current;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      gl.uniform1f(locate("uTime"), time);
      gl.uniform2f(locate("uResolution"), canvas.width, canvas.height);
      gl.uniform2f(locate("uPointer"), pointer.x, pointer.y);
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
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
