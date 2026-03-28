import * as THREE from 'three';
import { PointerLockControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls, platform;
const blocks = [];
let selectedColor = 0x55aa55;

// Initialize Engine
function init(mode) {
    platform = mode;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(10, 20, 10);
    scene.add(ambient, sun);

    if (platform === 'pc') {
        controls = new PointerLockControls(camera, document.body);
        document.body.addEventListener('click', () => controls.lock());
    }

    createFloor();
    animate();
}

function createFloor() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
    for(let x = -8; x < 8; x++) {
        for(let z = -8; z < 8; z++) {
            const b = new THREE.Mesh(geo, mat);
            b.position.set(x, 0, z);
            scene.add(b);
            blocks.push(b);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Global Exports
document.getElementById('btn-pc').onclick = () => {
    document.getElementById('start-menu').classList.add('hidden');
    init('pc');
};

document.getElementById('btn-mobile').onclick = () => {
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('mobile-controls').classList.remove('hidden');
    init('mobile');
};
