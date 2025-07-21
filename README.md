# 3D Knowledge Graph

A Three.js-based interactive 3D visualization of knowledge graphs with physics simulation and real-time editing capabilities.

## Features

- **3D Visualization**: Interactive 3D graph with nodes and edges rendered using Three.js
- **Physics Simulation**: Real-time force-directed layout with repulsion, attraction, and centering forces
- **Interactive Editing**: Add, remove, and connect nodes in real-time
- **Node Selection**: Multi-select nodes for batch operations
- **Hover Effects**: Smooth scaling animations on node hover
- **Color Coding**: Nodes are colored based on their connection count
- **Camera Controls**: Orbit controls for navigation (rotate, zoom, pan)
- **GUI Controls**: Adjustable physics parameters via lil-gui
- **FPS Counter**: Real-time performance monitoring

## Demo

The project comes with sample data representing a game development knowledge graph with interconnected concepts like Game Design, Programming, Art & Graphics, Audio Design, and more.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tg_bot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the displayed local URL (typically `http://localhost:5173`)

## Usage

### Navigation
- **Rotate**: Click and drag to rotate the camera around the graph
- **Zoom**: Scroll wheel to zoom in/out
- **Pan**: Right-click and drag to pan the view

### Node Interaction
- **Hover**: Hover over nodes to see scaling animation and change cursor
- **Click**: 
  - Without editor: Opens the node's URL in a new tab
  - With editor: Selects/deselects the node

### Graph Editing
The editor panel on the left provides tools for:

- **Add Node**: Enter a label and click "Add Node"
- **Add/Remove Edge**: Enter two node IDs to connect or disconnect them
- **Multi-select Operations**:
  - Connect all selected nodes to each other
  - Disconnect all connections between selected nodes
  - Delete selected nodes
- **Clear Selection**: Deselect all nodes

### Physics Controls
Use the GUI panel to adjust:
- **Camera Settings**: Zoom speed
- **Physics Settings**: 
  - Repulsion strength between nodes
  - Attraction strength for connected nodes
  - Centering force to keep nodes near origin

## Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # Global styles
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.js             # Application entry point
│   ├── docs.js             # Sample data nodes
│   ├── GUI.js              # lil-gui controls setup
│   ├── core/
│   │   ├── graph.js        # Main Graph3D class
│   │   ├── GraphEditor.js  # Graph editing functionality
│   │   ├── graphIntecation.js # Mouse interaction handling
│   │   ├── navigate.js     # Camera and orbit controls
│   │   ├── scale_anim.js   # Node scaling animations
│   │   └── text.js         # Text sprite creation
│   └── physics/
│       └── graphPhysics.js # Physics simulation engine
```

## Customization

### Adding Custom Data
Replace or modify the `sampleNodes` array in [src/docs.js](src/docs.js):

```javascript
export const sampleNodes = [
    { 
        id: 'unique-id', 
        label: 'Display Name', 
        connections: ['other-node-id'], 
        url: 'https://example.com' 
    },
];
```

### Adjusting Physics
Modify parameters in [src/physics/graphPhysics.js](src/physics/graphPhysics.js):

```javascript
this.repulsionStrength = 1;
this.attractionStrength = 0.09;
this.centeringStrength = 0.02;
this.damping = 0.3;
```

### Styling Nodes
Customize node appearance in the `addNode` method of [src/core/graph.js](src/core/graph.js):

```javascript
const material = new THREE.PointsMaterial({ 
    color: 0xff4444,
    size: 0.04,
    transparent: true,
    opacity: 0.8
});
```

## Browser Support

Requires a modern browser with WebGL support. Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available under