const vert_shade = `
varying vec3 vUv; 

void main() {
    vUv = position; 

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}
`;

const frag_shade = `
uniform vec3 colorA; 
uniform vec3 colorB; 
uniform vec3 vox_pos;
varying vec3 vUv;

void main() {
    gl_FragColor = vec4(1, 1, 1, 0.1);
}
`;