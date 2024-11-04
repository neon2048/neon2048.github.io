import * as THREE from 'three';
import vertexShader from './shaders/neono/vertex.glsl?raw';
import fragmentShader from './shaders/neono/fragment.glsl?raw';

export default class NeonO extends THREE.Object3D {

    geometry: THREE.PlaneGeometry
    material: THREE.ShaderMaterial
    mesh: THREE.Mesh
    animationRunning: boolean

    constructor() {
        super();

        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                utime: { value: 0.0 },
            },
            transparent: true,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.add(this.mesh);
        this.animationRunning = false;
    }

    updateTime(timeDelta: number) {
        if (this.animationRunning) {
            this.material.uniforms.utime.value += (timeDelta / 1000);
        }
    }

    startAnimation() {
        this.material.uniforms.utime.value = 0;
        this.animationRunning = true;
    }

    stopAnimation() {
        this.animationRunning = false;
    }

}

