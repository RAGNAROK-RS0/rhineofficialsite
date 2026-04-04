// src/lib/Root.ts
// @ts-nocheck
import { ACESFilmicToneMapping, Clock, PerspectiveCamera, Scene, Vector2, Vector3, SRGBColorSpace } from "three/webgpu"; // SRGBColorSpace added
import { IAnimatedElement } from "./interfaces/IAnimatedElement";
import { pass, PostProcessing, WebGPURenderer } from "three/webgpu";
import { OrbitControls, TrackballControls } from "three/examples/jsm/Addons.js";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { LinkedParticles } from "./elements/LinkedParticles";

export class Root {
    static instance: Root;
    animatedElements: IAnimatedElement[] = [];

    static zoomPercent: number = 0;

    static registerAnimatedElement(element: IAnimatedElement) {
        if (Root.instance == null) throw new Error("Root instance not found");
        if (Root.instance.animatedElements.indexOf(element) == -1) Root.instance.animatedElements.push(element);
    }

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        if (Root.instance != null) return;
        Root.instance = this;
    }

    async init() {
        this.initRenderer();
        this.initCamera();
        this.initPost();
        await this.initScene();
        this.clock.start();
        this.renderer!.setAnimationLoop(this.animate.bind(this));
        return new Promise((resolve) => resolve());
    }

    renderer?: WebGPURenderer;
    clock: Clock = new Clock(false);
    post?: PostProcessing;

    // Performance/adaptive rendering fields
    resolutionScale: number = 0.75; // Initialized to 0.75 for better starting performance
    targetFps: number = 60;
    lastRenderTime: number | null = null;
    frameTimes: number[] = [];
    maxFrameSamples: number = 60;

    // handlers stored so they can be removed on dispose
    resizeHandler: (() => void) | null = null;
    visibilityHandler: (() => void) | null = null;

    initRenderer() {
        if (typeof WebGPU === 'undefined' || WebGPU.isAvailable() === false) throw new Error('No WebGPU support');
        this.renderer = new WebGPURenderer({ canvas: this.canvas, antialias: false, alpha: true }); // antialias: false, alpha: true for potential performance and transparency
        this.renderer.outputColorSpace = SRGBColorSpace; // Ensure correct color space for display
        this.renderer.setPixelRatio(1);
        this.setRendererSize(window.innerWidth, window.innerHeight, this.resolutionScale);

        this.resizeHandler = this.onResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);

        this.visibilityHandler = () => {
            if (document.hidden) {
                try {
                    if (this.renderer && typeof (this.renderer as any).setAnimationLoop === 'function') {
                        (this.renderer as any).setAnimationLoop(null);
                    }
                } catch (e) {
                    // ignore
                }
            } else {
                this.lastRenderTime = null;
                try {
                    this.renderer!.setAnimationLoop(this.animate.bind(this));
                } catch (e) {
                    // ignore
                }
            }
        };
        document.addEventListener('visibilitychange', this.visibilityHandler);
    }

    camera: PerspectiveCamera = new PerspectiveCamera(70, 1, .01, 1000);
    controls?: OrbitControls;

    initCamera() {
        const aspect: number = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.position.z = 5;
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, this.canvas);
        
        this.controls.enableZoom = false; 
        this.controls.minDistance = 3;  
        this.controls.maxDistance = 30; 
        this.controls.target.set(0, 0, 0);
    }

    postProcessing?: PostProcessing;
    initPost() {
        const scenePass = pass(this.scene, this.camera);
        this.postProcessing = new PostProcessing(this.renderer!);
        this.postProcessing.outputNode = scenePass;
    }

    scene: Scene = new Scene();
    fx: LinkedParticles;
    async initScene() {
        this.fx = new LinkedParticles(this.scene, this.camera, this.controls, this.renderer!, this.postProcessing);
        await this.fx.init();       
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.setRendererSize(window.innerWidth, window.innerHeight, this.resolutionScale);
    }

    setRendererSize(width: number, height: number, scale: number) {
        if (!this.renderer) return;
        const w = Math.max(1, Math.floor(width * scale));
        const h = Math.max(1, Math.floor(height * scale));
        try {
            this.renderer.setSize(w, h);
        } catch (e) {
            this.renderer.setSize(width, height);
        }
    }

    adjustAdaptiveSettings() {
        if (this.frameTimes.length === 0) return;
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        const avgMs = sum / this.frameTimes.length;

        if (avgMs > 45) {
            this.targetFps = 24;
        } else if (avgMs > 28) {
            this.targetFps = 30;
        } else {
            this.targetFps = 60;
        }

        let desiredScale = 1;
        if (avgMs > 40) desiredScale = 0.5;
        else if (avgMs > 28) desiredScale = 0.75;
        else desiredScale = 1;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        this.resolutionScale = lerp(this.resolutionScale, desiredScale, 0.25);
        this.resolutionScale = Math.min(1, Math.max(0.5, this.resolutionScale));

        if (this.renderer) {
            const targetWidth = Math.floor(window.innerWidth * this.resolutionScale);
            const targetHeight = Math.floor(window.innerHeight * this.resolutionScale);
            const currentSize = (this.renderer as any).getSize(new Vector2());
            if (Math.abs(currentSize.x - targetWidth) > 16 || Math.abs(currentSize.y - targetHeight) > 16) {
                this.setRendererSize(window.innerWidth, window.innerHeight, this.resolutionScale);
            }
        }

        // If the scene is heavy, progressively reduce visual quality settings on the fx module
        try {
            if (this.fx) {
                if (this.resolutionScale < 0.75) {
                    // disable expensive post effects
                    if (typeof this.fx.uUseRGBShift !== 'undefined') this.fx.uUseRGBShift.value = 0;
                    if (typeof this.fx.uUseBlur !== 'undefined') this.fx.uUseBlur.value = 0;
                    if (typeof this.fx.uUseAnamorphic !== 'undefined') this.fx.uUseAnamorphic.value = 0;
                    // reduce spawn rate and particle size
                    if (typeof this.fx.uSpawnCursorNb !== 'undefined') this.fx.uSpawnCursorNb.value = Math.max(1, Math.floor(this.fx.uSpawnCursorNb.value * this.resolutionScale));
                    if (typeof this.fx.uParticleSize !== 'undefined') this.fx.uParticleSize.value = Math.max(0.2, this.fx.uParticleSize.value * this.resolutionScale);
                } else {
                    // try to restore defaults conservatively
                    if (typeof this.fx.uUseRGBShift !== 'undefined') this.fx.uUseRGBShift.value = 1;
                    if (typeof this.fx.uUseBlur !== 'undefined') this.fx.uUseBlur.value = 1;
                    if (typeof this.fx.uUseAnamorphic !== 'undefined') this.fx.uUseAnamorphic.value = 0;
                }
            }
        } catch (e) {
            // non-critical
        }
    }

    animate() {
        if (!this.capturing) {
            const now = performance.now();
            if (!this.lastRenderTime) this.lastRenderTime = now;

            const elapsedSinceLastRender = now - this.lastRenderTime;
            const targetMs = 1000 / this.targetFps;

            if (elapsedSinceLastRender < targetMs * 0.9) {
                return;
            }

            const dt: number = this.clock.getDelta();
            const elapsed: number = this.clock.getElapsedTime();

            try {
                this.controls!.update(dt);
                this.animatedElements.forEach((element) => element.update(dt, elapsed));
                this.postProcessing!.render();
            } catch (err) {
                console.warn('Render frame failed, skipping:', err);
                this.lastRenderTime = now;
                return;
            }

            const frameMs = performance.now() - now;
            this.frameTimes.push(frameMs);
            if (this.frameTimes.length > this.maxFrameSamples) this.frameTimes.shift();

            if (this.frameTimes.length === this.maxFrameSamples) {
                this.adjustAdaptiveSettings();
            }

            if (this.controls) {
                const zoomRange = this.controls.maxDistance - this.controls.minDistance;
                const currentZoom = this.camera.position.z - this.controls.minDistance;
                Root.zoomPercent = Math.max(0, Math.min(100, Math.round((1 - (currentZoom / zoomRange)) * 100)));
            }

            this.lastRenderTime = now;
        }
    }

    static StartCapture(): void {
        if (Root.instance && !Root.instance.capturing) Root.instance.capture();
    }

    capturing: boolean = false;
    async capture() {
        this.capturing = true;
        await new Promise(resolve => setTimeout(resolve, 20));
        await this.postProcessing!.renderAsync();
        const imgData = this.renderer.domElement.toDataURL("image/jpeg", 1.0);
        const link = document.createElement('a');
        link.download = `rhine_render_${Date.now()}.jpg`;
        link.href = imgData;
        link.click();
        this.capturing = false;
    }

    // Dispose renderer, listeners and large GPU resources
    dispose() {
        try {
            if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
            if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
            if (this.renderer && typeof (this.renderer as any).setAnimationLoop === 'function') {
                (this.renderer as any).setAnimationLoop(null);
            }
            // best-effort renderer cleanup
            try {
                if (this.renderer && typeof (this.renderer as any).dispose === 'function') (this.renderer as any).dispose();
            } catch (e) {
                // ignore
            }
            // clear scene
            try {
                this.scene.traverse((obj: any) => {
                    if (obj.geometry) try { obj.geometry.dispose(); } catch (e) {}
                    if (obj.material) {
                        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { try { m.dispose(); } catch (e) {} });
                        else try { obj.material.dispose(); } catch (e) {}
                    }
                });
            } catch (e) {
                // ignore
            }
        } finally {
            // drop singleton
            try { (Root as any).instance = undefined; } catch (e) {}
        }
    }
}
