import * as THREE from 'three';
import * as utils from '../utils';
import App from '../app.js'
import Scene from './Scene.js'
import PixelImage from '../PixelImage'

export default class ProfileScene extends Scene {

    card: PixelImage;
    time: number = 0;

    scale: number = 0.85;
    cardPosition: THREE.Vector3

    explosionDuration: number = 10;

    constructor() {
        super();

        this.handleTimeUpdate = true;
        this.handleClicks = true;
        this.cardPosition = new THREE.Vector3();
    }

    load() {
        new THREE.TextureLoader().loadAsync('./hermit.png').then((tx) => {
            this.card = new PixelImage(tx, this.explosionDuration, 0.75, 1);
            App.app.scene.add(this.card);
            this.onWindowResize();
            this.card.startAnimation();
            setTimeout(() => {
                this.randomClickAuto();
            }, 5000)
        });
    }

    onTimeUpdate(delta: number) {
        if (this.card) {
            this.time += delta;
            this.card.position.y = this.cardPosition.y + this.cardPosition.y * Math.sin(this.time * 0.001) * 0.06;
            this.card.rotation.y = Math.sin(this.time * 0.0005) * 0.7;
            this.card.updateTime(delta);
        }
    }

    randomClick() {
        const x = this.card.width * Math.random() - this.card.width / 2;
        const y = this.card.height * Math.random() - this.card.height / 2;
        this.card.addClick(new THREE.Vector3(x, y, 0));
    }

    randomClickAuto() {
        if (!this.card.visible) {
            return;
        }

        const free = this.card.countFreeSpace();
        let timeout = 1000;
        if (free == PixelImage.MAX_EXPLOSION) {
            const rng = 1 + Math.floor(Math.random() * 5);
            for (let i = 0; i < rng; i++) {
                setTimeout(() => {
                    this.randomClick();

                }, 250 * i);
            }
            timeout = this.explosionDuration * 1000 + 250 * rng + 2000;
        }

        setTimeout(() => {
            this.randomClickAuto();
        }, timeout);
    }

    onClick(raycaster: THREE.Raycaster) {
        for (const [i, card] of [this.card].entries()) {
            const intersection = raycaster.intersectObject(card.hitbox);

            if (intersection.length > 0) {
                const inter = intersection[0];

                this.card.addClick(this.card.worldToLocal(inter.point.clone()));

            }
        }
    }

    onMouseMoved(raycaster: THREE.Raycaster) {

    }

    onWindowResize() {
        let el, x;

        el = document.getElementById("profile-spacer");
        if (!el) {
            throw "profile-spacer not found";
        }
        x = utils.elementAtDepth(el, 2, App.app.camera.position.z, App.app.camera);
        this.cardPosition.x = x.x;
        this.cardPosition.y = x.y;
        this.cardPosition.z = x.z;
        this.card.position.x = x.x;
        this.card.position.y = x.y;
        this.card.position.z = x.z;
        this.card.scale.x = x.width * this.scale;
        this.card.scale.y = x.width * this.scale;
        this.card.scale.z = x.width * this.scale;

    }
}


