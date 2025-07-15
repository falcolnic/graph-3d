import * as THREE from 'three';

export class InteractionHandler {
    constructor(graph, camera, renderer) {
        this.graph = graph;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredNode = null;

        this.isDragging = false;
        this.mouseDownTime = 0;
        this.mouseDownPosition = { x: 0, y: 0 };
        this.dragThreshold = 5;
        this.clickTimeThreshold = 300;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.renderer.domElement.addEventListener('mousedown', (event) => {
            this.isDragging = false;
            this.mouseDownTime = Date.now();
            this.mouseDownPosition.x = event.clientX;
            this.mouseDownPosition.y = event.clientY;
        });

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.updateMousePosition(event);
            this.checkDragging(event);
            this.handleHover();
        });

        this.renderer.domElement.addEventListener('mouseup', (event) => {
            const clickDuration = Date.now() - this.mouseDownTime;
            if (!this.isDragging && clickDuration < this.clickTimeThreshold) {
                this.updateMousePosition(event);
                this.handleClick();
            }
            this.resetDragState();
        });
    }

    updateMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    checkDragging(event) {
        if (this.mouseDownTime > 0) {
            const deltaX = Math.abs(event.clientX - this.mouseDownPosition.x);
            const deltaY = Math.abs(event.clientY - this.mouseDownPosition.y);
            if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
                this.isDragging = true;
            }
        }
    }

    resetDragState() {
        this.isDragging = false;
        this.mouseDownTime = 0;
    }

    handleHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const spheres = Array.from(this.graph.nodes.values()).map(node => node.sphere);
        const intersects = this.raycaster.intersectObjects(spheres);

        if (this.hoveredNode && (!intersects.length || intersects[0].object !== this.hoveredNode.sphere)) {
            this.graph.scaleAnimator.animateNodeScale(this.hoveredNode, 1);
            this.hoveredNode = null;
            document.body.style.cursor = 'default';
        }

        if (intersects.length > 0) {
            const intersectedSphere = intersects[0].object;
            const nodeData = Array.from(this.graph.nodes.values()).find(node => node.sphere === intersectedSphere);

            if (nodeData && nodeData !== this.hoveredNode) {
                if (this.hoveredNode) this.graph.scaleAnimator.animateNodeScale(this.hoveredNode, 1);
                this.hoveredNode = nodeData;
                this.graph.scaleAnimator.animateNodeScale(nodeData, this.graph.hoverScale / this.graph.originalScale);
                document.body.style.cursor = 'pointer';
            }
        }
    }

    handleClick() {
        if (this.hoveredNode) {
            const nodeId = this.hoveredNode.sphere.userData.id;
            const url = this.hoveredNode.sphere.userData.url;
            if (url) {window.open(url, '_blank');} 
            else { console.log(`Clicked on node: ${nodeId}`); }
        }
    }
}