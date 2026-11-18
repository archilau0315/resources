import io
import os

import resvg_py
import vtracer
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'brand', 'honeybee-src.png')
DST = os.path.join(ROOT, 'assets', 'brand', 'honeybee.svg')

im = Image.open(SRC).convert('RGBA')
w, h = im.size
vtracer.convert_image_to_svg_py(SRC, DST, 'color', 'stacked', 'spline', 4, 8, 16, 60, 1.0, 10, 45, 1)
s = io.open(DST, encoding='utf-8').read()
if 'viewBox' not in s:
    s = s.replace('<svg ', '<svg viewBox="0 0 %d %d" ' % (w, h), 1)
    io.open(DST, 'w', encoding='utf-8').write(s)
print('svg KB', round(os.path.getsize(DST) / 1024, 1), 'viewBox', 'viewBox' in s)

for size in (180, 32):
    png = resvg_py.svg_to_bytes(svg_path=DST, width=size, height=size)
    out = os.path.join(ROOT, 'assets', 'brand', 'honeybee-%d.png' % size)
    io.open(out, 'wb').write(bytes(png))
    print(out, os.path.getsize(out))
