import * as THREE from 'three';
import vertexShader from './shaders/pixelimage/vertex.glsl?raw';
import fragmentShader from './shaders/pixelimage/fragment.glsl?raw';


export default class PixelImage extends THREE.Object3D {

    static MAX_EXPLOSION = 10;
    texture: THREE.Texture
    geometry: THREE.PlaneGeometry
    material: THREE.ShaderMaterial
    mesh: THREE.InstancedMesh
    animationRunning: boolean = false
    fadeOut: number = 0
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0
    hitbox: THREE.Mesh

    constructor(texture: THREE.Texture, explosionDuration: number, explosionSize: number, explosionMultiplier: number) {
        super();

        this.texture = texture;

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                utime: { value: 0.0 },
                utexture: { value: texture },
                uxelements: { value: 0 },
                uyelements: { value: 0 },
                upixwidth: { value: 0 },
                upixheight: { value: 0 },
                ualpha: { value: 0. },
                uExplosionSize: { value: explosionSize },
                uExplosionMultiplier: { value: explosionMultiplier },

                ucenter: { value: new Array(3).fill(0) },
                uExplosionCenters: { value: new Array(PixelImage.MAX_EXPLOSION * 3).fill(0) },
                uExplosionStartTimes: { value: new Array(PixelImage.MAX_EXPLOSION).fill(0) },
                uAnimationDuration: { value: explosionDuration },
            },
            side: THREE.DoubleSide,
            transparent: true,
        });

        this.hitbox = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height));
        this.setWidth(1);


        const instanceids = new Float32Array(this.x * this.y);

        for (let i = 0; i < instanceids.length; i++) {
            instanceids[i] = i;
        }

        this.geometry.setAttribute(
            'instance_id',
            new THREE.InstancedBufferAttribute(instanceids, 1)
        );

        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, instanceids.length);
        this.animationRunning = false;

        this.add(this.mesh);

    }

    setPosition(x: number, y: number, z: number) {
        this.position.set(x, y, z);
        this.material.uniforms.ucenter.value[0] = x;
        this.material.uniforms.ucenter.value[1] = x;
        this.material.uniforms.ucenter.value[2] = x;
    }

    setWidth(width: number) {
        const texwidth = this.texture.source.data.width;
        const texheight = this.texture.source.data.height;

        const aspect = (texheight / texwidth);
        this.width = width;
        this.height = width * aspect;

        this.calcScaling();
    }

    calcScaling() {
        const texwidth = this.texture.source.data.width;
        const texheight = this.texture.source.data.height;

        const aspect = (texheight / texwidth);
        const x = 256;
        const y = Math.round(x * aspect);
        this.x = x;
        this.y = y;

        this.material.uniforms.uxelements.value = this.x;
        this.material.uniforms.uyelements.value = this.y;
        this.material.uniforms.upixheight.value = this.height / this.y;
        this.material.uniforms.upixwidth.value = this.width / this.x;

        if (this.hitbox) {
            this.remove(this.hitbox)
        }
        this.hitbox = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height));
        this.hitbox.visible = false;
        this.add(this.hitbox)
    }

    setHeight(height: number) {
        const texwidth = this.texture.source.data.width;
        const texheight = this.texture.source.data.height;

        const aspect = (texwidth / texheight);
        this.height = height;
        this.width = height * aspect;

        this.calcScaling();
    }

    updateTime(timeDelta: number) {
        if (this.animationRunning) {
            const u = this.material.uniforms;
            u.utime.value += (timeDelta / 1000);
            if (this.fadeOut) {
                u.ualpha.value = Math.max(1 - (u.utime.value - this.fadeOut) * 3., 0);
            } else {
                u.ualpha.value = Math.min(Math.pow(u.utime.value, 3.0), 1.);
            }

        }
    }

    startFadeOut() {
        this.fadeOut = this.material.uniforms.utime.value;
    }

    startAnimation() {
        for (let idx = 0; idx < PixelImage.MAX_EXPLOSION; idx++) {
            this.material.uniforms.uExplosionStartTimes.value[idx] = 0;
            const arr = this.material.uniforms.uExplosionCenters.value;
            arr[idx * 3] = 0;
            arr[idx * 3 + 1] = 0;
            arr[idx * 3 + 2] = 0;
        }
        this.material.uniforms.utime.value = 0.0;
        this.material.uniforms.ualpha.value = 0.0;
        this.animationRunning = true;
        this.fadeOut = 0;
    }

    countFreeSpace() {
        let cnt = 0;
        for (let i = 0; i < PixelImage.MAX_EXPLOSION; i++) {
            const start = this.material.uniforms.uExplosionStartTimes.value[i];
            const cur = this.material.uniforms.utime.value;

            if (start == 0 || cur >= start + this.material.uniforms.uAnimationDuration.value) {
                cnt++;
            }
        }
        return cnt;
    }

    addClick(location: THREE.Vector3) {

        let idx = 0;
        for (; idx < PixelImage.MAX_EXPLOSION; idx++) {
            const start = this.material.uniforms.uExplosionStartTimes.value[idx];
            const cur = this.material.uniforms.utime.value;

            if (start == 0 || cur >= start + this.material.uniforms.uAnimationDuration.value) {
                break;
            }
        }
        if (idx == PixelImage.MAX_EXPLOSION) {
            return;
        }
        const arr = this.material.uniforms.uExplosionCenters.value;
        arr[idx * 3] = location.x;
        arr[idx * 3 + 1] = location.y;
        arr[idx * 3 + 2] = location.z;
        this.material.uniforms.uExplosionStartTimes.value[idx] =
            this.material.uniforms.utime.value;

    }

    stopAnimation() {
        this.animationRunning = false;
    }

}

