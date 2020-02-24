function voxel_box (dim, pos_x, pos_y, pos_z) {
    const geometry = new THREE.BoxGeometry( dim, dim, dim );

    let uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: frag_shade,
        vertexShader: vert_shade,
    });

    vox = new THREE.Mesh( geometry, material );
    vox.position.set(pos_x, pos_y, pos_z);

    return vox;
};

function voxel_grid (dim, num_x, num_y, num_z) {

    var voxel_buff = [];

    for (i = -(num_x/2); i < num_x - num_x/2; i++) {
        for (j = 0; j < num_y; j++) {
            for (k = 0; k < num_z; k++) {
                
                voxel_buff.push(voxel_box(dim, i, j, k));
            }
        }
    }

    return voxel_buff;  
};