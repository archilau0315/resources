"""矢量化工件图标：24px PNG 放大后用 vtracer 转 SVG，任意缩放都清晰。

用法：
    python tools/vectorize_icons.py            # 全部
    python tools/vectorize_icons.py hb-room    # 只处理名称含关键字的图标
"""
import os
import sys
import tempfile

from PIL import Image
import vtracer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'icons', '24')
DST = os.path.join(ROOT, 'assets', 'icons', 'svg')
SCALE = 4  # 24 -> 96，先整数放大再矢量化，保留原始像素结构

# vtracer 的参数只能按位置传（关键字参数在当前 wheel 上会崩溃）
ARGS = ('color', 'stacked', 'spline', 8, 6, 40, 60, 2.0, 10, 45, 1)


def add_viewbox(path):
    """补 viewBox，保证任意尺寸缩放都按矢量重绘（否则缩小会被裁切）。"""
    with open(path, encoding='utf-8') as f:
        s = f.read()
    if 'viewBox' in s:
        return
    s = s.replace('<svg ', '<svg viewBox="0 0 %d %d" ' % (96, 96), 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(s)


def vectorize(src_path, dst_path):
    im = Image.open(src_path).convert('RGBA')
    big = im.resize((im.width * SCALE, im.height * SCALE), Image.NEAREST)
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    tmp.close()
    try:
        big.save(tmp.name)
        vtracer.convert_image_to_svg_py(tmp.name, dst_path, *ARGS)
        add_viewbox(dst_path)
    finally:
        os.unlink(tmp.name)


def main():
    os.makedirs(DST, exist_ok=True)
    names = sorted(f for f in os.listdir(SRC) if f.endswith('.png'))
    if len(sys.argv) > 1:
        names = [n for n in names if any(k in n for k in sys.argv[1:])]
    fail, total = 0, 0
    for n in names:
        dst = os.path.join(DST, n[:-4] + '.svg')
        try:
            vectorize(os.path.join(SRC, n), dst)
            total += os.path.getsize(dst)
        except Exception as e:  # noqa: BLE001
            fail += 1
            print('FAIL', n, e)
    print('svg', len(names) - fail, 'failed', fail, 'avg KB', round(total / 1024 / max(1, len(names) - fail), 1))


if __name__ == '__main__':
    main()
