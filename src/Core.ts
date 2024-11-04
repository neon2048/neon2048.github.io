import * as THREE from 'three';
import vertexShader from './shaders/core/vertex.glsl?raw';
import fragmentShader from './shaders/core/fragment.glsl?raw';

export default class Core extends THREE.Object3D {

    geometry: THREE.IcosahedronGeometry
    material: THREE.ShaderMaterial
    mesh: THREE.Mesh
    expandRunning: boolean

    constructor(size: number) {
        super();

        this.geometry = new THREE.IcosahedronGeometry(size / 2., 32);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uradius: { value: size },
                utime: { value: 0.0 },
                utime_expand: { value: 0.0 },
            },
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        this.expandRunning = false;
    }

    updateTime(timeDelta: number) {
        this.material.uniforms.utime.value += (timeDelta / 1000);

        if (this.expandRunning) {
            const expand = this.material.uniforms.utime_expand.value + (timeDelta / 1000)
            this.material.uniforms.utime_expand.value = Math.min(expand, 1);
        }

    }

    startExpand() {
        this.material.uniforms.utime_expand.value = 0;
        this.expandRunning = true;
    }

    stopExpand() {
        this.expandRunning = false;
    }

    reset() {
        this.expandRunning = false;
        this.material.uniforms.utime_expand.value = 0;
    }

}
