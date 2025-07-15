export class ScaleAnimator {
    constructor() {
        this.animatingNodes = new Set();
        this.animationSpeed = 0.15;
    }

    animateNodeScale(nodeData, targetScale) {
        if (!nodeData.sphere.userData.animationData) {
            nodeData.sphere.userData.animationData = {
                currentScale: nodeData.sphere.scale.x,
                targetScale: targetScale,
                isAnimating: false
            };
        }
        nodeData.sphere.userData.animationData.targetScale = targetScale;
        nodeData.sphere.userData.animationData.isAnimating = true;
        this.animatingNodes.add(nodeData);
    }

    update() {
        this.animatingNodes.forEach(nodeData => {
            const animData = nodeData.sphere.userData.animationData;
            if (animData?.isAnimating) {
                const diff = animData.targetScale - animData.currentScale;
                if (Math.abs(diff) > 0.01) {
                    animData.currentScale += diff * this.animationSpeed;
                    nodeData.sphere.scale.setScalar(animData.currentScale);
                } else {
                    animData.currentScale = animData.targetScale;
                    nodeData.sphere.scale.setScalar(animData.targetScale);
                    animData.isAnimating = false;
                    this.animatingNodes.delete(nodeData);
                }
            }
        });
    }

    resetNodeScale(nodeData) {
        nodeData.sphere.scale.setScalar(1);
        if (nodeData.sphere.userData.animationData) {
            nodeData.sphere.userData.animationData.currentScale = 1;
            nodeData.sphere.userData.animationData.targetScale = 1;
            nodeData.sphere.userData.animationData.isAnimating = false;
        }
        this.animatingNodes.delete(nodeData);
    }
}