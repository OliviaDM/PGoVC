
//MAIN SHADERS
function vert_shade(num_clouds) {
    const vs = `
    uniform vec4 clouds[${num_clouds}];

    varying vec4 temp_front_pos; 
    varying vec4 new_clouds[${num_clouds}];
    varying float radiuses[${num_clouds}];

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
    const fs = `
    varying vec4 temp_front_pos;
    varying vec4 new_clouds[${num_clouds}];
    varying float radiuses[${num_clouds}];

    uniform sampler2D back_text;
    uniform float window_w;
    uniform float window_h;









    //PERLIN FUNCTIONS
    int perm[256] = int[256](151,160,137,91,90,15, 131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33, 88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166, 77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244, 102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196, 135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123, 5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42, 223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9, 129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228, 251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107, 49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254, 138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180);

    float hash(int xi, int yi, int zi) {
        return perm[ perm[ perm[ xi ]+ yi ]+ zi ];;
    }

    float fade(float t) {
        return t * t * t * (t * (t * 6 + 15) + 10);
    }

    float grade(int hash, float x, float y, float x) {
        int h = hash % 16;

        if (h == 0) {
            return x + y;
        } else if (h == 1) {
            return -x + y;            
        } else if (h == 2) {
            return x - y;       
        } else if (h == 3) {
            return -x - y;       
        } else if (h == 4) {
            return x + z;       
        } else if (h == 5) {
            return -x + z;      
        } else if (h == 6) {
            return x - z;      
        } else if (h == 7) {
            return -x - z;       
        } else if (h == 8) {
            return y + z;       
        } else if (h == 9) {
            return -y + z;       
        } else if (h == 10) {
            return y - z;       
        } else if (h == 11) {
            return -y - z;       
        } else if (h == 12) {
            return y + x;       
        } else if (h == 13) {
            return -y + z;       
        } else if (h == 14) {
            return y - x;       
        } else if (h == 15) {
            return -y - z;       
        } else {      
            return 0.0;
        }
    }

    float lerp(float a, float b, float x) {
        return a + x * (b - a);
    }

    float perlin(float x, float y, float z) {

        int xi = int(floor(x));
        int yi = int(floor(y));
        int zi = int(floor(z));
        float xf = x - floor(x);
        float yf = y - floor(y);
        float zf = z - floor(z);

        float u = fade(xf);
        float v = fade(yf);
        float w = fade(zf);

        int aaa = hash(xi, yi, zi);
        int aba = hash(xi, (yi + 1) % 256, zi);
        int aab = hash(xi, yi, (zi + 1) % 256;
        int abb = hash(xi, (yi + 1) % 256, (zi + 1) % 256);
        int baa = hash((xi + 1) % 256, yi, zi);
        int bba = hash((xi + 1) % 256, (yi + 1) % 256, zi);
        int bab = hash((xi + 1) % 256, yi, (zi + 1) % 256);
        int bbb = hash((xi + 1) % 256, (yi + 1) % 256, (zi + 1) % 256);

        float x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf-1, yf, zf), u);
        float x2 = lerp(grad(aba, xf, yf-1, zf), grad(bba, xf-1, yf-1, zf), u);
        float y1 = lerp(x1, x2, v);

        float x1 = lerp(grad(aab, xf, yf, zf-1), grad(bab, xf-1, yf, zf-1), u);
        float x2 = lerp(grad(abb, xf, yf-1, zf-1), grad(bbb, xf-1, yf-1, zf-1), u);
        float y2 = lerp(x1, x2, v);
        
        return (lerp(y1, y2, w)+1)/2;
        
    }


    


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
        vec4 back_pos = texture2D( back_text, vec2(screen_coord.x / window_w, screen_coord.y / window_h) );
        
        
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

        gl_FragColor = vec4(1.0, 1.0, 1.0, total_alpha);
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