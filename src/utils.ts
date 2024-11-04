import * as THREE from 'three';

export function visibleHeightAtZDepth(depth: number, cameraZ: number, camera: THREE.PerspectiveCamera) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = cameraZ;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export function visibleRectAtZDepth(depth: number, cameraZ: number, camera: THREE.PerspectiveCamera) {
    const height = visibleHeightAtZDepth(depth, cameraZ, camera);
    const aspect = camera.aspect;

    return { height: height, width: height * aspect };
};

export function elementAtDepth(element: HTMLElement, z: number, cameraZ: number, camera: THREE.PerspectiveCamera) {

    let bounds = element.getBoundingClientRect();
    bounds.y += window.scrollY;
    bounds.x += window.scrollX;
    if (bounds.height == 0 && bounds.width == 0) {
        throw "element " + element.id + " invisible, cannot compute bounds";;
    }
    let world = visibleRectAtZDepth(z, cameraZ, camera);

    const width = (bounds.width / getDocumentWidth()) * world.width;
    const height = (bounds.height / getDocumentHeightScaled()) * world.height;

    let x = ((bounds.x + bounds.width / 2.) / getDocumentWidth()) * world.width;
    x = x - (world.width / 2.);

    let y = ((bounds.y + bounds.height / 2.) / getDocumentHeightScaled()) * world.height;
    y = (world.height / 2.) - y;


    return {
        x: x,
        y: y,
        z: z,
        width: width,
        height: height,
    }
}

export function visibleRectAtZDepthMax(depth: number, cameraZ: number, maxaspect: number, camera: THREE.PerspectiveCamera) {
    const height = visibleHeightAtZDepth(depth, cameraZ, camera);
    const aspect = Math.min(camera.aspect, maxaspect);

    return { height: height, width: height * aspect };
};

// See: https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
export function getDocumentHeightFull() {
    var body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight);
}

export function getDocumentHeightScaled() {
    return getDocumentHeightFull() // / (window.devicePixelRatio || 1);
}

export function getDocumentWidth() {

    var body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth);

}
