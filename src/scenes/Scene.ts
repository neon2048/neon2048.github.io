import * as THREE from 'three';

export default class Scene {

    duration: number;

    handleClicks: boolean = false;
    handleMouseMove: boolean = false;
    handleTimeUpdate: boolean = false;

    constructor() {
        this.duration = 500;
    }

    onClick(raycaster: THREE.Raycaster) {

    }

    onMouseMoved(raycaster: THREE.Raycaster) {

    }

    onTimeUpdate(delta: number) {

    }

    onWindowResize() {

    }

    load() {

    }


}
