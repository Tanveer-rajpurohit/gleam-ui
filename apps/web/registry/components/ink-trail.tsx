"use client";

import { useEffect, useRef } from "react";

export interface InkTrailProps {
  color?: string;
  tint?: string;
  size?: number;
  fade?: number;
  roughness?: number;
  opacity?: number;
  className?: string;
}

const VERTEX = `attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `precision highp float;

uniform sampler2D uTrail;
uniform float uTime;
uniform float uRoughness;
uniform float uOpacity;
uniform vec3 uCore;
uniform vec3 uEdge;
varying vec2 vUv;

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

void main() {
  vec2 warp = vec2(fbm(vUv * 6.0 + uTime * 0.15), fbm(vUv * 6.0 - uTime * 0.12 + vec2(31.7, 11.3))) - 0.5;
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y) + warp * uRoughness * 0.03;
  float a = texture2D(uTrail, uv).a;
  float body = smoothstep(0.22, 0.42, a);
  float halo = smoothstep(0.06, 0.22, a) * 0.18;
  float grain = 0.85 + 0.15 * noise(vUv * 220.0);
  vec3 color = mix(uEdge, uCore, smoothstep(0.3, 0.85, a));
  float alpha = max(body * grain, halo) * uOpacity;
  gl_FragColor = vec4(color * alpha, alpha);
}`;

const toRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

export function InkTrail({
  color = "#0b0d10",
  tint = "#44607f",
  size = 34,
  fade = 0.92,
  roughness = 0.6,
  opacity = 0.9,
  className = "",
}: InkTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ color, tint, size, fade, roughness, opacity });

  useEffect(() => {
    settingsRef.current = { color, tint, size, fade, roughness, opacity };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!canvas || !gl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    const trail = document.createElement("canvas");
    trail.width = 512;
    trail.height = 512;
    const brush = trail.getContext("2d")!;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const locate = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      trail: locate("uTrail"),
      time: locate("uTime"),
      roughness: locate("uRoughness"),
      opacity: locate("uOpacity"),
      core: locate("uCore"),
      edge: locate("uEdge"),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = canvas.width / Math.max(canvas.height, 1);
      trail.width = aspect >= 1 ? 512 : Math.round(512 * aspect);
      trail.height = aspect >= 1 ? Math.round(512 / aspect) : 512;
    };

    const pointer: { current: { x: number; y: number } | null; last: { x: number; y: number } | null } = {
      current: null,
      last: null,
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) {
        pointer.last = null;
        pointer.current = null;
        return;
      }
      pointer.current = { x, y };
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

    let time = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!isVisible) return;
      time += delta;
      const settings = settingsRef.current;
      const width = trail.width;
      const height = trail.height;

      brush.globalCompositeOperation = "destination-out";
      brush.fillStyle = `rgba(0,0,0,${(1 - settings.fade) * Math.min(delta * 60, 2) * 0.35 + 0.01})`;
      brush.fillRect(0, 0, width, height);
      brush.globalCompositeOperation = "source-over";

      if (pointer.current) {
        const from = pointer.last ?? pointer.current;
        const to = pointer.current;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy);
        const velocity = distance / Math.max(delta, 1 / 120);
        const radius = (settings.size / 900) * width * Math.min(Math.max(1.15 - velocity * 0.18, 0.3), 1.15);
        const steps = Math.max(1, Math.ceil((distance * width) / (radius * 0.4)));
        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const x = (from.x + dx * t) * width;
          const y = (from.y + dy * t) * height;
          const gradient = brush.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, "rgba(0,0,0,0.5)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          brush.fillStyle = gradient;
          brush.beginPath();
          brush.arc(x, y, radius, 0, Math.PI * 2);
          brush.fill();
        }
        pointer.last = { ...to };
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1i(uniforms.trail, 0);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.roughness, settings.roughness);
      gl.uniform1f(uniforms.opacity, settings.opacity);
      gl.uniform3f(uniforms.core, ...toRgb(settings.color));
      gl.uniform3f(uniforms.edge, ...toRgb(settings.tint));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizing.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
