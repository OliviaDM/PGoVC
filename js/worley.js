// cut_offs = [50, 107, 164, 207, 233, 246, 252, 254, 255]

// neighbourgs1 = []
// neighbourgs2 = []
// for i in range(5):
//     for j in range(5):
//         for k in range(5):
//             x = i - 2
//             y = j - 2
//             z = k - 2

//             if not ((abs(x) == 2 and abs(y) == 2) or (abs(x) == 2 and abs(z) == 2) or (abs(z) == 2 and abs(y) == 2)):
//                 if abs(x) == 2 or abs(y) == 2 or abs(z) == 2:
//                     neighbourgs2.append((x, y, z))
//                 else:
//                     neighbourgs1.append((x, y, z))


// def hash(xi, yi, zi, seed):
//     return perm[ (perm[ (perm[ (xi + seed) % 256 ]+ yi) % 256 ]+ zi) % 256 ]


// def number_of_points(xi, yi, zi):
//     h = hash(xi, yi, zi, 0)
//     return [i for i, x in enumerate(cut_offs) if x >= h][0] + 1, h


// def cube_points(xi, yi, zi):
//     n, h = number_of_points(xi, yi, zi)
//     points = []

//     for i in range(n):
//         point_coords = []

//         h = hash(xi, yi, zi, h)
//         point_coords.append(xi + h/255)
//         h = hash(xi, yi, zi, h)
//         point_coords.append(yi + h/255)
//         h = hash(xi, yi, zi, h)
//         point_coords.append(zi + h/255)

//         points.append(point_coords)

//     return points


// def closest_in_cube(x, y, z, pts_arr):
//     closest_dist = 0
//     closest_pt = None

//     for pt in pts_arr:
//         dist = math.sqrt((x-pt[0])**2 + (y-pt[1])**2 + (z-pt[2])**2)
//         if dist < closest_dist or closest_pt == None:
//             closest_dist = dist
//             closest_pt = pt

//     return closest_pt, closest_dist

    

// def cycle_cubes(x, y, z):

//     xi = math.floor(x)
//     yi = math.floor(y)
//     zi = math.floor(z)

//     closest_dist = 0
//     closest_pt = None

//     for n in neighbourgs1:
//         xj = xi + n[0]
//         yj = yi + n[1]
//         zj = zi + n[2]

//         if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
//             pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
//             if dist < closest_dist or closest_pt == None:
//                 closest_dist = dist
//                 closest_pt = pt

//     if closest_dist > 1:
//         for n in neighbourgs2:
//             xj = xi + n[0]
//             yj = yi + n[1]
//             zj = zi + n[2]

//             if xj >= 0 and yj >= 0 and zj >= 0 and xj < 256 and yj < 256 and zj < 256:
//                 pt, dist = closest_in_cube(x, y, z, cube_points(xj, yj, zj))
//                 if dist < closest_dist or closest_pt == None:
//                     closest_dist = dist
//                     closest_pt = pt

//     return closest_dist

    




// def worley(x, y, z):

//     w = cycle_cubes(x, y, z)
//     if w > 1:
//         w = 1
//     return w * 255
    


// im = Image.new('L', (700, 700))
// pixdata = []
// # for k in range (0, 700):
// for i in range (0, 700):
//     for j in range (0,700):
//         w1 = worley(20*i/700, 20*j/700, 0)
//         w2 = worley(5*i/700, 5*j/700, 0)
//         pixdata.append((4*w2 + 1*w1)/5)
//         print(i, j)
// im.putdata(pixdata)
// im.save('test.png')