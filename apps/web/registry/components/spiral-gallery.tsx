"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

export interface SpiralGalleryItem {
  src: string;
  title: string;
}

export interface SpiralGalleryProps {
  items: SpiralGalleryItem[];
  count?: number;
  perTurn?: number;
  radius?: number;
  gap?: number;
  speed?: number;
  bend?: number;
  wheel?: boolean;
  onHover?: (item: SpiralGalleryItem | null) => void;
  onSelect?: (item: SpiralGalleryItem) => void;
  className?: string;
}

const CARD_WIDTH = 1.6;
const CARD_HEIGHT = 0.9;
const SEGMENTS_X = 32;
const SEGMENTS_Y = 16;
const FOV = (50 * Math.PI) / 180;

const VERTEX = `#version 300 es
in vec3 position;
in vec2 uv;
uniform float uBend;
uniform float uRotation;
uniform vec3 uOffset;
uniform float uCameraZ;
uniform float uAspect;
uniform float uFocal;
out vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  p.z += uBend * p.y * p.y;
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec3 world = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z) + uOffset;
  vec3 view = world - vec3(0.0, 0.0, uCameraZ);
  float near = 0.1;
  float far = 100.0;
  gl_Position = vec4(
    view.x * uFocal / uAspect,
    view.y * uFocal,
    (view.z * (far + near) + 2.0 * far * near) / (near - far),
    -view.z
  );
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uUvScale;
uniform vec2 uPlaneSize;
uniform float uRadius;
uniform float uHover;
in vec2 vUv;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 centered = vUv - 0.5;
  if (gl_FrontFacing) centered *= 1.0 - uHover * 0.1;
  vec2 uv = centered * uUvScale + 0.5;

  float d = roundedBox((vUv - 0.5) * uPlaneSize, uPlaneSize * 0.5, uRadius);
  float alpha = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);
  if (alpha < 0.01) discard;

  vec3 color;
  if (gl_FrontFacing) {
    color = texture(uTexture, uv).rgb * (1.0 - uHover * 0.35);
  } else {
    color = texture(uTexture, uv, 2.5).rgb * 0.55;
  }
  outColor = vec4(color * alpha, alpha);
}`;

function buildPlane(radius: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let y = 0; y <= SEGMENTS_Y; y++) {
    for (let x = 0; x <= SEGMENTS_X; x++) {
      const u = x / SEGMENTS_X;
      const v = y / SEGMENTS_Y;
      const arc = (u - 0.5) * CARD_WIDTH;
      const theta = arc / radius;
      positions.push(radius * Math.sin(theta), (v - 0.5) * CARD_HEIGHT, radius * (Math.cos(theta) - 1));
      uvs.push(u, 1 - v);
    }
  }
  const row = SEGMENTS_X + 1;
  for (let y = 0; y < SEGMENTS_Y; y++) {
    for (let x = 0; x < SEGMENTS_X; x++) {
      const a = y * row + x;
      indices.push(a, a + 1, a + row, a + 1, a + row + 1, a + row);
    }
  }
  return { positions: new Float32Array(positions), uvs: new Float32Array(uvs), indices: new Uint16Array(indices) };
}

export function SpiralGallery({
  items,
  count = 24,
  perTurn = 8,
  radius = 2.1,
  gap = 0.5,
  speed = 0.15,
  bend = 0.4,
  wheel = false,
  onHover,
  onSelect,
  className = "",
}: SpiralGalleryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onHover, onSelect });

  useEffect(() => {
    callbacks.current = { onHover, onSelect };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { antialias: true, premultipliedAlpha: true });
    if (!canvas || !gl || items.length === 0) return;

    const program = gl.createProgram()!;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, FRAGMENT],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, "position");
    gl.bindAttribLocation(program, 1, "uv");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const plane = buildPlane(radius);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, plane.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, plane.uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, plane.indices, gl.STATIC_DRAW);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const locations = {
      bend: uniform("uBend"),
      rotation: uniform("uRotation"),
      offset: uniform("uOffset"),
      cameraZ: uniform("uCameraZ"),
      aspect: uniform("uAspect"),
      focal: uniform("uFocal"),
      uvScale: uniform("uUvScale"),
      planeSize: uniform("uPlaneSize"),
      radius: uniform("uRadius"),
      hover: uniform("uHover"),
    };

    const planeAspect = CARD_WIDTH / CARD_HEIGHT;
    const textures = items.map((item) => {
      const texture = gl.createTexture()!;
      const record = { texture, scale: [1, 1] as [number, number] };
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([24, 24, 27, 255]));
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const imageAspect = image.width / image.height;
        record.scale = imageAspect > planeAspect ? [planeAspect / imageAspect, 1] : [1, imageAspect / planeAspect];
      };
      image.src = item.src;
      return record;
    });

    const cards = Array.from({ length: count }, (_, index) => ({ index, hover: 0, x: 0, y: 0, z: 0, angle: 0 }));
    const wrap = gsap.utils.wrap(0, count);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focal = 1 / Math.tan(FOV / 2);
    const pointer = { x: 0, y: 0, inside: false };
    let offset = 0;
    let smoothed = 0;
    let velocityBend = 0;
    let direction = -1;
    let cameraZ = 5.5;
    let aspect = 1;
    let hovered = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      aspect = canvas.width / canvas.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);
    resize();

    const observer = Observer.create({
      target: canvas,
      type: wheel ? "wheel,touch,pointer" : "touch,pointer",
      preventDefault: wheel,
      dragMinimum: 3,
      onChangeY: (self) => {
        offset -= self.deltaY * 0.002;
        if (self.deltaY !== 0) direction = Math.sign(-self.deltaY);
      },
      onClick: () => {
        const card = cards[hovered];
        if (card) callbacks.current.onSelect?.(items[card.index % items.length]!);
      },
    });

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(locations.planeSize, CARD_WIDTH, CARD_HEIGHT);
    gl.uniform1f(locations.radius, 0.07);
    gl.uniform1f(locations.focal, focal);

    const render = (_time: number, deltaMs: number) => {
      const delta = Math.min(deltaMs / 1000, 1 / 30);
      if (!reduce) offset += speed * direction * delta;
      smoothed += (offset - smoothed) * (1 - Math.exp(-3.3 * delta));
      velocityBend += (offset - smoothed - velocityBend) * (1 - Math.exp(-3.3 * delta));

      const narrow = canvas.clientWidth <= 1000;
      const targetZ = narrow ? gsap.utils.mapRange(320, 1000, 8.4, 5.5, gsap.utils.clamp(320, 1000, canvas.clientWidth)) : 5.5;
      cameraZ += (targetZ - cameraZ) * 0.15;

      let nextHovered = -1;
      let nearest = -Infinity;
      for (const card of cards) {
        const position = wrap(card.index + smoothed);
        card.angle = (position * Math.PI * 2) / perTurn;
        card.x = Math.cos(card.angle) * radius;
        card.z = Math.sin(card.angle) * radius;
        card.y = position * gap - (count * gap) / 2.5;

        if (pointer.inside && Math.sin(card.angle) > 0.35) {
          const depth = cameraZ - card.z;
          const sx = (card.x * focal) / aspect / depth;
          const sy = (card.y * focal) / depth;
          const halfW = ((CARD_WIDTH / 2) * Math.sin(card.angle) * focal) / aspect / depth;
          const halfH = ((CARD_HEIGHT / 2) * focal) / depth;
          if (Math.abs(pointer.x - sx) < halfW && Math.abs(pointer.y - sy) < halfH && card.z > nearest) {
            nearest = card.z;
            nextHovered = cards.indexOf(card);
          }
        }
      }

      if (nextHovered !== hovered) {
        hovered = nextHovered;
        const card = cards[hovered];
        canvas.style.cursor = card ? "pointer" : "grab";
        callbacks.current.onHover?.(card ? items[card.index % items.length]! : null);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(locations.cameraZ, cameraZ);
      gl.uniform1f(locations.aspect, aspect);
      gl.uniform1f(locations.bend, gsap.utils.clamp(-1.2, 1.2, velocityBend * -bend));

      const ordered = [...cards].sort((a, b) => a.z - b.z);
      for (const card of ordered) {
        card.hover += ((cards[hovered] === card ? 1 : 0) - card.hover) * 0.1;
        const record = textures[card.index % textures.length]!;
        gl.bindTexture(gl.TEXTURE_2D, record.texture);
        gl.uniform2f(locations.uvScale, record.scale[0], record.scale[1]);
        gl.uniform1f(locations.rotation, Math.PI / 2 - card.angle);
        gl.uniform3f(locations.offset, card.x, card.y, card.z);
        gl.uniform1f(locations.hover, card.hover);
        gl.drawElements(gl.TRIANGLES, plane.indices.length, gl.UNSIGNED_SHORT, 0);
      }
    };

    gsap.ticker.add(render);
    return () => {
      gsap.ticker.remove(render);
      observer.kill();
      sizing.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      textures.forEach((record) => gl.deleteTexture(record.texture));
      [positionBuffer, uvBuffer, indexBuffer].forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [items, count, perTurn, radius, gap, speed, bend, wheel]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Spiral image gallery"
      className={`block h-full w-full cursor-grab touch-none select-none ${className}`}
    />
  );
}
