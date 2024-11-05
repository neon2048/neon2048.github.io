import * as THREE from 'three';
import App from './src/app'
import ProfileScene from './src/scenes/ProfileScene'
import WaveScene from './src/scenes/WaveScene'
import NeonOScene from './src/scenes/NeonOScene'
import CoreScene from './src/scenes/CoreScene'
import * as utils from './src/utils';

let canvas: HTMLElement;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

const mouse = new THREE.Vector2(1, 1);
let mouseClicked = false;
let mouseMoved = false;

function init() {

    let c = document.getElementById('maincanvas');
    if (!c) {
        throw "maincanvas not found";
    }
    canvas = c;

    // camera
    camera = new THREE.PerspectiveCamera(50, utils.getDocumentWidth() / utils.getDocumentHeightFull(), 0.5, 10);
    camera.position.set(0, 0, 3);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d0c16');

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(utils.getDocumentWidth(), utils.getDocumentHeightFull());

    App.app = new App(camera, scene);
    App.app.registerScene("neono", new NeonOScene());

    switch (window.location.pathname.toLowerCase()) {
        case "/index.html":
        case "/":
            App.app.registerScene("profile", new ProfileScene());
            App.app.registerScene("wave", new WaveScene());
            break;

        case "/next.html":
            App.app.registerScene("core", new CoreScene());
            App.app.registerScene("wave", new WaveScene());
    }

    App.app.loadScenes();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);

    renderer.setAnimationLoop(animate);
}


function onWindowResize() {

    camera.aspect = utils.getDocumentWidth() / utils.getDocumentHeightFull();
    camera.updateProjectionMatrix();

    renderer.setSize(utils.getDocumentWidth(), utils.getDocumentHeightFull());

    App.app.handleWindowResize();
}

function onMouseClick(event: MouseEvent) {

    mouse.x = ((event.clientX + window.scrollX) / utils.getDocumentWidth()) * 2 - 1;
    mouse.y = - ((event.clientY + window.scrollY) / utils.getDocumentHeightScaled()) * 2 + 1;
    mouseClicked = true;
}

function onMouseMove(event: MouseEvent) {
    event.preventDefault();

    mouse.x = (event.clientX / utils.getDocumentWidth()) * 2 - 1;
    mouse.y = - (event.clientY / utils.getDocumentHeightScaled()) * 2 + 1;
    mouseMoved = true;
}


function animate(time: number) {

    App.app.updateTime(time);

    if (mouseClicked || mouseMoved) {
        App.app.handleMouse(mouse, mouseClicked, mouseMoved);
        mouseClicked = false;
        mouseMoved = false;
    }

    renderer.render(scene, camera);
}

document.addEventListener("readystatechange", function() {
    if (this.readyState === "complete") {
        const el = this.getElementById("main");
        if (!el) {
            throw "main element not found";
        }
        el.classList.add("show");
        init();
    }
});
