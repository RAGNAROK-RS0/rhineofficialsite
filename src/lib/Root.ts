// @ts-nocheck
import { ACESFilmicToneMapping, Clock, PerspectiveCamera, Scene, Vector2, Vector3, SRGBColorSpace } from "three/webgpu";
import { IAnimatedElement } from "./interfaces/IAnimatedElement";
import { pass, PostProcessing, WebGPURenderer } from "three/webgpu";
import { OrbitControls, TrackballControls } from "three/examples/jsm/Addons.js";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { LinkedParticles } from "./elements/LinkedParticles";

export class Root {
    static instance: Root;
    animatedElements: IAnimatedElement[] = [];
    
    // NEW: Static variable for React to read the zoom level
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
    resolutionScale: number = 0.75; // Start at 75% resolution to improve initial perf
    targetFps: number = 60;
    lastRenderTime: number | null = null;
    frameTimes: number[] = [];
    maxFrameSamples: number = 60;

    initRenderer() {
        if (WebGPU.isAvailable() === false) throw new Error('No WebGPU support');
        this.renderer = new WebGPURenderer({ canvas: this.canvas, antialias: false, alpha: true }); // Antialiasing disabled for performance, alpha true for transparency
        this.renderer.outputColorSpace = SRGBColorSpace; // Ensure correct color space for display
        // Keep pixel ratio conservative to avoid high-DPI cost
        this.renderer.setPixelRatio(1);
        // Use initial resolution scale
        this.setRendererSize(window.innerWidth, window.innerHeight, this.resolutionScale);
        window.addEventListener('resize', this.onResize.bind(this));

        // Visibility change: pause rendering when tab hidden to save CPU/GPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                try {
                    if (this.renderer && typeof (this.renderer as any).setAnimationLoop === 'function') {
                        (this.renderer as any).setAnimationLoop(null);
                    }
                } catch (e) {
                    // ignore
                }
            } else {
                // resume
                this.lastRenderTime = null;
                this.renderer!.setAnimationLoop(this.animate.bind(this));
            }
        });
    }

    camera: PerspectiveCamera = new PerspectiveCamera(70, 1, .01, 1000);
    controls?: OrbitControls;

    initCamera() {
        const aspect: number = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.position.z = 5;
        this.camera.updateProjectionMatrix();

        // Attach controls to canvas so they don't block UI touches
        this.controls = new OrbitControls(this.camera, this.canvas);
        
        this.controls.enableZoom = false; 
        this.controls.minDistance = 3;  
        this.controls.maxDistance = 30; 
        this.controls.target.set(0, 0, 0);

        // No scroll rotation – we remove the event listener
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

    // Helper to set renderer size scaled by resolutionScale
    setRendererSize(width: number, height: number, scale: number) {
        if (!this.renderer) return;
        const w = Math.max(1, Math.floor(width * scale));
        const h = Math.max(1, Math.floor(height * scale));
        try {
            this.renderer.setSize(w, h);
        } catch (e) {
            // fallback to raw size
            this.renderer.setSize(width, height);
        }
    }

    // Adaptive resolution logic: adjust scale / target fps based on recent frame times
    adjustAdaptiveSettings() {
        if (this.frameTimes.length === 0) return;
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        const avgMs = sum / this.frameTimes.length;

        // Adjust target FPS based on average frame time
        if (avgMs > 45) {
            this.targetFps = 24;
        } else if (avgMs > 28) {
            this.targetFps = 30;
        } else {
            this.targetFps = 60;
        }

        // Adaptive resolution scaling (smooth adjustments)
        let desiredScale = 1;
        if (avgMs > 40) desiredScale = 0.5;
        else if (avgMs > 28) desiredScale = 0.75;
        else desiredScale = 1;

        // Smooth transition towards desired scale
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        this.resolutionScale = lerp(this.resolutionScale, desiredScale, 0.25);
        // Enforce bounds
        this.resolutionScale = Math.min(1, Math.max(0.5, this.resolutionScale));

        // Apply renderer size change if significant
        if (this.renderer) {
            const targetWidth = Math.floor(window.innerWidth * this.resolutionScale);
            const targetHeight = Math.floor(window.innerHeight * this.resolutionScale);
            const currentSize = (this.renderer as any).getSize(new Vector2());
            if (Math.abs(currentSize.x - targetWidth) > 16 || Math.abs(currentSize.y - targetHeight) > 16) {
                this.setRendererSize(window.innerWidth, window.innerHeight, this.resolutionScale);
            }
        }
    }

    animate() {
        if (!this.capturing) {
            const now = performance.now();
            if (!this.lastRenderTime) this.lastRenderTime = now;

            const elapsedSinceLastRender = now - this.lastRenderTime;
            const targetMs = 1000 / this.targetFps;

            // Skip frame if we're rendering faster than target fps
            if (elapsedSinceLastRender < targetMs * 0.9) {
                return;
            }

            // Compute dt using clock to keep animations consistent
            const dt: number = this.clock.getDelta();
            const elapsed: number = this.clock.getElapsedTime();

            // Run updates
            try {
                this.controls!.update(dt);
                this.animatedElements.forEach((element) => element.update(dt, elapsed));
                this.postProcessing!.render();
            } catch (err) {
                // If rendering fails, surface error to console and bail this frame
                console.warn('Render frame failed, skipping:', err);
                this.lastRenderTime = now;
                return;
            }

            // track performance
            const frameMs = performance.now() - now;
            this.frameTimes.push(frameMs);
            if (this.frameTimes.length > this.maxFrameSamples) this.frameTimes.shift();

            // Periodically adjust adaptive settings
            if (this.frameTimes.length === this.maxFrameSamples) {
                this.adjustAdaptiveSettings();
            }

            // UPDATE ZOOM PERCENTAGE FOR HUD
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
}