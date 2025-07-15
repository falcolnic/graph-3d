import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createGUI(controls, physics) {
    const gui = new GUI();

    const camFolder = gui.addFolder('Camera Settings');
    camFolder.add(controls, 'zoomSpeed', 0.1, 5, 0.01);

    const physFolder = gui.addFolder('Physics Settings');
    physFolder.add(physics, 'repulsionStrength', 0.1, 5, 0.01);
    physFolder.add(physics, 'attractionStrength', 0.01, 0.1, 0.01);
    physFolder.add(physics, 'centeringStrength', 0.01, 0.3, 0.01);
    return gui;
}