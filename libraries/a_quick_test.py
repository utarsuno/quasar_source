from libraries.universal_code import useful_file_operations as ufo

from PIL import Image

t = '/Users/utarsuno/git_repos/quasar_source/generated_output/local/code_manager/ff.jpg'
t2 = '/Users/utarsuno/git_repos/quasar_source/generated_output/local/code_manager/pp0.png'

t3 = '/Users/utarsuno/git_repos/quasar_source/assets/texture/skybox/ff.jpg'

#im = Image.open(t).save(t.replace('jpg', 'webp'), 'webp', optimize=True, exif=bytes())
#im = Image.open(t).save(t.replace('jpg', 'webp'), 'webp', optimize=True, quality=80, method=6, lossless=False)
#im2 = Image.open(t2).convert('RGBA').save(t2.replace('png', 'webp'), 'webp', optimize=True, quality=80, method=6, lossless=False)


#im3 = Image.open(t3).save(optimize=True, quality=100, progressive=False)
#im3 = Image.open(t3).save(t3, 'jpg', optimize=True, quality=100, progressive=False)
#im3 = Image.open(t3).save(t3, 'jpeg', exif=bytes())


#im3 = Image.open(t3).save(t3, 'jpeg', exif=bytes(), optimize=True, progression=False)
im3 = Image.open(t3).save(t3.replace('jpg', 'webp'), 'webp', exif=bytes(), optimize=True, quality=80, method=6, lossless=False)


#258,091
#258,104

#236393

#165042
#165042

#176532

