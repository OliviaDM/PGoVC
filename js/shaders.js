//FRONT POSITION SHADERS 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const front_vert_shade = `#version 300 es
in vec4 a_position;

uniform mat4 m_matrix;

out vec4 v_pos;

void main() {

    gl_Position = m_matrix * a_position;
    v_pos = 0.5*a_position + (0.5, 0.5, 0.5, 0.5);

}`

const front_frag_shade = `#version 300 es
precision mediump float;

in vec4 v_pos;

out vec4 outColour;

void main() {

    outColour = v_pos;

}`

function front_prog(gl, positionBuffer, vao) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, front_vert_shade);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, front_frag_shade);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const posAttribLocation = gl.getAttribLocation(program, "a_position");
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLocation);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);

    const matrixLocation = gl.getUniformLocation(program, "m_matrix");

    return [program, matrixLocation, true];
}




//BACK POSITION SHADERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const back_vert_shade = `#version 300 es
in vec4 a_position;
in vec4 a_col;

uniform mat4 m_matrix;

out vec4 v_back_pos;
out vec4 v_col;

void main() {
    
    gl_Position = m_matrix * a_position;
    v_back_pos = 0.5*a_position + (0.5, 0.5, 0.5, 0.5); 
    v_col = a_col;

}`;

const back_frag_shade = `#version 300 es
precision mediump float;

in vec4 v_back_pos;
in vec4 v_col;

out vec4 outColour;

void main() {

    outColour = vec4(v_back_pos.xyz, 1);
    
}`;

function back_prog(gl, positionBuffer, vao) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, back_vert_shade);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, back_frag_shade);
    const back_program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(back_program);

    const posAttribLocation = gl.getAttribLocation(back_program, "a_position");
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLocation);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);

    const colAttribLocation = gl.getAttribLocation(back_program, "a_col");

    const colBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
    gl.enableVertexAttribArray(colAttribLocation);
    gl.vertexAttribPointer(colAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

    const matrixLocation = gl.getUniformLocation(back_program, "m_matrix");

    return [back_program, matrixLocation, false];
}





// MAIN PROGRAM SHADERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let sample_step = 0.02;
let perlin_worley = 5;


const vert_shade = `#version 300 es
in vec4 a_position;

uniform mat4 m_matrix;

out vec4 v_pos;

void main() {

    gl_Position = m_matrix * a_position;
    v_pos = 0.5*a_position + (0.5, 0.5, 0.5, 0.5);

}`




function frag_shade() { 
    return `#version 300 es  // 0
    precision mediump float;

    in vec4 v_pos;

    uniform sampler2D u_back_text;
    uniform vec4 u_clouds_pos[${cloud_num}];
    uniform float u_clouds_squish[${cloud_num}];

    out vec4 outColour;

    ${perlin()} // 10 - 108
    // 109
    ${worley()} // 110

    float layered_noise(vec3 pos) {
        float p = layered_perlin(pos);
        float w = layered_worley(pos);

        return ( ${10 - perlin_worley}.0 * p + ${perlin_worley}.0 * w)/10.0;
    }

    vec3 unsquish(int index, vec3 pos) {
        vec3 center = u_clouds_pos[index].xyz;
        float old_y = (pos.y - center.y) / u_clouds_squish[index];
        return vec3(pos.x, center.y + old_y, pos.z);
    }

    float cloud_density(int index, vec3 pos) {
        vec3 unsquished_pos = unsquish(index, pos);
        float rad = u_clouds_pos[index].w;
        vec3 center = u_clouds_pos[index].xyz;
        float val = ((rad - length(center - unsquished_pos)) / rad);
        return max(0.0, val);
    }

    float sample_clouds(vec3 pos) {
        float val = 0.0;
        for (int j = 0; j < ${cloud_num}; j++) {
            val += cloud_density(j, pos);
        }
        return min(val, 1.0);
    }

    void main() {

        float sample_step = ${sample_step};
        vec3 cur_pos = v_pos.xyz;
        vec4 back_pos = texture(u_back_text, vec2(gl_FragCoord.x / 700.0, gl_FragCoord.y / 700.0));
        vec3 step = sample_step * normalize(back_pos.xyz - v_pos.xyz);

        float alpha = 0.0;
        // vec3 first_cloud = vec3(-1.0, -1.0, -1.0);
        float max_dens = 0.0;
        
        for (int i = 0; i < int(1.0 / sample_step); i++) {
            float noise = 1.0;
            float cloud_dens = sample_clouds(cur_pos)*0.05;
            // if ((first_cloud == vec3(-1.0, -1.0, -1.0))&&(cloud_dens > 0.0)) {
            //     first_cloud = cur_pos;
            // }
            if ((cloud_dens > 0.0) && (cloud_dens < 1.0)) {
                noise = layered_noise(cur_pos);
            }
            alpha += cloud_dens * noise;
            cur_pos = cur_pos + step;
            if (length(v_pos.xyz - cur_pos) > length(v_pos.xyz - back_pos.xyz)) {
                break;
            }
        }

        if (alpha < 0.4) {
            alpha = alpha * alpha;
        }

        float squish = u_clouds_squish[0];

        // if (first_cloud != vec3(-1.0, -1.0, -1.0)){
        // }

        outColour = vec4(1.0, 1.0, 1.0, alpha);
        // outColour = vec4(layered_noise(cur_pos.xyz), layered_noise(cur_pos.xyz), layered_noise(cur_pos.xyz), 1.0);

    }`;
}

function prog(gl, positionBuffer, vao) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert_shade);
    console.log(frag_shade());
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_shade());
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const posAttribLocation = gl.getAttribLocation(program, "a_position");
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLocation);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);

    const matrixLocation = gl.getUniformLocation(program, "m_matrix");

    const textureLocation = gl.getUniformLocation(program, "u_back_text");
    gl.uniform1i(textureLocation, 0);

    const cloudLocation = gl.getUniformLocation(program, "u_clouds_pos");
    gl.uniform4fv(cloudLocation, cloud_a);

    const squishLocation = gl.getUniformLocation(program, "u_clouds_squish");
    gl.uniform1fv(squishLocation, squish_a);

    const permLocation = gl.getUniformLocation(program, "p_perm");
    gl.uniform1iv(permLocation, perm_1);
    
    const n1Location = gl.getUniformLocation(program, "u_n1");
    const n2Location = gl.getUniformLocation(program, "u_n2");
    gl.uniform3fv(n1Location, neighbourgs1);
    gl.uniform3fv(n2Location, neighbourgs2);

    const cOffLocation = gl.getUniformLocation(program, "u_cut_offs");
    gl.uniform1iv(cOffLocation, cut_offs);

    return [program, matrixLocation, true];
}
