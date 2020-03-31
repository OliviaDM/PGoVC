function main() {
    // WEBGL CONTEXT SET UP
    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }



    // GEOMETRY SET UP
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var vao = gl.createVertexArray();

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const f_b = createFrameBuffer(gl);
    const frameBuff = f_b[0];
    const back_text = f_b[1];
    
    
    
    // MAIN PROGRAM SET UP
    const p = prog(gl, positionBuffer, vao);
    const program = p[0];
    const matrixLocation = p[1];
    scenes.push([program, matrixLocation, true]);


    
    // FRONTPOS PROGRAM SET UP
    scenes.push(front_prog(gl, positionBuffer, vao));

    // BACKPOS PROGRAM SET UP
    scenes.push(back_prog(gl, positionBuffer, vao));
    back_program = scenes[1][0];
    back_matrixLocation = scenes[1][1];

    

    // SET UP THE CANVAS
    evSetUp(canvas, gl, positionBuffer, vao);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.cullFace(gl.FRONT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    


    // SET DEFAULT PROGRAM
    m_loc = matrixLocation;
    cur_prog = program;

    matrix = m4.scale(matrix, 0.5, 0.5, 0.5);



    // DRAW DRAW DRAW
    function drawScene() {

        // DRAW BACK POS TO FRAMEBUFFER
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuff);
        // gl.clearColor(91/255, 110/255, 133/255, 1);
        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        switchProg(back_program, back_matrixLocation, false);
        
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        
        
        // DRAW ACTUAL SCENE
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.clearColor(91/255, 110/255, 133/255, 1);
        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        switchProg(cur_prog, m_loc, cull);
    
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(drawScene);
        
    }
    
    function switchProg(pg, ml, cf) {
        gl.useProgram(pg);
        gl.uniformMatrix4fv(ml, false, matrix);
        cf ? gl.cullFace(gl.FRONT) : gl.cullFace(gl.BACK);
    }
    
    drawScene();
}