
//MAIN SHADERS
const vert_shade = `
uniform vec4 clouds[1];

varying vec4 temp_front_pos; 
varying vec4 new_clouds[1];
varying float radiuses[1];

vec4 translate_point(vec3 point) {
    return projectionMatrix * (modelViewMatrix * vec4(point, 1.0));
}

void main() {
    
    for (int i = 0; i < 1; i++) {
        new_clouds[i] = translate_point(clouds[i].xyz);
        radiuses[i] = clouds[i].w;
    }
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    temp_front_pos = projectionMatrix * modelViewPosition;  
    gl_Position = temp_front_pos; 
}
`;

const frag_shade = `
varying vec4 temp_front_pos;
varying vec4 new_clouds[1];
varying float radiuses[1];

uniform sampler2D back_text;
uniform float window_w;
uniform float window_h;


//SAMPLING FUNCTIONS
float cloud_density(vec4 cld, float rad, vec3 pos) {
    vec3 cloud_center = vec3(cld.xy, (cld.z + 0.99)*100.00)*0.5 + vec3(0.5, 0.5, 0.5);
    float val = (rad - length(cloud_center - pos)) / rad;
    return max(0.0, val);
}

float sample_clouds(vec3 pos) {
    float val = 0.0;
    val += cloud_density(new_clouds[0], radiuses[0], pos);
    return val;
}

float sample_point(vec3 pos) {
    return sample_clouds(pos);
}



void main() {
    
    //                                  GET BACK POSITION OF CUBE
    vec2 screen_coord = gl_FragCoord.xy;
    vec4 back_pos = texture2D( back_text, vec2(screen_coord.x / window_w, screen_coord.y / window_h) );
    
    
    //                                  SET UP
    vec4 front_pos = vec4(temp_front_pos.xy, (temp_front_pos.z + 0.99)*100.00, 1.0)*0.5 + vec4(0.5, 0.5, 0.5, 0.5);
    float step_size = 0.01;
    vec4 step_dir = vec4(0.0, 0.0, step_size, 0.0);
    vec4 cur_pos = front_pos;
    float total_alpha = 0.0;

    //                                  SAMPLE LOOP
    for (int i = 0; i < 200; i++) {
        total_alpha += sample_point(cur_pos.xyz);
        cur_pos += step_dir;
        if (cur_pos.z >= back_pos.z) {
            break;
        }
    }

    // float diff = back_pos.z - front_pos.z;

    gl_FragColor = vec4(1.0, 1.0, 1.0, total_alpha);
}`;








//BACK POSITION SHADERS
const back_vert_shade = `
varying vec4 cur_pos; 

void main() {
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    cur_pos = projectionMatrix * modelViewPosition;  
    gl_Position = cur_pos;  

}`;

const back_frag_shade = `
varying vec4 cur_pos;

void main() {

    gl_FragColor = vec4(cur_pos.xy, (cur_pos.z + 0.99)*100.0, 1.0)*0.5 + vec4(0.5, 0.5, 0.5, 0.5);
}`;