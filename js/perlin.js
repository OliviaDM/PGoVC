let perl_1 = [true, 100.0, 1];
let perl_2 = [true, 35.0, 3];
let perl_3 = [true, 10.0, 4];

function perl_sum() {
    let sum = "";
    let coeff_sum = 0;

    if (perl_1[0]) {
        sum = sum + `perl_total += ${perl_1[2]}.0 * perlin_noise(pos, ${perl_1[1]}.0); \n`;  // 97
        coeff_sum += perl_1[2];
    }
    if (perl_2[0]) {
        sum = sum + `perl_total += ${perl_2[2]}.0 * perlin_noise(pos, ${perl_2[1]}.0); \n`;  // 98
        coeff_sum += perl_2[2];
    }
    if (perl_3[0]) {
        sum = sum + `perl_total += ${perl_3[2]}.0 * perlin_noise(pos, ${perl_3[1]}.0); \n`;   // 99 
        coeff_sum += perl_3[2];
    }

    if (coeff_sum != 0) {
        sum = sum + `perl_total = perl_total / ${coeff_sum}.0;\n`   // 100
    }

    return sum;
}


function perlin() { 
    return `uniform int p_perm[256];  // 10

    int hash(int xi, int yi, int zi) {
        return p_perm[ (p_perm[ (p_perm[ xi ]+ yi) % 256 ]+ zi) % 256 ];
    }

    float fade(float t) {
        return -t * t * t * (t * (t * 6.0 + 15.0) + 10.0);
    }

    float grad(int hash, float x, float y, float z) {   // 20
        
        float u = -y;
        if (hash < 128) { 
            u = -x; 
        }

        float v = -z;
        if (hash < 64) {
            v = -y;
        } else if ((hash >= 192 && hash < 208) || (hash >= 224 && hash < 240)) {    // 30
            v = -x;
        }

        if (hash >= 128) {
            hash -= 128;
        }
        if (hash >= 64) {
            hash -= 64;
        }
        if (hash >= 32) {   // 40
            u = -u;
            hash -= 32;
        }
        if (hash >= 16) {
            v = -v;
        }

        return u + v;
    }
     // 50
    float lerp(float a, float b, float x) {
        return a + x * (b - a);
    }


    float perlin_noise(vec3 pos, float scale) {

        float x = pos.x * scale;
        float y = pos.y * scale;
        float z = pos.z * scale;   // 60

        int xi = int(floor(x));
        int yi = int(floor(y));
        int zi = int(floor(z));
        float xf = floor(x) - x;
        float yf = floor(y) - y;
        float zf = floor(z) - z;

        float u = fade(xf);
        float v = fade(yf);    // 70
        float w = fade(zf);

        int aaa = hash(xi, yi, zi);
        int aba = hash(xi, (yi + 1) % 256, zi);
        int aab = hash(xi, yi, (zi + 1) % 256);
        int abb = hash(xi, (yi + 1) % 256, (zi + 1) % 256);
        int baa = hash((xi + 1) % 256, yi, zi);
        int bba = hash((xi + 1) % 256, (yi + 1) % 256, zi);
        int bab = hash((xi + 1) % 256, yi, (zi + 1) % 256);
        int bbb = hash((xi + 1) % 256, (yi + 1) % 256, (zi + 1) % 256);    // 80

        float x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf+1.0, yf, zf), u);
        float x2 = lerp(grad(aba, xf, yf+1.0, zf), grad(bba, xf+1.0, yf+1.0, zf), u);
        float y1 = lerp(x1, x2, v);

        x1 = lerp(grad(aab, xf, yf, zf+1.0), grad(bab, xf+1.0, yf, zf+1.0), u);
        x2 = lerp(grad(abb, xf, yf+1.0, zf+1.0), grad(bbb, xf+1.0, yf+1.0, zf+1.0), u);
        float y2 = lerp(x1, x2, v);
            
        return (lerp(y1, y2, w)+1.0)/2.0;    // 90
    }

    float layered_perlin(vec3 pos) {

        float perl_total = 0.0;

        ${perl_sum()}    // 97 - 100

        return perl_total;
    }   // 108`;
}