"use client";

import { useEffect, useRef } from "react";

export interface LiquidChromeProps {
  speed?: number;
  tint?: string;
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
uniform vec3 uTint;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float t = uTime * 0.6;
  vec2 pointer = (uPointer - 0.5) * 1.88 * vec2(uResolution.x / uResolution.y, 1.0);
  float d = length(p - vec3(sin(t) * 0.55, cos(t * 1.3) * 0.35, 0.0)) - 0.55;
  d = smin(d, length(p - vec3(cos(t * 0.8) * 0.7, sin(t * 1.1) * 0.45, sin(t * 0.7) * 0.3)) - 0.42, 0.45);
  d = smin(d, length(p - vec3(sin(t * 1.7 + 2.0) * 0.4, cos(t * 0.9 + 1.0) * 0.6, cos(t) * 0.25)) - 0.3, 0.4);
  d = smin(d, length(p - vec3(pointer, 0.1)) - 0.34, 0.5);
  return d;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

vec3 environment(vec3 d) {
  float bands = sin(d.y * 9.0 + d.x * 2.5 + uTime * 0.3) * 0.5 + 0.5;
  vec3 color = mix(vec3(0.03), vec3(1.0), smoothstep(0.25, 0.8, bands) * smoothstep(-0.6, 0.9, d.y));
  return mix(color, uTint, 0.4 * (1.0 - abs(d.y)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 origin = vec3(0.0, 0.0, 3.0);
  vec3 ray = normalize(vec3(uv, -1.6));
  float travelled = 0.0;
  float nearest = 10.0;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float d = map(origin + ray * travelled);
    nearest = min(nearest, d);
    if (d < 0.001) {
      hit = true;
      break;
    }
    travelled += d;
    if (travelled > 8.0) break;
  }
  if (!hit) {
    gl_FragColor = vec4(uTint, 1.0) * (1.0 - smoothstep(0.0, 0.012, nearest));
    return;
  }
  vec3 p = origin + ray * travelled;
  vec3 n = normalAt(p);
  float fresnel = pow(1.0 - max(dot(-ray, n), 0.0), 3.0);
  vec3 color = environment(reflect(ray, n)) * 0.85 + fresnel * mix(vec3(1.0), uTint, 0.5);
  gl_FragColor = vec4(color, 1.0);
}`;

type UniformValue = number | string;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

export function LiquidChrome({ speed = 1, tint = "#a3b5cc", className = "" }: LiquidChromeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef<Record<string, UniformValue>>({});
  const speedRef = useRef(speed);

  useEffect(() => {
    uniformsRef.current = { uTint: tint };
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
