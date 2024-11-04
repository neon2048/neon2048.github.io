import * as THREE from 'three';
import Scene from './Scene';
import App from '../app.js';
import Core from '../Core';
import * as utils from '../utils';

export default class CoreScene extends Scene {


    core: Core
    scale: number
    constructor() {
        super();
        this.core = new Core(1);
        this.core.visible = false;
        this.scale = 0.7;
    }

    onTimeUpdate(delta: number) {
        this.core.updateTime(delta);
    }

    load() {
        super.load();
        App.app.scene.add(this.core);
        this.onWindowResize();

        this.core.visible = true;
        this.handleTimeUpdate = true;
        this.handleClicks = true;
    }

    onWindowResize() {
        let el, x;

        el = document.getElementById("core-spacer");
        if (!el) {
            throw "core-spacer not found";
        }
        x = utils.elementAtDepth(el, -5, App.app.camera.position.z, App.app.camera);
        this.core.position.x = x.x;
        this.core.position.y = x.y;
        this.core.position.z = x.z;
        this.core.scale.x = x.width * this.scale;
        this.core.scale.y = x.height * this.scale;
    }

    onClick(raycaster: THREE.Raycaster) {
        const intersection = raycaster.intersectObject(this.core);
        if (intersection.length > 0) {
            if (!this.core.expandRunning) {
                this.core.startExpand();
            }
        }
    }

}
