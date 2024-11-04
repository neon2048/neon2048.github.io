import Scene from './Scene'
import App from '../app.js'
import NeonO from '../NeonO'
import * as utils from '../utils';

export default class NeonOScene extends Scene {


    neono: NeonO
    constructor() {
        super();
        this.neono = new NeonO();
        this.neono.visible = false;
    }

    onTimeUpdate(delta: number) {
        this.neono.updateTime(delta);
    }

    load() {
        super.load();
        App.app.scene.add(this.neono);
        this.onWindowResize();

        this.neono.startAnimation();
        this.neono.visible = true;
        this.handleTimeUpdate = true;
    }

    onWindowResize() {
        let el, x;

        el = document.getElementById("neono-spacer");
        if (!el) {
            throw "neono-spacer not found";
        }
        x = utils.elementAtDepth(el, 2, App.app.camera.position.z, App.app.camera);
        this.neono.position.x = x.x;
        this.neono.position.y = x.y;
        this.neono.position.z = x.z;

        this.neono.scale.x = x.width * 2.;
        this.neono.scale.y = x.height * 2.;
    }

}
