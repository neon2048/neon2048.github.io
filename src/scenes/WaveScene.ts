import Scene from './Scene'
import App from '../app.js'
import Wave from '../Wave'
import * as utils from '../utils';

export default class WaveScene extends Scene {


    wave: Wave;
    time: number = 0;
    constructor() {
        super();
        this.wave = new Wave();
        this.wave.visible = false;
    }

    onTimeUpdate(delta: number) {
        this.wave.updateTime(delta);
        this.time += delta;
        this.wave.rotation.z = this.time * 0.0001;
    }

    load() {
        super.load();
        App.app.scene.add(this.wave);
        this.onWindowResize();

        this.wave.startAnimation();
        this.wave.visible = true;
        this.handleTimeUpdate = true;
    }

    onWindowResize() {
        let el, x;

        el = document.getElementById("wave-spacer");
        if (!el) {
            throw "wave-spacer not found";
        }
        x = utils.elementAtDepth(el, 2, App.app.camera.position.z, App.app.camera);
        this.wave.position.x = x.x;
        this.wave.position.y = x.y;
        ;
        this.wave.position.z = x.z;
        const scale = 1 / 2 * x.width;
        this.wave.scale.x = scale;
        this.wave.scale.y = scale;
        this.wave.scale.z = scale;

        this.wave.lookAt(App.app.camera.position);
        this.wave.rotateX(Math.PI / 2);
    }

}
