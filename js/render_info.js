function add_back_material (geom, bfs, bvs) {

    const material = new THREE.ShaderMaterial({
        fragmentShader: bfs,
        vertexShader: bvs,
        side: THREE.BackSide,
    });

    vol = new THREE.Mesh( geom, material );

    return vol;
};

function add_material (geom, fs, vs) {

    let uniforms = {
        vox_pos: {type: 'vec3', value: {x: 0, y: 0, z: 0}},
        sphere_centre: {type: 'vec3', value: {x: 0, y: 0, z: 0}},
        sphere_radius: {type: 'int', value: 1},
        box_dim: {type: 'float', value: 2},
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        transparent: true,
        fragmentShader: fs,
        vertexShader: vs,
        side: THREE.FrontSide,
    });

    vox = new THREE.Mesh( geom, material );

    return vox;
};