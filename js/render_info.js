function add_back_material (geom, bfs, bvs) {

    const material = new THREE.ShaderMaterial({
        fragmentShader: bfs,
        vertexShader: bvs,
        side: THREE.BackSide,
    });

    vol = new THREE.Mesh( geom, material );

    return vol;
};

function add_material (geom, fs, vs, text, window_w, window_h) {

    const uniforms = {
        back_text: {
            type: "t",
            value: text.texture,
        },
        window_w: { type: "float", value: window_w },
        window_h: { type: "float", value: window_h },
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        transparent: true,
        fragmentShader: fs,
        vertexShader: vs,
        side: THREE.FrontSide,
    });

    // vox = new THREE.Mesh( geom, material );
    const temp_mat = new THREE.MeshBasicMaterial({map:text.texture});
    vox = new THREE.Mesh(geom, temp_mat);

    return vox;
};