const vert_shade = `
varying vec4 vUv; 

varying vec4 new_vox_pos;
varying vec4 new_x;
varying vec4 new_y;
varying vec4 new_z;
varying mat4 cameraInverse;

uniform vec3 vox_pos;
uniform float box_dim;

void main() {

    // vUv = vec4(position, 1.0);
    
    vec3 vox_x = vox_pos + vec3(box_dim/2.0, 0.0, 0.0);
    vec3 vox_y = vox_pos + vec3(0.0, box_dim/2.0, 0.0);
    vec3 vox_z = vox_pos + vec3(0.0, 0.0, box_dim/2.0);
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    
    // new_vox_pos = vec4(-box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0);
    // new_x = vec4(box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0);
    // new_y = vec4(-box_dim/2.0, box_dim/2.0, -box_dim/2.0, 1.0);
    // new_z = vec4(-box_dim/2.0, -box_dim/2.0, box_dim/2.0, 1.0);

    new_vox_pos = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0));
    new_x = projectionMatrix * (modelViewMatrix * vec4(box_dim/2.0, -box_dim/2.0, -box_dim/2.0, 1.0));
    new_y = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, box_dim/2.0, -box_dim/2.0, 1.0));
    new_z = projectionMatrix * (modelViewMatrix * vec4(-box_dim/2.0, -box_dim/2.0, box_dim/2.0, 1.0));
    
    vUv = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
    cameraInverse = inverse(projectionMatrix);
    gl_Position = projectionMatrix * modelViewPosition;  
}
`;

// 

const frag_shade = `
uniform vec3 vox_pos;
uniform vec3 sphere_centre;
uniform int sphere_radius;
uniform float box_dim;

varying vec4 vUv;
varying vec4 new_vox_pos;
varying vec4 new_x;
varying vec4 new_y;
varying vec4 new_z;
varying mat4 cameraInverse;

bool is_inside_vox(in vec3 pos) {
    float scalar_comp_x = dot(pos - new_vox_pos.xyz, normalize(new_x.xyz - new_vox_pos.xyz));
    float scalar_comp_y = dot(pos - new_vox_pos.xyz, normalize(new_y.xyz - new_vox_pos.xyz));
    float scalar_comp_z = dot(pos - new_vox_pos.xyz, normalize(new_z.xyz - new_vox_pos.xyz));
    return ((scalar_comp_x > 0.0) && (scalar_comp_x < 1.0) && (scalar_comp_y > 0.0) && (scalar_comp_y < 1.0) && (scalar_comp_z > 0.0) && (scalar_comp_z < 1.0));
}

vec3 scalar_val(in vec3 pos) {
    float scalar_comp_x = dot(pos - new_vox_pos.xyz, normalize(new_x.xyz - new_vox_pos.xyz));
    float scalar_comp_y = dot(pos - new_vox_pos.xyz, normalize(new_y.xyz - new_vox_pos.xyz));
    float scalar_comp_z = dot(pos - new_vox_pos.xyz, normalize(new_z.xyz - new_vox_pos.xyz));
    return vec3(scalar_comp_x, scalar_comp_y,scalar_comp_z);
}

float sample_value(in vec3 pos) {
    return 1.0;
}

void main() {
    float step_size = 0.01;
    vec3 cur_pos = vUv.xyz;
    vec3 camera_pos = vec3(0.0,0.0,5.0);
    vec3 step_dir = normalize(cur_pos);
    int max_steps = int(box_dim/step_size);
    float count = 0.0;
    
    float cummulative_value = 0.0;

    for (int i = 0; i < 500; i += 1) {
        cummulative_value += 0.1;
        cur_pos = cur_pos + step_dir*step_size;
        if (!is_inside_vox(cur_pos)) {
            break;
        }
        count += 1.0;
    }
    
    // if (length(vUv.xyz - new_vox_pos.xyz) < 0.01) {
    //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // } else if (length(vUv.xyz - new_x.xyz) < 0.01) {
    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // } else if (length(vUv.xyz - new_y.xyz) < 0.01) {
    //     gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    // } else if (length(vUv.xyz - new_z.xyz) < 0.01) {
    //     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    // } else {
    //     if (scalar_val(vUv.xyz).x > 1.0) {
    //         gl_FragColor = vec4(1.0, 0.0, 0.0, 0.2);
    //     } else if (scalar_val(vUv.xyz).y > 1.0) {
    //         gl_FragColor = vec4(0.0, 1.0, 0.0, 0.2);
    //     } else if (scalar_val(vUv.xyz).z > 1.0) {
    //         gl_FragColor = vec4(0.0, 0.0, 1.0, 0.2);
    //     } else if (scalar_val(vUv.xyz).x < 0.0) {
    //         gl_FragColor = vec4(1.0, 0.0, 1.0, 0.2);
    //     } else if (scalar_val(vUv.xyz).y < 0.0) {
    //         gl_FragColor = vec4(1.0, 1.0, 0.0, 0.2);
    //     } else if (scalar_val(vUv.xyz).z < 0.0) {
    //         gl_FragColor = vec4( 0.0, 1.0, 1.0, 0.2);
    //     } else {
    //         gl_FragColor = vec4(scalar_val(vUv.xyz), 0.2);
    //     }


           
        gl_FragColor = vec4((cameraInverse * vUv).xyz, 1.0);
    // }

     
}`;

// general sampling function: while loop which cumulates the final opacity
// general colour function for a single sample point (will eventually call mulitple functions)
// test the inclusion of a point inside the cube

// for (int j = 0; j < 10; j+= 1) {
//     cummulative_value += 0.1;
//     cur_pos = cur_pos + step_dir*step_size;
// }


//#define GLSLIFY 1

//precision highp float;\n\n#define EPS 0.000001
// 32 48 64 96 128
//#define MAX_STEPS 256
// http://jsfiddle.net/greggman/gSnHZ/



//vec2 computeSliceOffset_1_0(float slice, float slicesPerRow, vec2 sliceSize) {
//    return sliceSize * vec2(mod(slice, slicesPerRow), floor(slice / slicesPerRow));
//}



//vec4 sampleAs3DTexture_1_1(sampler2D tex, vec3 texCoord, float size, float slicesPerRow) {
//    float numRows = floor((size + slicesPerRow - 1.0) / slicesPerRow);
//    float slice = texCoord.z * size;
//    float sliceZ = floor(slice);                         // slice we need
//    float zOffset = fract(slice);                         // dist between slices

//    vec2 sliceSize = vec2(1.0 / slicesPerRow, 1.0 / numRows);                 // v space of 1 slice
//    vec2 slice0Offset = computeSliceOffset_1_0(sliceZ, slicesPerRow, sliceSize);
//    vec2 slice1Offset = computeSliceOffset_1_0(sliceZ + 1.0, slicesPerRow, sliceSize);
//    vec2 slicePixelSize = sliceSize / size;               // space of 1 pixel
//    vec2 sliceInnerSize = slicePixelSize * (size - 1.0);  // space of size pixels
//    vec2 uv = slicePixelSize * 0.5 + texCoord.xy * sliceInnerSize;
//    vec4 slice0Color = texture2D(tex, slice0Offset + uv);
//    vec4 slice1Color = texture2D(tex, slice1Offset + uv);

//    return mix(slice0Color, slice1Color, zOffset);
//}



//varying vec3 vPos;
//varying vec3 vNormal;
//uniform float uLightIntensity;
//uniform vec3 uCamPos;
//uniform vec3 uLightPos;
//uniform vec3 uColor;
//uniform sampler2D textureCells;   // 3D(2D) volume texture
//uniform mat4 uInvertedWorld;
//float maxDistance;
//float stepDistance;


//float getBrightness(vec3 ro, vec3 rd) {
//    vec3 stepVector = rd * stepDistance;
//    vec3 pos = ro + stepVector;
//    vec3 volumePos;
//    float brightness = 1.0;

//    for (int i = 0; i < MAX_STEPS; ++i) {
//        pos += stepVector;
//        volumePos = (uInvertedWorld * vec4(pos, 1.0)).xyz + 0.5;
//        if(\n            volumePos.x > 1.0 + EPS || volumePos.x < -EPS ||\n            volumePos.y > 1.0 + EPS || volumePos.y < -EPS ||\n            volumePos.z > 1.0 + EPS || volumePos.z < -EPS) {\n            break;\n        }\n\n        brightness *= 1.0 - length(pos - ro) * (step(0.5, sampleAs3DTexture_1_1(textureCells, volumePos, 128.0, 16.0).r));\n\n        if( brightness < 0.1) {\n            break;\n        }\n    }\n    return brightness;\n}\n\nvec4 doModel(vec3 ro, vec3 rd) {\n    vec3 stepVector = rd * stepDistance;\n    vec3 pos = ro;\n    vec3 volumePos;\n\n    float den = 0.0;\n    vec3 color = vec3(0.0);\n\n    for (int i = 0; i < MAX_STEPS; ++i) {\n\n        pos += stepVector;\n\n        volumePos = (uInvertedWorld * vec4(pos, 1.0)).xyz + 0.5;\n\n        if(\n            volumePos.x > 1.0 + EPS || volumePos.x < -EPS ||\n            volumePos.y > 1.0 + EPS || volumePos.y < -EPS ||\n            volumePos.z > 1.0 + EPS || volumePos.z < -EPS) {\n            break;\n        }\n\n        den = sampleAs3DTexture_1_1(textureCells, volumePos, 128.0, 16.0).r;\n\n        // color = max(color, den);\n        // if(color > 1.0 - EPS) {\n        //   break;\n        // }\n\n        // multiply\n        // color = (1.0 - color) * den + color;\n\n        if(den > 0.5) {\n            // trace back to the light source\n            float brightness = getBrightness(pos, normalize(uLightPos - pos));\n            color = uColor * (0.6 + brightness * 0.4) + pow(brightness, 5.0) * uLightIntensity;\n            break;\n        }\n\n        // if (den > 0.5) break;\n    }\n\n    return vec4(color * (1.0 - pow(length(pos - ro) / maxDistance, 0.75)), step(0.5, den));\n    // return vec4(color);\n}\n\nvoid main() {\n\n    vec3 ro = vPos;\n    vec3 rd = normalize( ro - cameraPosition );\n\n    maxDistance = length(vec3(1.0));\n    stepDistance = maxDistance / float(MAX_STEPS);\n\n    gl_FragColor = doModel(ro, rd);\n\n}\n"