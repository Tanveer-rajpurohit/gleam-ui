"use client";

import { useEffect, useRef } from "react";

export interface WaterRippleProps {
  text?: string;
  background?: string;
  color?: string;
  font?: string;
  className?: string;
}

const VERTEX = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const SIMULATION = `#version 300 es
precision highp float;

uniform sampler2D uState;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 texel = 1.0 / uResolution;
  vec4 data = texture(uState, vUv);
  float pressure = data.x;
  float velocity = data.y;

  float right = texture(uState, vUv + vec2(texel.x, 0.0)).x;
  float left = texture(uState, vUv - vec2(texel.x, 0.0)).x;
  float up = texture(uState, vUv + vec2(0.0, texel.y)).x;
  float down = texture(uState, vUv - vec2(0.0, texel.y)).x;

  if (vUv.x <= texel.x) left = right;
  if (vUv.x >= 1.0 - texel.x) right = left;
  if (vUv.y <= texel.y) down = up;
  if (vUv.y >= 1.0 - texel.y) up = down;

  velocity += 0.4 * (-2.0 * pressure + right + left + up + down) / 4.0;
  pressure += 0.4 * velocity;

  float aspect = uResolution.x / uResolution.y;
  float reach = distance(vUv * vec2(aspect, 1.0), uPointer * vec2(aspect, 1.0));
  float radius = 0.045;
  float force = length(uVelocity);
  if (force > 0.0005 && reach < radius) {
    velocity += min(force * 22.0, 1.4) * smoothstep(radius, 0.0, reach);
  }

  velocity *= 0.985;
  pressure *= 0.975;

  outColor = vec4(pressure, velocity, (right - left) / 2.0, (up - down) / 2.0);
}`;

const RENDER = `#version 300 es
precision highp float;

uniform sampler2D uState;
uniform sampler2D uScene;
in vec2 vUv;
out vec4 outColor;

void main() {
  vec4 data = texture(uState, vUv);
  vec2 distortion = 0.2 * data.zw;
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y) + vec2(distortion.x, -distortion.y);
  float offset = 0.003;
  float r = texture(uScene, uv - offset).r;
  float g = texture(uScene, uv).g;
  float b = texture(uScene, uv + offset).b;
  vec3 normal = normalize(vec3(-data.z, 0.3, -data.w));
  float specular = pow(max(0.0, dot(normal, normalize(vec3(1.0)))), 40.0) * 2.0;
  outColor = vec4(vec3(r, g, b) + specular, 1.0);
}`;

export function WaterRipple({
  text = "Gleam",
  background = "#a3b5cc",
  color = "#0b0d10",
  font = "600 160px sans-serif",
  className = "",
}: WaterRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { antialias: false });
    if (!canvas || !gl || !gl.getExtension("EXT_color_buffer_float")) return;

    const build = (fragment: string) => {
      const program = gl.createProgram()!;
      for (const [type, source] of [
        [gl.VERTEX_SHADER, VERTEX],
        [gl.FRAGMENT_SHADER, fragment],
      ] as const) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
      }
      gl.bindAttribLocation(program, 0, "position");
      gl.linkProgram(program);
      return program;
    };
    const simulation = build(SIMULATION);
    const render = build(RENDER);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const makeTexture = () => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };

    let states = [makeTexture(), makeTexture()];
    const framebuffers = [gl.createFramebuffer()!, gl.createFramebuffer()!];
    const scene = makeTexture();
    const sceneCanvas = document.createElement("canvas");
    const sceneContext = sceneCanvas.getContext("2d")!;
    let simWidth = 1;
    let simHeight = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      simWidth = Math.floor(canvas.width / 2);
      simHeight = Math.floor(canvas.height / 2);

      states.forEach((texture, index) => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simWidth, simHeight, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[index]!);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      });

      sceneCanvas.width = canvas.width;
      sceneCanvas.height = canvas.height;
      sceneContext.fillStyle = background;
      sceneContext.fillRect(0, 0, canvas.width, canvas.height);
      sceneContext.fillStyle = color;
      sceneContext.font = font;
      sceneContext.textAlign = "center";
      sceneContext.textBaseline = "middle";
      const scale = Math.min(dpr, (canvas.width * 0.86) / Math.max(1, sceneContext.measureText(text).width));
      sceneContext.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);
      sceneContext.fillText(text, 0, 0);
      sceneContext.setTransform(1, 0, 0, 1, 0, 0);
      gl.bindTexture(gl.TEXTURE_2D, scene);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
    };

    const pointer = { x: -1, y: -1, px: -1, py: -1 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);
    resize();
    document.fonts.ready.then(resize);
    window.addEventListener("pointermove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const [read, write] = states as [WebGLTexture, WebGLTexture];

      gl.useProgram(simulation);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1]!);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, write, 0);
      gl.viewport(0, 0, simWidth, simHeight);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read);
      gl.uniform1i(gl.getUniformLocation(simulation, "uState"), 0);
      gl.uniform2f(gl.getUniformLocation(simulation, "uResolution"), simWidth, simHeight);
      gl.uniform2f(gl.getUniformLocation(simulation, "uPointer"), pointer.x, pointer.y);
      const moved = pointer.px >= 0 && !reduce;
      gl.uniform2f(
        gl.getUniformLocation(simulation, "uVelocity"),
        moved ? pointer.x - pointer.px : 0,
        moved ? pointer.y - pointer.py : 0,
      );
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.useProgram(render);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, write);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, scene);
      gl.uniform1i(gl.getUniformLocation(render, "uState"), 0);
      gl.uniform1i(gl.getUniformLocation(render, "uScene"), 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      states = [write, read];
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      sizing.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteProgram(simulation);
      gl.deleteProgram(render);
      states.forEach((texture) => gl.deleteTexture(texture));
      framebuffers.forEach((buffer) => gl.deleteFramebuffer(buffer));
    };
  }, [text, background, color, font]);

  return <canvas ref={canvasRef} role="img" aria-label={text} className={`block h-full w-full ${className}`} />;
}
