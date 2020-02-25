
function voxel_box (dim, pos_x, pos_y, pos_z, fs, vs) {
    const geometry = new THREE.BoxGeometry( dim, dim, dim );

    let uniforms = {
        vox_pos: {type: 'vec3', value: {x: pos_x, y: pos_y, z: pos_z}},
        sphere_centre: {type: 'vec3', value: {x: 0, y: 0, z: 0}},
        sphere_radius: {type: 'int', value: 1},
        box_dim: {type: 'float', value: dim},
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        transparent: true,
        fragmentShader: fs,
        vertexShader: vs,
    });

    vox = new THREE.Mesh( geometry, material );
    vox.position.set(pos_x, pos_y, pos_z);

    return vox;
};

function voxel_grid (num, fs, vs) {

    const dim = 4.0/num;

    var voxel_buff = [];

    for (i = 0; i < num; i++) {
        for (j = 0; j < num; j++) {
            for (k = 0; k < num; k++) {
                
                voxel_buff.push(voxel_box(dim, i*dim - 2, j*dim - 2, k*dim - 2, fs, vs));
            }
        }
    }

    return voxel_buff;  
};