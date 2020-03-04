
//MAIN SHADERS
const vert_shade = `
varying vec4 cur_pos; 

void main() {
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    cur_pos = projectionMatrix * modelViewPosition;  
    gl_Position = cur_pos;  
}
`;

const frag_shade = `
varying vec4 cur_pos;

uniform sampler2D back_text;
uniform float window_w;
uniform float window_h;

void main() {

    vec2 screen_coord = gl_FragCoord.xy;
    vec2 norm_screen_coord = vec2(screen_coord.x / window_w, screen_coord.y / window_h );
    gl_FragColor = texture2D( back_text, vec2(norm_screen_coord.x, norm_screen_coord.y) );
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

    gl_FragColor = vec4(cur_pos.xy, (cur_pos.z + 0.99)*100.0, 1.0);
}`;