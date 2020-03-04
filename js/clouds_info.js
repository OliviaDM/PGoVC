function generate_clouds(num) {
    var cloud_array = [];
    for (i = 0; i < num; i++) {
        cloud_array.push(generate_a_cloud());
    }
    return cloud_array;
}

function generate_a_cloud() {
    return new THREE.Vector4(Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*0.2);
}