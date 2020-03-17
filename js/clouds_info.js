function generate_clouds(num, m_rad) {
    var cloud_array = [];
    for (i = 0; i < num; i++) {
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*0.5 + 0.25);
        cloud_array.push(Math.random()*m_rad);
    }
    return cloud_array;
}
