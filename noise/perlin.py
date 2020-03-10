import Image
im = Image.new('RGB', (1024, 1024))
im.putdata([(255, 0, 0), (0, 255, 0), (0, 0, 255)])
im.save('test.png')