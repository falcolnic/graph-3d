export class GraphEditor {
    constructor(graph) {
        this.graph = graph;
        this.selectedNodes = new Set();
        this.createUI();
    }

    createUI() {
        const panel = document.createElement('div');
        panel.id = 'editor-panel';
        panel.style.cssText = `
            position: fixed;
            top: 4%;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;

        panel.innerHTML = `
            <h3>Graph Editor</h3>
            <div>
                <input type="text" id="node-label" placeholder="Node label" style="margin: 5px 0; padding: 5px;">
                <button id="add-node">Add Node</button>
            </div>
            <div>
                <input type="text" id="node1-id" placeholder="Node 1 ID" style="margin: 5px 0; padding: 5px;">
                <input type="text" id="node2-id" placeholder="Node 2 ID" style="margin: 5px 0; padding: 5px;">
            </div>
            <div>
                <button id="add-edge">Add Edge</button>
                <button id="remove-edge">Remove Edge</button>
            </div>
            <div style="margin-bottom: 10px;">
                <p>Selected nodes: <span id="selected-count">0</span></p>
                <button id="connect-selected">Connect Selected</button>
                <button id="disconnect-selected">Disconnect Selected</button>
            </div>
            <div>
                <button id="delete-selected">Delete Selected Nodes</button>
                <button id="clear-selection">Clear Selection</button>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-node').addEventListener('click', () => {
            const label = document.getElementById('node-label').value.trim();
            if (label) {
                const id = Date.now().toString();
                this.graph.addNode(id, label);
                this.graph.updateNodeColors();
                document.getElementById('node-label').value = '';
            }
        });

        document.getElementById('add-edge').addEventListener('click', () => {
            const node1Id = document.getElementById('node1-id').value.trim();
            const node2Id = document.getElementById('node2-id').value.trim();

            if (node1Id && node2Id && this.graph.nodes.has(node1Id) && this.graph.nodes.has(node2Id)) {
                if (!this.graph.hasEdge(node1Id, node2Id)) {
                    this.graph.addEdge(node1Id, node2Id);
                    this.graph.updateNodeColors();
                }
                document.getElementById('node1-id').value = '';
                document.getElementById('node2-id').value = '';
            }
        });

        document.getElementById('remove-edge').addEventListener('click', () => {
            const node1Id = document.getElementById('node1-id').value.trim();
            const node2Id = document.getElementById('node2-id').value.trim();

            if (node1Id && node2Id && this.graph.hasEdge(node1Id, node2Id)) {
                this.graph.removeEdge(node1Id, node2Id);
                document.getElementById('node1-id').value = '';
                document.getElementById('node2-id').value = '';
            }
        });

        document.getElementById('disconnect-selected').addEventListener('click', () => {
            this.disconnectSelectedNodes();
        });

        document.getElementById('delete-selected').addEventListener('click', () => {
            this.deleteSelectedNodes();
        });
    
        document.getElementById('connect-selected').addEventListener('click', () => {
            this.connectSelectedNodes();
        });

        document.getElementById('clear-selection').addEventListener('click', () => {
            this.clearSelection();
        });
    }

    selectNode(nodeId) {
        this.selectedNodes.add(nodeId);
        this.updateSelectionDisplay();
        const node = this.graph.nodes.get(nodeId);
        if (node) {
            node.sphere.material.color.setHex(0x00ff00);
        }
    }

    deselectNode(nodeId) {
        this.selectedNodes.delete(nodeId);
        this.updateSelectionDisplay();
        this.graph.updateNodeColors();
    }

    connectSelectedNodes() {
        const nodeIds = Array.from(this.selectedNodes);
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                if (!this.graph.hasEdge(nodeIds[i], nodeIds[j])) { this.graph.addEdge(nodeIds[i], nodeIds[j]); }
            }
        }
        this.graph.updateNodeColors();
        this.clearSelection();
    }

    clearSelection() {
        this.selectedNodes.clear();
        this.updateSelectionDisplay();
        this.graph.updateNodeColors();
    }

    updateSelectionDisplay() {
        document.getElementById('selected-count').textContent = this.selectedNodes.size;
    }

    disconnectSelectedNodes() {
        const nodeIds = Array.from(this.selectedNodes);
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                if (this.graph.hasEdge(nodeIds[i], nodeIds[j])) {
                    this.graph.removeEdge(nodeIds[i], nodeIds[j]);
                }
            }
        }
        this.graph.updateNodeColors();
        this.clearSelection();
    }

    deleteSelectedNodes() {
        const nodeIds = Array.from(this.selectedNodes);
        nodeIds.forEach(nodeId => {
            this.graph.removeNode(nodeId);
        });
        this.clearSelection();
    }
}