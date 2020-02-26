const vert_shade = `
varying vec4 vUv; 

varying vec4 new_vox_pos;
varying vec4 new_x;
varying vec4 new_y;
varying vec4 new_z;

uniform vec3 vox_pos;
uniform float box_dim;

void main() {
    
    vec3 vox_x = vox_pos + vec3(box_dim, 0.0, 0.0);
    vec3 vox_y = vox_pos + vec3(0.0, box_dim, 0.0);
    vec3 vox_z = vox_pos + vec3(0.0, 0.0, box_dim);
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    
    new_vox_pos = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0));
    new_x = projectionMatrix * (modelViewMatrix * vec4(0.1, 0.0, 0.0, 1.0));
    new_y = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.1, 0.0, 1.0));
    new_z = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 1.0, 1.0));
    
    vUv = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewPosition;  
}
`;

// 

const frag_shade = `
uniform vec3 vox_pos;
uniform vec3 sphere_centre;
uniform int sphere_radius;
uniform float box_dim;

varying vec4 vUv;
varying vec4 new_vox_pos;
varying vec4 new_x;
varying vec4 new_y;
varying vec4 new_z;

void main() {
    float step_size = 0.01;
    vec3 cur_pos = vUv.xyz + new_vox_pos.xyz;
    vec3 camera_pos = vec3(0.0,0.0,5.0);
    vec3 step_dir = normalize(cur_pos - camera_pos);
    bool inside = true;

    float self_product = dot(new_y.xyz - new_vox_pos.xyz, new_y.xyz - new_vox_pos.xyz);

    float dot_x = dot(vUv.xyz - new_vox_pos.xyz, (1.0/sqrt(self_product))*(new_x.xyz - new_vox_pos.xyz))/sqrt(dot(new_y.xyz - new_vox_pos.xyz, new_y.xyz - new_vox_pos.xyz));
    float dot_y = dot(vUv.xyz - new_vox_pos.xyz, new_y.xyz - new_vox_pos.xyz)/dot(new_y.xyz - new_vox_pos.xyz, new_y.xyz - new_vox_pos.xyz);
    float dot_z = dot(vUv.xyz - new_vox_pos.xyz, new_z.xyz - new_vox_pos.xyz)/dot(new_z.xyz - new_vox_pos.xyz, new_z.xyz - new_vox_pos.xyz);

    if (dot_x >= 0.7) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, dot_x);
    }
    
}   
`;

// general sampling function: while loop which cumulates the final opacity
// general colour function for a single sample point (will eventually call mulitple functions)
// test the inclusion of a point inside the cube