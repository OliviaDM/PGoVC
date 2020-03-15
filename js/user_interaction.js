//USER INTERACTION
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
    // evt.preventDefault();
    // if (cur_scene === scene) {
    //     cur_scene = back_scene;
    // } else {
    //     cur_scene = scene;
    // }
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