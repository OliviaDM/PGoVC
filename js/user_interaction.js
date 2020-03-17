//USER INTERACTION
let scenes = [];
let index = 0;
let m_loc = null;
let cur_prog;
let cull = true;

let mouseDown = false,
    mouseX = 0,
    mouseY = 0;

const sub_butt = document.getElementById("sub_butt");

const stp = document.getElementById("steps");
const rad = document.getElementById("radius");
const cnb = document.getElementById("s_numb");

const p1 = document.getElementById("p1_bool");
const p1_c = document.getElementById("p1_coeff");
const p1_s = document.getElementById("p1_scale");
const p2 = document.getElementById("p2_bool");
const p2_c = document.getElementById("p2_coeff");
const p2_s = document.getElementById("p2_scale");
const p3 = document.getElementById("p3_bool");
const p3_c = document.getElementById("p3_coeff");
const p3_s = document.getElementById("p3_scale");

function onMouseMove(evt) {
    if (!mouseDown) {
        return;
    }

    evt.preventDefault();
    let deltaX = evt.clientX - mouseX,
        deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;
}

// let cur_scene = scene;

function switchScene(evt) {
    evt.preventDefault();
    index = (index + 1) % scenes.length;
    cur_prog = scenes[index][0];
    m_loc = scenes[index][1];
    cull = scenes[index][2];
}

function rotateScene(deltaX, deltaY) {
    matrix = m4.xRotate(matrix, deltaX / 100);
    matrix = m4.yRotate(matrix, deltaY / 100);
}

function submitInput(evt, gl, pb, vao) {
    evt.preventDefault();

    sample_step = 1/parseInt(stp.value, 10);
    max_rad = 1/parseInt(rad.value, 10);
    cloud_num = parseInt(cnb.value, 10);
    console.log(p3);

    perl_1 = [p1.checked, p1_s.value, parseInt(p1_c.value)];
    perl_2 = [p2.checked, p2_s.value, parseInt(p2_c.value)];
    perl_3 = [p3.checked, p3_s.value, parseInt(p3_c.value)];


    const p = prog(gl, pb, vao);
    scenes[0] = [p[0], p[1], true];
    cur_prog = p[0];
    m_loc = p[1];
    cull = true;


    // console.log(typeof parseInt(stp.value, 10));
}

function evSetUp(canvas, gl, pb, vao) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
    canvas.addEventListener('contextmenu', function (e) {
        switchScene(e);
    }, false);
    sub_butt.addEventListener('click', function (e) {
        submitInput(e, gl, pb, vao);
    })
}