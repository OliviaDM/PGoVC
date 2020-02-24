const vert_shade = `
varying vec3 vUv; 

void main() {
    vUv = position; 

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}
`;

const frag_shade = `
uniform vec3 vox_pos;
uniform vec3 sphere_centre;
uniform int sphere_radius;
varying vec3 vUv;

void main() {
    float dist = distance(vUv+vox_pos, sphere_centre);
    if (dist < 1.0) {
        gl_FragColor = vec4(1, 1, 1, 1.0 - dist);
    } else {
        gl_FragColor = vec4(1, 1, 1, 0);
    }
}
`;