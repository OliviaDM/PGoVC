from PIL import Image
import math

perm = [151,160,137,91,90,15, 131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33, 88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166, 77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244, 102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196, 135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123, 5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42, 223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9, 129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228, 251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107, 49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254, 138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]

cut_offs = [50, 107, 164, 207, 233, 246, 252, 254, 255]

neighbourgs1 = []
neighbourgs2 = []
for i in range(5):
    for j in range(5):
        for k in range(5):
            x = i - 2
            y = j - 2
            z = k - 2

            if not ((abs(x) == 2 and abs(y) == 2) or (abs(x) == 2 and abs(z) == 2) or (abs(z) == 2 and abs(y) == 2)):
                if abs(x) == 2 or abs(y) == 2 or abs(z) == 2:
                    neighbourgs2.append((x, y, z))
                else:
                    neighbourgs1.append((x, y, z))


def hash(xi, yi, zi, seed):
    return perm[ (perm[ (perm[ (xi + seed) % 256 ]+ yi) % 256 ]+ zi) % 256 ]


def number_of_points(xi, yi, zi):
    h = hash(xi, yi, zi, 0)
    return [i for i, x in enumerate(cut_offs) if x >= h][0] + 1, h


def cube_points(xi, yi, zi):
    n, h = number_of_points(xi, yi, zi)
    points = []

    for i in range(n):
        point_coords = []

        h = hash(xi, yi, zi, h)
        point_coords.append(xi + h/255)
        h = hash(xi, yi, zi, h)
        point_coords.append(yi + h/255)
        h = hash(xi, yi, zi, h)
        point_coords.append(zi + h/255)

        points.append(point_coords)

    return points


def closest_in_cube(x, y, z, pts_arr):
    closest_dist = 0
    closest_pt = None

    for pt in pts_arr:
        dist = math.sqrt((x-pt[0])**2 + (y-pt[1])**2 + (z-pt[2])**2)
        if dist < closest_dist or closest_pt == None:
            closest_dist = dist
            closest_pt = pt

    return closest_pt, closest_dist

    

def cycle_cubes(x, y, z):

    xi = math.floor(x)
    yi = math.floor(y)
    zi = math.floor(z)

    closest_dist = 0
    closest_pt = None

    for n in neighbourgs1:
        xj = xi + n[0]
        yj = yi + n[1]
        zj = zi + n[2]

        if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
            pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
            if dist < closest_dist or closest_pt == None:
                closest_dist = dist
                closest_pt = pt

    if closest_dist > 1:
        for n in neighbourgs2:
            xj = xi + n[0]
            yj = yi + n[1]
            zj = zi + n[2]

            if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
                pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
                if dist < closest_dist or closest_pt == None:
                    closest_dist = dist
                    closest_pt = pt

    return closest_dist

    




def worley(x, y, z):

    w = cycle_cubes(x, y, z)
    if w > 1:
        w = 1
    return w * 255
    


im = Image.new('L', (700, 700))
pixdata = []
# for k in range (0, 700):
for i in range (0, 700):
    for j in range (0,700):
        w1 = worley(20*i/700, 20*j/700, 0)
        w2 = worley(5*i/700, 5*j/700, 0)
        pixdata.append((4*w2 + 1*w1)/5)
        print(i, j)
im.putdata(pixdata)
im.save('test.png')
