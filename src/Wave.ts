import * as THREE from 'three';
import vertexShader from './shaders/wave/vertex.glsl?raw';
import fragmentShader from './shaders/wave/fragment.glsl?raw';

export default class Wave extends THREE.Object3D {

    geometry: THREE.PlaneGeometry
    material: THREE.ShaderMaterial
    mesh: THREE.Mesh
    animationRunning: boolean

    constructor() {
        super();

        this.geometry = new THREE.PlaneGeometry(2, 2, 60, 60);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                utime: { value: 0.0 },
            },
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide,
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

