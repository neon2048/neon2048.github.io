import * as THREE from 'three';
import Scene from './scenes/Scene';

export default class App {

    public static app: App;

    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    lastTime: number = 0;

    scenes: Map<String, Scene>;

    constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
        this.camera = camera;
        this.scene = scene;
        this.scenes = new Map();
    }

    registerScene(name: string, scene: Scene) {
        this.scenes.set(name, scene);
    }

    updateTime(time: number) {

        if (this.lastTime != 0) {
            const delta = time - this.lastTime;
            for (let s of this.scenes.values()) {
                if (s.handleTimeUpdate) {
                    s.onTimeUpdate(delta)
                }
            }
        }

        this.lastTime = time;
    }

    handleMouse(mouse: THREE.Vector2, clicked: boolean, moved: boolean) {
        this.raycaster.setFromCamera(mouse, this.camera);

        for (let s of this.scenes.values()) {
            if (clicked && s.handleClicks) {
                s.onClick(this.raycaster);
            }
            if (moved && s.handleMouseMove) {
                s.onMouseMoved(this.raycaster)
            }
        }

    }

    handleWindowResize() {
        for (let s of this.scenes.values()) {
            s.onWindowResize();
        }
    }

    loadScenes() {
        for (let s of this.scenes.values()) {
            s.load();
        }
    }

}

