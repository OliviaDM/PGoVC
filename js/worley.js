let worl_1 = [true, 20.0, 2];
let worl_2 = [true, 5.0, 3];

function worley_sum() {
    let sum = "";
    let coeff_sum = 0;

    if (worl_1[0]) {
        sum = sum + `worl_total += ${worl_1[2]}.0 * worley(pos, ${worl_1[1]}.0); \n`;  // 97
        coeff_sum += worl_1[2];
    }
    if (worl_2[0]) {
        sum = sum + `worl_total += ${worl_2[2]}.0 * worley(pos, ${worl_2[1]}.0); \n`;  // 98
        coeff_sum += worl_2[2];
    }

    if (coeff_sum != 0) {
        sum = sum + `worl_total = worl_total / ${coeff_sum}.0;\n`   // 100
    }

    return sum;
}

function worley() {
    return `  // 110

    uniform vec3 u_n1[27];
    uniform vec3 u_n2[54];
    uniform int u_cut_offs[9];
    
    float w_hash(vec3 cube_coords, float h_seed) {

        int xi = int(cube_coords.x);
        int yi = int(cube_coords.y);
        int zi = int(cube_coords.z);   // 120
        int seed = int(h_seed);

        return float(p_perm[ (p_perm[ (p_perm[ (xi + seed) % 256 ]+ yi) % 256 ]+ zi) % 256 ]);
    }

    vec4 next_cube_pt(vec3 cube_coords, float cur_hash) {

        float h = w_hash(cube_coords, cur_hash);
        float new_x = cube_coords.x + h/255.0;
        h = w_hash(cube_coords, h);                   // 130
        float new_y = cube_coords.y + h/255.0;
        h = w_hash(cube_coords, h);
        float new_z = cube_coords.z + h/255.0;

        return vec4(new_x, new_y, new_z, h);
    }

    int find_cut_off(int hash) {
        int c_o = -1;
        for (int i = 0; i < 9; i++) {
            if ((c_o < 0) && (hash <= u_cut_offs[i])) {
                c_o = i + 1;
                break;
            }
        }
        return c_o;
    }

    vec4 closest_in_cube(vec3 cube_coords, vec3 pos) {

        float closest_dist = -1.0;                               // 140
        vec3 closest_pt = vec3(0.0, 0.0, 0.0);

        float h = w_hash(cube_coords, 0.0);
        int pt_num = find_cut_off(int(h));

        for (int n = 0; n < pt_num; n++) {
            vec4 next_pt = next_cube_pt(cube_coords, h);
            h = next_pt.w;
            float dist = length(pos - next_pt.xyz);
            if ((dist < closest_dist) || (closest_dist < 0.0)) {     // 150
                closest_dist = dist;
                closest_pt = next_pt.xyz;
            }
        }

        return vec4(closest_pt, closest_dist);
    }


    float cycle_cubes(vec3 pos){              // 160

        float xi = floor(pos.x);
        float yi = floor(pos.y);
        float zi = floor(pos.z);

        // int return_val = find_cut_off(int(w_hash(vec3(xi, yi, zi), 0.0)));
        // return float(return_val);

        vec4 next_pt = closest_in_cube(vec3(xi, yi, zi), pos);

        float closest_dist = next_pt.w;
        vec3 closest_pt = next_pt.xyz;

        for (int i = 0; i < 27; i++) {
            vec3 cube_coords = vec3(xi + u_n1[i][0], yi + u_n1[i][1], zi + u_n1[i][2]);    // 170
            cube_coords.x = float(int(cube_coords.x) % 256);
            cube_coords.y = float(int(cube_coords.y) % 256);
            cube_coords.z = float(int(cube_coords.z) % 256);
            
            next_pt = closest_in_cube(cube_coords, pos);
            if ((next_pt.w < closest_dist) || (closest_dist < 0.0)) {
                closest_dist = next_pt.w;
                closest_pt = next_pt.xyz;
            }   
        }
        
        if (closest_dist > 1.0) {
            for (int i = 0; i < 54; i++) {
                vec3 cube_coords = vec3((xi + u_n2[i][0]), (yi + u_n2[i][1]), (zi + u_n2[i][2]));
                cube_coords.x = float(int(cube_coords.x) % 256);
                cube_coords.y = float(int(cube_coords.y) % 256);
                cube_coords.z = float(int(cube_coords.z) % 256);
                
                vec4 next_pt = closest_in_cube(cube_coords, pos);
                if ((next_pt.w < closest_dist) || (closest_dist < 0.0)) {
                    closest_dist = next_pt.w;
                    closest_pt = next_pt.xyz;
                }             
            }
        }

        return closest_dist;
    }

    float worley(vec3 pos, float scale){
        float w = cycle_cubes(scale * pos);
        if (w > 1.0) {
            w = 1.0;
        }
        return 1.0 - w;
    }

    float layered_worley(vec3 pos) {
        float worl_total = 0.0;

        ${worley_sum()}

        worl_total = 2.0 * worl_total * worl_total;
        
        return worl_total;
    }

    `
}