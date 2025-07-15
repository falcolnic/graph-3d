import * as THREE from 'three';

export class GraphPhysic {
    constructor() {
        this.repulsionStrength = 1;
        this.attractionStrength = 0.09;
        this.centeringStrength = 0.02;
        this.damping = 0.3;
    }

    applyPhysic(nodes, nodesMap, edges) {
        this.resetVelocities(nodes);
        this.applyRepulsion(nodes);
        this.applyAttraction(nodesMap, edges);
        this.applyCentering(nodes);
        this.updatePositions(nodes);
    }

    resetVelocities(nodes) {
        nodes.forEach(node => {
            if (!node.sphere.userData.velocity) {node.sphere.userData.velocity = new THREE.Vector3();}
            node.sphere.userData.velocity.multiplyScalar(0)
        });
    }

    applyRepulsion(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                const distance = nodeA.sphere.position.distanceTo(nodeB.sphere.position);
                if (distance > 0) {
                    const force = this.repulsionStrength / (distance * distance);
                    const direction = new THREE.Vector3()
                        .subVectors(nodeA.sphere.position, nodeB.sphere.position)
                        .normalize()
                        .multiplyScalar(force);

                    nodeA.sphere.userData.velocity.add(direction);
                    nodeB.sphere.userData.velocity.sub(direction);
                }
            }
        }
    }

    applyAttraction(nodesMap, edges) {
        edges.forEach(edge => {
            const nodeA = nodesMap.get(edge.nodeId1);
            const nodeB = nodesMap.get(edge.nodeId2);

            if (nodeA && nodeB) {
                const distance = nodeA.sphere.position.distanceTo(nodeB.sphere.position);
                const force = distance * this.attractionStrength;
                const direction = new THREE.Vector3()
                    .subVectors(nodeB.sphere.position, nodeA.sphere.position)
                    .normalize()
                    .multiplyScalar(force);

                nodeA.sphere.userData.velocity.add(direction);
                nodeB.sphere.userData.velocity.sub(direction);
            }
        });
    }

    applyCentering(nodes) {
        nodes.forEach(node => {
            const distanceFromCenter = node.sphere.position.length();
            if (distanceFromCenter > 0) {
                const centeringForce = new THREE.Vector3()
                    .copy(node.sphere.position)
                    .normalize()
                    .multiplyScalar(-this.centeringStrength * distanceFromCenter);
                
                node.sphere.userData.velocity.add(centeringForce);
            }
        });
    }

    updatePositions(nodes) {
        nodes.forEach(node => {
            if (node.sphere.userData.velocity) {
                node.sphere.position.add(node.sphere.userData.velocity);
                node.sphere.userData.velocity.multiplyScalar(this.damping);
            }
        });
    }
}