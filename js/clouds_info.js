let cloud_num = 12;
let max_rad = 0.5;

// generate num random spheres in space
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

// change radius range depending on position 
function radius_curve(cloud_pos) {

}

// change the spherical 'primitives' into elliptical possibly banana shaped borders by squishing it from different angles
function generate_squish(cloud_a) {
    var squish_array = [];
    for (i = 0; i < cloud_a.length/4; i++) {
        const y_pos = cloud_a[i*4 + 1];
        squish_array.push(squish_y_curve(y_pos, Math.random()));
        // const squish_x = Math.random();
        // const squish_y = Math.random();
        // const squish_z = Math.random();
        // const rotate_y = Math.random();
    }
    return squish_array;
}

// the lower the sphere the flatter it is (scale y)
function squish_y_curve(cloud_pos, val) {
    return (2 - Math.pow((1 - cloud_pos), 4)) * 0.5 * val;
}

// thin the ellipsoid from the side (scale x)
function squish_x_curve(cloud_pos) {

}

// make the banana shape by "punching" it from the z axis
function squish_z_curve(cloud_pos) {

}

// random rotation 
function rotate_curve() {

}

const cloud_a = generate_clouds(cloud_num, max_rad);
const squish_a = generate_squish(cloud_a);