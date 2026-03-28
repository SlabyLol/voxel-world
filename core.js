import * as THREE from 'three';
import { PointerLockControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js';
import { InputHandler } from './controls.js';
import { NetworkManager } from './network.js';

let scene, camera, renderer, controls, platform, input, network;
const blocks = [];
const clock = new THREE.Clock(); // Wichtig für flüssige Bewegung

function init(mode) {
    platform = mode;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Licht
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // Initialisiere Module
    network = new NetworkManager(scene);
    input = new InputHandler(camera, platform, scene, blocks);

    if (platform === 'pc') {
        controls = new PointerLockControls(camera, document.body);
        document.body.addEventListener('click', () => {
            controls.lock();
        });
    }

    createFloor();
    animate();
}

function createFloor() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
    for(let x = -10; x < 10; x++) {
        for(let z = -10; z < 10; z++) {
            const b = new THREE.Mesh(geo, mat);
            b.position.set(x, 0, z);
            scene.add(b);
            blocks.push(b);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Delta Zeit berechnen (Zeit seit dem letzten Frame)
    const delta = clock.getDelta();
    
    // Bewegung updaten
    if (input) {
        input.update(delta);
    }

    renderer.render(scene, camera);
}

// UI Binding
document.getElementById('btn-pc').onclick = () => {
    document.getElementById('start-menu').classList.add('hidden');
    init('pc');
};

document.getElementById('btn-mobile').onclick = () => {
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('mobile-controls').classList.remove('hidden');
    init('mobile');
};

// Fenstergröße anpassen
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
