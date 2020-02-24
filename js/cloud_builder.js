
function cloud() {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );

    let uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: frag_shade,
        vertexShader: vert_shade,
    });

    return new THREE.Mesh( geometry, material );
}
