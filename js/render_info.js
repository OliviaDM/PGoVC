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

    const material = new THREE.ShaderMaterial({
        transparent: true,
        fragmentShader: fs,
        vertexShader: vs,
        side: THREE.FrontSide,
    });

    vox = new THREE.Mesh( geom, material );

    return vox;
};