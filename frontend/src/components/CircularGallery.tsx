"use client";

/**
 * CircularGallery - A WebGL-powered interactive circular gallery.
 * 
 * Enhanced with Architectural Photo Frame Templates for CMS integration:
 * - Generates in-memory canvas frame templates (zero CORS, zero 404 crashes).
 * - Safe shader aspect calculations preventing division-by-zero (NaN) bugs.
 * - Non-power-of-two (NPOT) texture safety with linear filtering.
 * - Ready to seamlessly receive and display CMS uploaded images.
 * - Mobile-first responsiveness (curvature, scaling, and touch momentum).
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";

type GL = Renderer["gl"];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 26;
}

/**
 * Creates an in-memory high-res Photo Frame Template texture for WebGL.
 * This ensures 0% CORS errors, 0% 404 missing image crashes, and 100% theme consistency.
 */
function createFrameTemplateCanvas(
  itemTitle: string,
  category: string = "KOPI",
  slotNum: number = 1
): HTMLCanvasElement {
  const width = 800;
  const height = 500;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Roasted Mocha Surface (#74512D)
  ctx.fillStyle = "#74512D";
  ctx.fillRect(0, 0, width, height);

  // 2. Architectural Blueprint Grid
  ctx.strokeStyle = "rgba(248, 244, 225, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 28;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Inner Frame Border (#543310)
  ctx.strokeStyle = "#543310";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 4. Latte Taupe Corner Crosshairs (+)
  ctx.fillStyle = "#AF8F6F";
  ctx.font = 'bold 22px "Plus Jakarta Sans", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("+", 34, 34);
  ctx.fillText("+", width - 34, 34);
  ctx.fillText("+", 34, height - 34);
  ctx.fillText("+", width - 34, height - 34);

  // 5. Header Frame Info
  ctx.fillStyle = "#AF8F6F";
  ctx.font = 'bold 15px "Plus Jakarta Sans", monospace';
  ctx.textAlign = "left";
  ctx.fillText(category.toUpperCase(), 60, 50);

  ctx.fillStyle = "rgba(248, 244, 225, 0.7)";
  ctx.textAlign = "right";
  ctx.fillText(`SLOT 0${slotNum} • 16:10`, width - 60, 50);

  // 6. Center: Stylized Coffee Icon Frame
  const centerX = width / 2;
  const centerY = height / 2 - 20;

  ctx.strokeStyle = "rgba(175, 143, 111, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - 36, centerY - 36, 72, 72);

  // Corner highlights on icon frame
  ctx.fillStyle = "#AF8F6F";
  ctx.fillRect(centerX - 40, centerY - 40, 8, 8);
  ctx.fillRect(centerX + 32, centerY + 32, 8, 8);

  // Coffee cup graphic
  ctx.strokeStyle = "#AF8F6F";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX - 4, centerY + 2, 16, 0, Math.PI, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - 24, centerY + 2);
  ctx.lineTo(centerX + 16, centerY + 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX + 16, centerY + 4, 8, -Math.PI / 2, Math.PI / 2, false);
  ctx.stroke();

  // 7. Title & CMS Spec
  ctx.fillStyle = "#F8F4E1";
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(itemTitle.toUpperCase(), centerX, centerY + 65);

  ctx.fillStyle = "#AF8F6F";
  ctx.font = 'bold 13px "Plus Jakarta Sans", monospace';
  ctx.fillText("TEMPLATE FRAME • SIAP INTEGRASI CMS", centerX, centerY + 96);

  ctx.fillStyle = "rgba(248, 244, 225, 0.65)";
  ctx.font = '12px "Plus Jakarta Sans", monospace';
  ctx.fillText("Format: JPG / WebP • Rasio 16:10 (Min. 1200×750px)", centerX, centerY + 120);

  // 8. Bottom Registration Bar
  ctx.strokeStyle = "rgba(248, 244, 225, 0.15)";
  ctx.beginPath();
  ctx.moveTo(40, height - 52);
  ctx.lineTo(width - 40, height - 52);
  ctx.stroke();

  ctx.fillStyle = "rgba(248, 244, 225, 0.55)";
  ctx.font = '11px "Plus Jakarta Sans", monospace';
  ctx.textAlign = "left";
  ctx.fillText("KONTRAKAN COFFEE ATELIER", 60, height - 34);

  ctx.fillStyle = "#AF8F6F";
  ctx.textAlign = "right";
  ctx.fillText("CMS READY", width - 60, height - 34);

  return canvas;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 26px "Plus Jakarta Sans", sans-serif',
  color: string = "#543310"
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2d context");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = getFontSize(font);

  // Measure text
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.3);

  // Setup HiDPI Canvas
  canvas.width = Math.ceil((textWidth + 40) * dpr);
  canvas.height = Math.ceil((textHeight + 20) * dpr);

  context.scale(dpr, dpr);
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, (textWidth + 40) / 2, (textHeight + 20) / 2);

  const texture = new Texture(gl, {
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
  });
  texture.image = canvas;
  return { texture, width: textWidth + 40, height: textHeight + 20 };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#543310",
    font = 'bold 26px "Plus Jakarta Sans", sans-serif',
  }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.12;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.06;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  category?: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  category: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    category = "KOPI",
    viewport,
    bend,
    textColor,
    borderRadius = 0.04,
    font,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.category = category;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    // 1. Generate in-memory Photo Frame Template canvas (guarantees zero CORS, zero 404 crash)
    const frameCanvas = createFrameTemplateCanvas(this.text, this.category, this.index + 1);

    const texture = new Texture(this.gl, {
      generateMipmaps: false,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
      width: frameCanvas.width,
      height: frameCanvas.height,
    });
    texture.image = frameCanvas;

    // 2. Shaders with protected aspect ratio calculations (preventing division-by-zero NaN)
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 3.5 + uTime) * 1.2 + cos(p.y * 2.0 + uTime) * 1.2) * (0.08 + uSpeed * 0.4);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          // Safeguard against 0 or negative sizes to prevent NaN
          float pAspect = uPlaneSizes.y > 0.001 ? (uPlaneSizes.x / uPlaneSizes.y) : 1.0;
          float iAspect = uImageSizes.y > 0.001 ? (uImageSizes.x / uImageSizes.y) : 1.0;
          
          vec2 ratio = vec2(
            min(pAspect / iAspect, 1.0),
            min(iAspect / pAspect, 1.0)
          );
          
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for corners
          float edgeSmooth = 0.003;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [800, 500] },
        uImageSizes: { value: [frameCanvas.width, frameCanvas.height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    // 3. Asynchronously load photo if provided (ready for CMS images)
    if (
      this.image &&
      this.image.trim() !== "" &&
      !this.image.includes("placeholder-coffee.svg")
    ) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = this.image;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          texture.image = img;
          this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        }
      };
      img.onerror = () => {
        // Fallback: retains the architectural frame template canvas without throwing errors
      };
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(0, R * R - effectiveX * effectiveX));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.03;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    const isMobile = this.screen.width < 768;
    const isTablet = this.screen.width >= 768 && this.screen.width < 1024;

    if (isMobile) {
      // Mobile-first optimization: cards take 72% of width with comfortable vertical height
      this.plane.scale.x = this.viewport.width * 0.72;
      this.plane.scale.y = Math.min(this.viewport.height * 0.68, this.plane.scale.x * 1.15);
      this.padding = 0.85;
      this.bend = 1.35; // Gentle curvature for phone displays
    } else if (isTablet) {
      this.plane.scale.x = this.viewport.width * 0.44;
      this.plane.scale.y = this.plane.scale.x * 1.18;
      this.padding = 1.3;
      this.bend = 2.2;
    } else {
      this.scale = this.screen.height / 1400;
      this.plane.scale.y = (this.viewport.height * (820 * this.scale)) / this.screen.height;
      this.plane.scale.x = (this.viewport.width * (640 * this.scale)) / this.screen.width;
      this.padding = 1.8;
      this.bend = 2.8;
    }

    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

export interface CircularGalleryItem {
  image?: string;
  text: string;
  category?: string;
  [key: string]: any;
}

interface AppConfig {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
}

class AppCore {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  rawItems: CircularGalleryItem[] = [];
  mediasImages: CircularGalleryItem[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (e: MouseEvent | TouchEvent) => void;
  isDown: boolean = false;
  start: number = 0;
  startY: number = 0;
  dragDistance: number = 0;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  lastActiveIndex: number = -1;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 2.5,
      textColor = "#543310",
      borderRadius = 0.04,
      font = 'bold 26px "Plus Jakarta Sans", sans-serif',
      scrollSpeed = 2.2,
      scrollEase = 0.06,
      onActiveIndexChange,
      onItemClick,
    }: AppConfig
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onActiveIndexChange = onActiveIndexChange;
    this.onItemClick = onItemClick;
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 150);

    try {
      this.createRenderer();
      this.createCamera();
      this.createScene();
      this.onResize();
      this.createGeometry();
      this.createMedias(items, bend, textColor, borderRadius, font);
      this.update();
      this.addEventListeners();
    } catch (err) {
      console.warn("CircularGallery WebGL initialization fallback:", err);
    }
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 40,
      widthSegments: 70,
    });
  }

  createMedias(
    items: CircularGalleryItem[] | undefined,
    bend: number = 2.5,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems: CircularGalleryItem[] = [
      { text: "Es Kopi Susu", category: "kopi" },
      { text: "Caramel Macchiato", category: "kopi" },
      { text: "Cold Brew Gayo", category: "kopi" },
      { text: "Matcha Latte", category: "non-kopi" },
      { text: "Dark Chocolate", category: "non-kopi" },
      { text: "Kentang Truffle", category: "camilan" },
    ];

    this.rawItems = items && items.length ? items : defaultItems;
    // Duplicate items to form a seamless infinite loop
    this.mediasImages = this.rawItems.concat(this.rawItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image || "",
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        category: data.category || "KOPI",
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.dragDistance = 0;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.startY = "touches" in e ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;

    const diffX = this.start - x;
    const diffY = this.startY - y;
    this.dragDistance += Math.abs(diffX) + Math.abs(diffY);

    const distance = diffX * (this.scrollSpeed * 0.022);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp() {
    if (!this.isDown) return;
    this.isDown = false;

    // Detect click / tap if movement was minimal
    if (this.dragDistance < 12 && this.onItemClick && this.medias.length) {
      const activeIdx = this.calculateCurrentActiveIndex();
      if (this.rawItems[activeIdx]) {
        this.onItemClick(this.rawItems[activeIdx], activeIdx);
      }
    }

    this.onCheck();
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.18;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  calculateCurrentActiveIndex(): number {
    if (!this.medias || !this.medias[0] || !this.rawItems.length) return 0;
    const width = this.medias[0].width;
    const normalizedTarget = Math.round(this.scroll.target / width);
    const rawLen = this.rawItems.length;
    let idx = normalizedTarget % rawLen;
    if (idx < 0) idx += rawLen;
    return idx;
  }

  next() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    this.scroll.target += width;
    this.onCheckDebounce();
  }

  prev() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    this.scroll.target -= width;
    this.onCheckDebounce();
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    this.screen = {
      width: this.container.clientWidth || window.innerWidth,
      height: this.container.clientHeight || 500,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }

    // Active item tracking callback
    if (this.onActiveIndexChange && this.rawItems.length) {
      const activeIdx = this.calculateCurrentActiveIndex();
      if (activeIdx !== this.lastActiveIndex) {
        this.lastActiveIndex = activeIdx;
        this.onActiveIndexChange(activeIdx);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render({ scene: this.scene, camera: this.camera });
    }
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel, { passive: true });
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    this.container.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    if (this.container) {
      this.container.removeEventListener("wheel", this.boundOnWheel);
      this.container.removeEventListener("mousedown", this.boundOnTouchDown);
      this.container.removeEventListener("touchstart", this.boundOnTouchDown);
      this.container.removeEventListener("touchmove", this.boundOnTouchMove);
    }
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchend", this.boundOnTouchUp);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas as HTMLCanvasElement
      );
    }
  }
}

export interface CircularGalleryRef {
  next: () => void;
  prev: () => void;
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  className?: string;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
}

export const CircularGallery = forwardRef<CircularGalleryRef, CircularGalleryProps>(
  function CircularGallery(
    {
      items,
      bend = 2.4,
      textColor = "#543310",
      borderRadius = 0.04,
      font = 'bold 26px "Plus Jakarta Sans", sans-serif',
      scrollSpeed = 2.2,
      scrollEase = 0.06,
      className = "",
      onActiveIndexChange,
      onItemClick,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<AppCore | null>(null);

    useImperativeHandle(ref, () => ({
      next: () => appRef.current?.next(),
      prev: () => appRef.current?.prev(),
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const app = new AppCore(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font,
        scrollSpeed,
        scrollEase,
        onActiveIndexChange,
        onItemClick,
      });

      appRef.current = app;

      return () => {
        app.destroy();
        appRef.current = null;
      };
    }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onActiveIndexChange, onItemClick]);

    return (
      <div
        className={`w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y ${className}`}
        ref={containerRef}
      />
    );
  }
);

export default CircularGallery;
