import * as THREE from 'three';

export class InputHandler {
    constructor(camera, platform, scene, blocks) {
        this.camera = camera;
        this.platform = platform;
        this.scene = scene;
        this.blocks = blocks;
        this.move = { forward: false, backward: false, left: false, right: false };
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        if (this.platform === 'pc') {
            this.setupPC();
        } else {
            this.setupMobile();
        }
    }

    setupPC() {
        document.addEventListener('keydown', (e) => this.onKey(e.code, true));
        document.addEventListener('keyup', (e) => this.onKey(e.code, false));
    }

    onKey(code, isDown) {
        if (code === 'KeyW') this.move.forward = isDown;
        if (code === 'KeyS') this.move.backward = isDown;
        if (code === 'KeyA') this.move.left = isDown;
        if (code === 'KeyD') this.move.right = isDown;
        if (code === 'Space' && isDown && this.camera.position.y <= 2) {
            this.velocity.y += 5; // Simple Jump
        }
    }

    setupMobile() {
        // Jump Button Logic
        const btnJump = document.getElementById('btn-jump');
        btnJump.addEventListener('touchstart', () => { if(this.camera.position.y <= 2) this.velocity.y += 5; });

        // Action Button (Place Block)
        const btnAction = document.getElementById('btn-action');
        btnAction.addEventListener('touchstart', () => this.performAction());
    }

    update(delta) {
        // Gravity & Friction
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= 9.8 * delta; // Gravity

        this.direction.z = Number(this.move.forward) - Number(this.move.backward);
        this.direction.x = Number(this.move.right) - Number(this.move.left);
        this.direction.normalize();

        if (this.move.forward || this.move.backward) this.velocity.z -= this.direction.z * 40.0 * delta;
        if (this.move.left || this.move.right) this.velocity.x -= this.direction.x * 40.0 * delta;

        // Apply Movement
        this.camera.translateX(-this.velocity.x * delta);
        this.camera.translateZ(-this.velocity.z * delta);
        this.camera.position.y += this.velocity.y * delta;

        if (this.camera.position.y < 2) {
            this.velocity.y = 0;
            this.camera.position.y = 2;
        }
    }
}
