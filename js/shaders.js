
//MAIN SHADERS
function vert_shade(num_clouds) {
    const vs = `

    uniform vec4 clouds[${num_clouds}];
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    varying vec4 temp_front_pos; 
    varying vec4 new_clouds[${num_clouds}];
    varying float radiuses[${num_clouds}];

    attribute vec3 position;

    vec4 translate_point(vec3 point) {
        return projectionMatrix * (modelViewMatrix * vec4(point, 1.0));
    }

    void main() {
        
        for (int i = 0; i < ${num_clouds}; i++) {
            new_clouds[i] = translate_point(clouds[i].xyz);
            radiuses[i] = clouds[i].w;
        }
        
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        temp_front_pos = projectionMatrix * modelViewPosition;  
        gl_Position = temp_front_pos; 
    }
    `;
    return vs;
}

function frag_shade(num_clouds) {
    const fs = `#version 300 es
    precision mediump float;

    in vec4 temp_front_pos;
    in vec4 new_clouds[${num_clouds}];
    in float radiuses[${num_clouds}];

    uniform sampler2D back_text;
    uniform sampler2D perlin;
    uniform float window_w;
    uniform float window_h;

    out vec4 fColor;


    ${perlin()}


    //SAMPLING FUNCTIONS
    float cloud_density(vec4 cld, float rad, vec3 pos) {
        vec3 cloud_center = vec3(cld.xy, (cld.z + 0.99)*100.00)*0.5 + vec3(0.5, 0.5, 0.5);
        float val = ((rad - length(cloud_center - pos)) / rad)*0.7;
        return max(0.0, val);
    }

    float sample_clouds(vec3 pos) {
        float val = 0.0;
        ${sample_clouds_loop(num_clouds)}
        return val;
    }

    float sample_point(vec3 pos) {
        return sample_clouds(pos);
    }










    void main() {
        
        //                                  GET BACK POSITION OF CUBE
        vec2 screen_coord = gl_FragCoord.xy;
        vec4 back_pos = texture( back_text, vec2(screen_coord.x / window_w, screen_coord.y / window_h) );
        vec4 perlin_noise = texture( perlin, vec2(screen_coord.x / window_w, screen_coord.y / window_h) );
        
        
        //                                  SET UP
        vec4 front_pos = vec4(temp_front_pos.xy, (temp_front_pos.z + 0.99)*100.00, 1.0)*0.5 + vec4(0.5, 0.5, 0.5, 0.5);
        float step_size = 0.01;
        vec4 step_dir = vec4(0.0, 0.0, step_size, 0.0);
        vec4 cur_pos = front_pos;
        float total_alpha = 0.0;

        //                                  SAMPLE LOOP
        for (int i = 0; i < 200; i++) {
            total_alpha += sample_point(cur_pos.xyz) / 40.0;
            cur_pos += step_dir;
            if (cur_pos.z >= back_pos.z) {
                break;
            }
        }

        // float diff = back_pos.z - front_pos.z;

        fColor = vec4(1.0, 1.0, 1.0, total_alpha - perlin_noise.x*0.05);

    }`;
    return fs;
}

function sample_clouds_loop(num_clouds) {
    str = ``;
    for (i = 0; i < num_clouds; i++) {
        str += `val += cloud_density(new_clouds[${i}], radiuses[${i}], pos);\n`
    }
    return str;
}

function perlin() {
    return `uniform int p_perm[512];


    int hash(int xi, int yi, int zi) {
        return p_perm[ p_perm[ p_perm[ xi ]+ yi ]+ zi ];
    }
    
    float fade(float t) {
        return -t * t * t * (t * (t * 6.0 + 15.0) + 10.0);
    }
    
    float grad(int hash, float x, float y, float z) {
        
        float u = -y;
        if (hash < 128) { 
            u = -x; 
        }

        float v = -z;
        if (hash < 64) {
            v = -y;
        } else if ((hash >= 192 && hash < 208) || (hash >= 224 && hash < 240)) {
            v = -x;
        }

        if (hash >= 128) {
            hash -= 128;
        }
        if (hash >= 64) {
            hash -= 64;
        }
        if (hash >= 32) {
            u = -u;
            hash -= 32;
        }
        if (hash >= 16) {
            v = -v;
        }

        return u + v;
    }
    
    float lerp(float a, float b, float x) {
        return a + x * (b - a);
    }
    
    
    float perlin_noise(float x, float y, float z) {
    
        int xi = int(floor(x));
        int yi = int(floor(y));
        int zi = int(floor(z));
        float xf = floor(x) - x;
        float yf = floor(y) - y;
        float zf = floor(z) - z;
    
        float u = fade(xf);
        float v = fade(yf);
        float w = fade(zf);
    
        int aaa = hash(xi, yi, zi);
        int aba = hash(xi, yi + 1, zi);
        int aab = hash(xi, yi, zi + 1);
        int abb = hash(xi, yi + 1, zi + 1);
        int baa = hash(xi + 1, yi, zi);
        int bba = hash(xi + 1, yi + 1, zi);
        int bab = hash(xi + 1, yi, zi + 1);
        int bbb = hash(xi + 1, yi + 1, zi + 1);
    
        float x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf+1.0, yf, zf), u);
        float x2 = lerp(grad(aba, xf, yf+1.0, zf), grad(bba, xf+1.0, yf+1.0, zf), u);
        float y1 = lerp(x1, x2, v);
    
        x1 = lerp(grad(aab, xf, yf, zf+1.0), grad(bab, xf+1.0, yf, zf+1.0), u);
        x2 = lerp(grad(abb, xf, yf+1.0, zf+1.0), grad(bbb, xf+1.0, yf+1.0, zf+1.0), u);
        float y2 = lerp(x1, x2, v);
            
        return (lerp(y1, y2, w)+1.0)/2.0;
    }`
}







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