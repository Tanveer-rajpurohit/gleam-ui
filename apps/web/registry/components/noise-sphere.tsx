"use client";

import { useEffect, useRef } from "react";

export interface NoiseSphereProps {
  mode?: "wireframe" | "solid" | "points";
  amplitude?: number;
  frequency?: number;
  speed?: number;
  rotate?: number;
  detail?: number;
  valley?: string;
  peak?: string;
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
uniform mat4 uProjection;
uniform mat3 uRotation;
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uPointSize;
varying float vNoise;
varying vec3 vNormal;

float fbm(vec3 p) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return value;
}

void main() {
  vec3 normal = normalize(position);
  vNormal = normal;
  vNoise = fbm(position * uFrequency + uTime);
  vec3 displaced = uRotation * (position + normal * vNoise * uAmplitude);
  vec4 view = vec4(displaced.xy, displaced.z - 3.0, 1.0);
  gl_PointSize = uPointSize * (3.2 / -view.z);
  gl_Position = uProjection * view;
}`;

const FRAGMENT = `precision highp float;
uniform vec3 uValley;
uniform vec3 uPeak;
uniform float uAmplitude;
uniform float uOpacity;
uniform float uPoints;
varying float vNoise;
varying vec3 vNormal;

void main() {
  if (uPoints > 0.5 && distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;
  float t = clamp((vNoise + uAmplitude) / (2.0 * uAmplitude), 0.0, 1.0);
  vec3 color = mix(uValley, uPeak, t);
  float rim = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
  color += rim * 0.08;
  float alpha = uOpacity * mix(0.85, 1.0, t);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

const FOV = (50 * Math.PI) / 180;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const perspective = (aspect: number) => {
  const f = 1 / Math.tan(FOV / 2);
  const near = 0.1;
  const far = 50;
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
};

const rotation = (x: number, y: number) => {
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  return new Float32Array([cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
};

const buildSphere = (detail: number) => {
  const rings = Math.max(8, Math.min(Math.round(detail), 160));
  const positions: number[] = [];
  for (let lat = 0; lat <= rings; lat++) {
    const theta = (lat / rings) * Math.PI;
    for (let lon = 0; lon <= rings; lon++) {
      const phi = (lon / rings) * Math.PI * 2;
      positions.push(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
    }
  }
  const triangles: number[] = [];
  const lines: number[] = [];
  for (let lat = 0; lat < rings; lat++) {
    for (let lon = 0; lon < rings; lon++) {
      const a = lat * (rings + 1) + lon;
      const b = a + rings + 1;
      triangles.push(a, b, a + 1, b, b + 1, a + 1);
      lines.push(a, b, a, a + 1, b, a + 1);
    }
  }
  return {
    positions: new Float32Array(positions),
    triangles: new Uint16Array(triangles),
    lines: new Uint16Array(lines),
    vertexCount: positions.length / 3,
  };
};

export function NoiseSphere({
  mode = "wireframe",
  amplitude = 0.35,
  frequency = 1.6,
  speed = 0.4,
  rotate = 0.12,
  detail = 96,
  valley = "#44607f",
  peak = "#a3b5cc",
  opacity = 1,
  className = "",
}: NoiseSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ mode, amplitude, frequency, speed, rotate, valley, peak, opacity });

  useEffect(() => {
    settingsRef.current = { mode, amplitude, frequency, speed, rotate, valley, peak, opacity };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
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

    const sphere = buildSphere(detail);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.triangles, gl.STATIC_DRAW);
    const lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.lines, gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const locate = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      projection: locate("uProjection"),
      rotation: locate("uRotation"),
      time: locate("uTime"),
      amplitude: locate("uAmplitude"),
      frequency: locate("uFrequency"),
      pointSize: locate("uPointSize"),
      valley: locate("uValley"),
      peak: locate("uPeak"),
      opacity: locate("uOpacity"),
      points: locate("uPoints"),
    };

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniformMatrix4fv(uniforms.projection, false, perspective(canvas.width / canvas.height));
    };

    const pointer = { x: 10, y: 10 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
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
    let time = Math.random() * 50;
    let spinX = 0;
    let spinY = 0;
    let boost = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisible) return;
      const settings = settingsRef.current;
      if (!reduce) {
        time += delta * settings.speed;
        spinY += delta * settings.rotate;
        spinX += delta * settings.rotate * 0.35;
        const target = Math.max(0, 1 - Math.hypot(pointer.x, pointer.y)) * 0.6;
        boost += (target - boost) * Math.min(delta * 3, 1);
      }
      const amplitude = settings.amplitude * (1 + boost);
      const isPoints = settings.mode === "points";

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (settings.mode === "solid") gl.enable(gl.DEPTH_TEST);
      else gl.disable(gl.DEPTH_TEST);
      gl.uniformMatrix3fv(uniforms.rotation, false, rotation(spinX, spinY));
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.amplitude, amplitude);
      gl.uniform1f(uniforms.frequency, settings.frequency);
      gl.uniform1f(uniforms.pointSize, 4 * dpr);
      gl.uniform3f(uniforms.valley, ...toRgb(settings.valley));
      gl.uniform3f(uniforms.peak, ...toRgb(settings.peak));
      gl.uniform1f(uniforms.opacity, settings.opacity);
      gl.uniform1f(uniforms.points, isPoints ? 1 : 0);

      if (isPoints) {
        gl.drawArrays(gl.POINTS, 0, sphere.vertexCount);
      } else if (settings.mode === "solid") {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
        gl.drawElements(gl.TRIANGLES, sphere.triangles.length, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
        gl.drawElements(gl.LINES, sphere.lines.length, gl.UNSIGNED_SHORT, 0);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizing.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(triangleBuffer);
      gl.deleteBuffer(lineBuffer);
      gl.deleteProgram(program);
    };
  }, [detail]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
