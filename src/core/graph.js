import * as THREE from 'three';
import { createTextSprite } from './text.js';
import { ScaleAnimator } from './scale_anim.js';
import { InteractionHandler } from './graphIntecation.js';
import { GraphPhysic } from '../physics/graphPhysics.js';

export class Graph3D {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.nodes = new Map();
        this.edges = [];

        this.nodeGroup = new THREE.Group();
        this.edgeGroup = new THREE.Group();
        this.labelGroup = new THREE.Group();
    
        this.originalScale = 0.2;
        this.hoverScale = 0.45;

        this.scaleAnimator = new ScaleAnimator();
        this.physics = new GraphPhysic();
        this.interactionHandler = new InteractionHandler(this, camera, renderer);
        this.setupGroups();
    }

    setupGroups() {
        this.scene.add(this.nodeGroup);
        this.scene.add(this.edgeGroup);
        this.scene.add(this.labelGroup);
    }

    addNode(id, label, position = null, url = null) {
        if (!position) {
            position = {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10
            };
        }

        const geometry = new THREE.SphereGeometry(0.3, 14, 14);
        const material = new THREE.PointsMaterial({ 
            color: 0xff4444,
            size: 0.04,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Points(geometry, material);

        sphere.position.set(position.x, position.y, position.z);
        sphere.userData = { id, label, url, velocity: new THREE.Vector3() };

        const textSprite = createTextSprite(label, {
            fontSize: 32,
            textColor: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 8
        });
    
        textSprite.position.set(position.x, position.y - 0.8, position.z);
        textSprite.userData = { nodeId: id, isLabel: true };

        this.nodes.set(id, { sphere, label: textSprite });
        this.nodeGroup.add(sphere);
        this.labelGroup.add(textSprite);

        return { sphere, label: textSprite };
    }

    addEdge(nodeId1, nodeId2) {
        const node1 = this.nodes.get(nodeId1);
        const node2 = this.nodes.get(nodeId2);

        if (node1 && node2) {
            const geometry = new THREE.BufferGeometry();
            const points = [node1.sphere.position.clone(), node2.sphere.position.clone()];
            geometry.setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x666666,
                transparent: true,
                opacity: 0.5
            });

            const line = new THREE.Line(geometry, material);
            const edge = { nodeId1, nodeId2, geometry, line };

            this.edges.push(edge);
            this.edgeGroup.add(line);
            return edge;
        }
        return null;
    }

    updateEdges() {
        this.edges.forEach(edge => {
            const node1 = this.nodes.get(edge.nodeId1);
            const node2 = this.nodes.get(edge.nodeId2);
            if (node1 && node2) {
                const points = [node1.sphere.position.clone(), node2.sphere.position.clone()];
                edge.geometry.setFromPoints(points);
            }
        });
    }

    updateLabels() {
        this.nodes.forEach((node, id) => {
            node.label.position.set(
                node.sphere.position.x,
                node.sphere.position.y - 0.8,
                node.sphere.position.z
            );
        });
    }

    applyForces() {
        const nodes = Array.from(this.nodes.values());
        this.physics.applyPhysic(nodes, this.nodes, this.edges);
        this.updateEdges();
        this.updateLabels();
        this.scaleAnimator.update();
    }
}