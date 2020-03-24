// 



// def cube_points(xi, yi, zi):
//     n, h = number_of_points(xi, yi, zi)
//     points = []

//     for i in range(n):
//         point_coords = []

//         h = hash(xi, yi, zi, h)
//         point_coords.append(xi + h/255)
//         h = hash(xi, yi, zi, h)
//         point_coords.append(yi + h/255)
//         h = hash(xi, yi, zi, h)
//         point_coords.append(zi + h/255)

//         points.append(point_coords)

//     return points


// def closest_in_cube(x, y, z, pts_arr):
//     closest_dist = 0
//     closest_pt = None

//     for pt in pts_arr:
//         dist = math.sqrt((x-pt[0])**2 + (y-pt[1])**2 + (z-pt[2])**2)
//         if dist < closest_dist or closest_pt == None:
//             closest_dist = dist
//             closest_pt = pt

//     return closest_pt, closest_dist

    

// def cycle_cubes(x, y, z):

//     xi = math.floor(x)
//     yi = math.floor(y)
//     zi = math.floor(z)

//     closest_dist = 0
//     closest_pt = None

//     for n in neighbourgs1:
//         xj = xi + n[0]
//         yj = yi + n[1]
//         zj = zi + n[2]

//         if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
//             pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
//             if dist < closest_dist or closest_pt == None:
//                 closest_dist = dist
//                 closest_pt = pt

//     if closest_dist > 1:
//         for n in neighbourgs2:
//             xj = xi + n[0]
//             yj = yi + n[1]
//             zj = zi + n[2]

//             if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
//                 pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
//                 if dist < closest_dist or closest_pt == None:
//                     closest_dist = dist
//                     closest_pt = pt

//     return closest_dist

    




// def worley(x, y, z):

//     w = cycle_cubes(x, y, z)
//     if w > 1:
//         w = 1
//     return w * 255
    


// im = Image.new('L', (700, 700))
// pixdata = []
// # for k in range (0, 700):
// for i in range (0, 700):
//     for j in range (0,700):
//         w1 = worley(20*i/700, 20*j/700, 0)
//         w2 = worley(5*i/700, 5*j/700, 0)
//         pixdata.append((4*w2 + 1*w1)/5)
//         print(i, j)
// im.putdata(pixdata)
// im.save('test.png')

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

        float closest_dist = -1.0;
        vec3 closest_pt = vec3(0.0, 0.0, 0.0);
        float looping = 0.0;

        for (int i = 0; i < 27; i++) {
            vec3 cube_coords = vec3(xi + u_n1[i][0], yi + u_n1[i][1], zi + u_n1[i][2]);    // 170
            
            if (cube_coords.x >= 0.0 && cube_coords.y >= 0.0 && cube_coords.z >= 0.0 && cube_coords.x < 256.0 && cube_coords.y < 256.0 && cube_coords.z < 256.0){
                vec4 next_pt = closest_in_cube(cube_coords, pos);
                if ((next_pt.w < closest_dist) || (closest_dist < 0.0)) {
                    looping += 0.1;
                    closest_dist = next_pt.w;
                    closest_pt = next_pt.xyz;
                }
            }
        }
        
        if (closest_dist < 1.0) {
            for (int i = 0; i < 54; i++) {
                vec3 cube_coords = vec3(xi + u_n2[i][0], yi + u_n2[i][1], zi + u_n2[i][2]);
                
                if (cube_coords.x >= 0.0 && cube_coords.y >= 0.0 && cube_coords.z >= 0.0 && cube_coords.x < 256.0 && cube_coords.y < 256.0 && cube_coords.z < 256.0){
                    vec4 next_pt = closest_in_cube(cube_coords, pos);
                    if ((next_pt.w < closest_dist) || (closest_dist < 0.0)) {
                        looping += 0.1;
                        closest_dist = next_pt.w;
                        closest_pt = next_pt.xyz;
                    }
                }
            }
        }

        return closest_dist;
        // return looping;
    }

    float worley(vec3 pos, float scale){
        float w = cycle_cubes(scale * pos);
        if (w > 1.0) {
            w = 1.0;
        }
        return w;
    }

    `
}