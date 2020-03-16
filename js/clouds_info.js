function generate_clouds(num) {
    var cloud_array = [];
    for (i = 0; i < num; i++) {
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*0.25);
    }
    console.log(cloud_array[0], cloud_array[1], cloud_array[2], cloud_array[3]);
    return cloud_array;
}

function generate_a_cloud() {
    return [Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*0.2];
}