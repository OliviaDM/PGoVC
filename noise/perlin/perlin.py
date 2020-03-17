from PIL import Image
import math



# PERLIN FUNCTIONS
perm = [151,160,137,91,90,15, 131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33, 88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166, 77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244, 102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196, 135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123, 5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42, 223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9, 129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228, 251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107, 49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254, 138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]


def hash(xi, yi, zi):
    return perm[ (perm[ (perm[ xi ]+ yi) % 256 ]+ zi) % 256 ]


def fade(t):
    return -t * t * t * (t * (t * 6 + 15) + 10)


def grad(hash, x, y, z):
    h = hash >> 4

    u = x if h < 8 else y
    if h < 4:
        v = y
    elif (h == 12) or (h == 14):
        v = x
    else:
        v = z

    return (u if (h & 1) == 0 else -u) + (v if (h & 2) == 0 else -v)

def lerp(a, b, x):
    return a + x * (b - a)


def perlin(x, y, z):

    xi = math.floor(x)
    yi = math.floor(y)
    zi = math.floor(z)
    xf = xi - x
    yf = yi - y
    zf = zi - z

    u = fade(xf)
    v = fade(yf)
    w = fade(zf)

    aaa = hash(xi, yi, zi)
    aba = hash(xi, (yi + 1) % 256, zi)
    aab = hash(xi, yi, (zi + 1) % 256)
    abb = hash(xi, (yi + 1) % 256, (zi + 1) % 256)
    baa = hash((xi + 1) % 256, yi, zi)
    bba = hash((xi + 1) % 256, (yi + 1) % 256, zi)
    bab = hash((xi + 1) % 256, yi, (zi + 1) % 256)
    bbb = hash((xi + 1) % 256, (yi + 1) % 256, (zi + 1) % 256)

    x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf+1, yf, zf), u)
    x2 = lerp(grad(aba, xf, yf+1, zf), grad(bba, xf+1, yf+1, zf), u)
    y1 = lerp(x1, x2, v)

    x1 = lerp(grad(aab, xf, yf, zf+1), grad(bab, xf+1, yf, zf+1), u)
    x2 = lerp(grad(abb, xf, yf+1, zf+1), grad(bbb, xf+1, yf+1, zf+1), u)
    y2 = lerp(x1, x2, v)
        
    return (lerp(y1, y2, w)+1)/2



im = Image.new('L', (700, 700))
pixdata = []
# for k in range (0, 700):
for i in range (0, 700):
    for j in range (0,700):
        small_p = perlin(255*float(i)/700, 255*float(j)/700, 0)*255
        medium_p = perlin(70*float(i)/700, 70*float(j)/700,0)*255
        big_p = perlin(20*float(i)/700, 20*float(j)/700,0)*255

        pixdata.append((small_p + big_p*4 + medium_p*3)/8)
        print(i, j)
im.putdata(pixdata)
im.save('test.png')
# print(pixdata)