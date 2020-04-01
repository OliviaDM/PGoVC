function out_of_cube(val) {
    if (val < 0.5) {
        return -1 -val;
    } else {
        return 1 + val;
    }
}

const light_pos = [out_of_cube(Math.random()), out_of_cube(Math.random()), out_of_cube(Math.random())];

function light_helpers() {
    return `

    // IN THE WORKS
    vec3 cloud_normal(vec3 cur_pos, int index) {
        return normalize(cur_pos - u_clouds_pos[index].xyz);
    }


    `
}

function light_rend() {
    return `


    // CODE CURRENTLY IN THE WORKS
    vec3 cl_col = vec3(1.0, 1.0, 1.0);
    if (first_cloud != -1) {
        vec3 normal = normalize(first_cloud_pos - u_clouds_pos[first_cloud].xyz);
        vec3 in_ray = normalize(u_light_pos - first_cloud_pos);
        // vec3 eye_ray = normalize()
        // cl_col = in_ray;
    }

    float col = 0.8;
    if ((alpha < 0.31) && (alpha > 0.29)) {
        cl_col = vec3(1.0, 1.0, 1.0);
        col = 1.0;
        alpha = 1.0;
    } else if (alpha < 0.3) {
        alpha = alpha * alpha;
    }
    `
}
