//USER INTERACTION
let scenes = [];
let index = 0;
let m_loc = null;
let cur_prog;
let cull = true;

let mouseDown = false,
    mouseX = 0,
    mouseY = 0;

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


function evSetUp(canvas) {
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
}

function rotateScene(deltaX, deltaY) {
    matrix = m4.xRotate(matrix, deltaX / 100);
    matrix = m4.yRotate(matrix, deltaY / 100);
}