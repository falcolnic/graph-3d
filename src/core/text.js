import * as THREE from 'three';

export function createTextSprite(text, parameters = {}) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const fontSize = parameters.fontSize || 32;
    const fontFamily = parameters.fontFamily || 'Arial, sans-serif';
    const textColor = parameters.textColor || 'rgba(255, 255, 255, 0.7)';
    const backgroundColor = 'rgba(0, 0, 0, 0.3)';
    const padding = parameters.padding || 10;

    context.font = `${fontSize}px ${fontFamily}`;
    const textWidth = context.measureText(text).width;
    const textHeight = fontSize;

    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.8
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    const scale = 0.5;
    sprite.scale.set(canvas.width * scale * 0.01, canvas.height * scale * 0.01, 1);
    return sprite;
}