import * as THREE from 'three';
import { Graph3D } from './core/graph.js';
import { sampleNodes } from './docs.js';
import { camera, initializeControls } from './core/navigate.js';
import { createGUI } from './GUI.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141414);

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = initializeControls(renderer);

const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);


const graph = new Graph3D(scene, camera, renderer);
const gui = createGUI(controls, graph.physics);


sampleNodes.forEach(nodeData => {
    graph.addNode(nodeData.id, nodeData.label, null, nodeData.url);
});
sampleNodes.forEach(nodeData => {
    nodeData.connections.forEach(connectionId => {
        graph.addEdge(nodeData.id, connectionId);
    });
});
graph.updateNodeColors();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    graph.applyForces();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();