from PIL import Image

perlin_img = Image.open('perlin\perlin_s_m3_b4_amplitude1.png', "r")
worley_img = Image.open('worley\\test.png', "r")

lay_im = Image.new('L', (700, 700))

pixeldata = []

for i in range(700):
    for j in range(700):
        p = perlin_img.getpixel((i, j))
        w = 255 - worley_img.getpixel((i, j))
        px = ((p + 4*w)/5)/255

        if px < 0.5:
            px = 2 * px**2
        if px > 0.5:
            px = 1 - (((1 - px)**2) * 2)

        pixeldata.append(px*255)
        print(i, j, px*255)
lay_im.putdata(pixeldata)
lay_im.save('layer_dark_contrasted.png')