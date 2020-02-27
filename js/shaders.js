const vert_shade = `
varying vec4 vUv; 

varying vec4 new_vox_pos;
varying vec4 new_x;
varying vec4 new_y;
varying vec4 new_z;

uniform vec3 vox_pos;
uniform float box_dim;

void main() {
    
    vec3 vox_x = vox_pos + vec3(box_dim/2.0, 0.0, 0.0);
    vec3 vox_y = vox_pos + vec3(0.0, box_dim/2.0, 0.0);
    vec3 vox_z = vox_pos + vec3(0.0, 0.0, box_dim/2.0);
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    
    new_vox_pos = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0));
    new_x = projectionMatrix * (modelViewMatrix * vec4(box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0));
    new_y = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, box_dim/2.0, -box_dim/2.0, 1.0));
    new_z = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, -box_dim/2.0, box_dim/2.0, 1.0));
    
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

bool is_inside_vox(in vec3 pos) {
    float scalar_comp_x = dot(pos - new_vox_pos.xyz, (new_x.xyz - new_vox_pos.xyz)/length(new_x.xyz - new_vox_pos.xyz))/length(new_x.xyz - new_vox_pos.xyz);
    float scalar_comp_y = dot(pos - new_vox_pos.xyz, (new_y.xyz - new_vox_pos.xyz)/length(new_y.xyz - new_vox_pos.xyz))/length(new_y.xyz - new_vox_pos.xyz);
    float scalar_comp_z = dot(pos - new_vox_pos.xyz, (new_z.xyz - new_vox_pos.xyz)/length(new_z.xyz - new_vox_pos.xyz))/length(new_z.xyz - new_vox_pos.xyz);
    return ((scalar_comp_x > 0.0) && (scalar_comp_x < 1.0) && (scalar_comp_y > 0.0) && (scalar_comp_y < 1.0) && (scalar_comp_z > 0.0) && (scalar_comp_z < 1.0));
}

vec3 scalar_val(in vec3 pos) {
    float scalar_comp_x = dot(pos - new_vox_pos.xyz, (new_x.xyz - new_vox_pos.xyz)/length(new_x.xyz - new_vox_pos.xyz))/length(new_x.xyz - new_vox_pos.xyz);
    float scalar_comp_y = dot(pos - new_vox_pos.xyz, (new_y.xyz - new_vox_pos.xyz)/length(new_y.xyz - new_vox_pos.xyz))/length(new_y.xyz - new_vox_pos.xyz);
    float scalar_comp_z = dot(pos - new_vox_pos.xyz, (new_z.xyz - new_vox_pos.xyz)/length(new_z.xyz - new_vox_pos.xyz))/length(new_z.xyz - new_vox_pos.xyz);
    return vec3(scalar_comp_x, scalar_comp_y,scalar_comp_z);
}

float sample_value(in vec3 pos) {
    return 1.0;
}

void main() {
    float step_size = 0.01;
    vec3 cur_pos = vUv.xyz;
    vec3 camera_pos = vec3(0.0,0.0,5.0);
    vec3 step_dir = normalize(cur_pos);
    int max_steps = int(box_dim/step_size);
    float count = 0.0;
    
    float cummulative_value = 0.0;

    for (int i = 0; i < 500; i += 1) {
        cummulative_value += 0.1;
        cur_pos = cur_pos + step_dir*step_size;
        // if (!is_inside_vox(cur_pos)) {
        //     break;
        // }
        count += 1.0;
    }
    
    // if (length(vUv.xyz - new_vox_pos.xyz) < 0.01) {
    //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // } else if (length(vUv.xyz - new_x.xyz) < 0.01) {
    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // } else if (length(vUv.xyz - new_y.xyz) < 0.01) {
    //     gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    // } else if (length(vUv.xyz - new_z.xyz) < 0.01) {
    //     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    // } else {
    //     if (scalar_val(cur_pos).x > 1.0) {
    //         gl_FragColor = vec4(1.0, 0.0, 0.0, 0.2);
    //     } else if (scalar_val(cur_pos).y > 1.0) {
    //         gl_FragColor = vec4(0.0, 1.0, 0.0, 0.2);
    //     } else if (scalar_val(cur_pos).z > 1.0) {
    //         gl_FragColor = vec4(0.0, 0.0, 1.0, 0.2);
    //     } else if (scalar_val(cur_pos).x < 0.0) {
    //         gl_FragColor = vec4(1.0, 0.0, 1.0, 0.2);
    //     } else if (scalar_val(cur_pos).y < 0.0) {
    //         gl_FragColor = vec4(1.0, 1.0, 0.0, 0.2);
    //     } else if (scalar_val(cur_pos).z < 0.0) {
    //         gl_FragColor = vec4(0.0, 1.0, 1.0, 0.2);
    //     } else {
    //         gl_FragColor = vec4(scalar_val(cur_pos), 0.05);
    //     }
    // }

    gl_FragColor = vec4(scalar_val(cur_pos), 1.0);
    
}`;

// general sampling function: while loop which cumulates the final opacity
// general colour function for a single sample point (will eventually call mulitple functions)
// test the inclusion of a point inside the cube

// for (int j = 0; j < 10; j+= 1) {
//     cummulative_value += 0.1;
//     cur_pos = cur_pos + step_dir*step_size;
// }