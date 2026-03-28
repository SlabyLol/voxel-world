export class NetworkManager {
    constructor(scene) {
        this.scene = scene;
        this.peer = new Peer(); // Generates a random ID
        this.connections = [];

        this.peer.on('open', (id) => {
            document.getElementById('peer-status').innerText = `Your ID: ${id}`;
            console.log('My peer ID is: ' + id);
        });

        // Listen for incoming connections
        this.peer.on('connection', (conn) => {
            this.setupConnection(conn);
        });
    }

    connectToPeer(targetId) {
        const conn = this.peer.connect(targetId);
        this.setupConnection(conn);
    }

    setupConnection(conn) {
        conn.on('open', () => {
            console.log("Connected to: " + conn.peer);
            this.connections.push(conn);
            conn.send({ type: 'chat', message: 'Hello from DarkFox!' });
        });

        conn.on('data', (data) => {
            if (data.type === 'block_placed') {
                this.renderRemoteBlock(data.pos, data.color);
            }
        });
    }

    broadcast(data) {
        this.connections.forEach(conn => conn.send(data));
    }

    renderRemoteBlock(pos, color) {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshLambertMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        this.scene.add(mesh);
    }
}
