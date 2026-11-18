"""矢量化组件图标：24px 原图 8 倍 LANCZOS 放大 + 调色板还原 + 平滑描摹。

原图只有 24×24 像素，直接描摹会把 4px 的阶梯原样变成矢量折线，放大后仍然
一格一格。这里先把图放大 8 倍（192×192）并用原图调色板量化，把抗锯齿边缘
还原成原色，再描摹；此时 1 个画布单位≈0.6 屏幕像素，阶梯远小于显示像素。

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
SCALE = 6        # 24 -> 144
PALETTE = 8      # 保留原图配色数量
ALPHA_CUT = 110  # 透明边界阈值

# vtracer 参数只能按位置传（关键字参数在当前 wheel 上会崩溃）
# colormode, hierarchical, mode, filter_speckle, color_precision, layer_difference,
# corner_threshold, length_threshold, max_iterations, splice_threshold, path_precision
ARGS = ('color', 'stacked', 'spline', 8, 5, 24, 60, 2.0, 10, 45, 1)


def prepare(src_path):
    im = Image.open(src_path).convert('RGBA')
    pal = im.convert('RGB').quantize(colors=PALETTE)
    big = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
    q = big.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    mask = big.getchannel('A').point(lambda v: 255 if v > ALPHA_CUT else 0)
    q.putalpha(mask)
    return q


def add_viewbox(path, size):
    """补 viewBox，保证任意尺寸缩放都按矢量重绘（否则缩小会被裁切）。"""
    with open(path, encoding='utf-8') as f:
        s = f.read()
    if 'viewBox' in s:
        return
    s = s.replace('<svg ', '<svg viewBox="0 0 %d %d" ' % (size, size), 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(s)


def vectorize(src_path, dst_path):
    big = prepare(src_path)
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    tmp.close()
    try:
        big.save(tmp.name)
        vtracer.convert_image_to_svg_py(tmp.name, dst_path, *ARGS)
        add_viewbox(dst_path, big.width)
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
    done = max(1, len(names) - fail)
    print('svg', len(names) - fail, 'failed', fail, 'avg KB', round(total / 1024 / done, 1))


if __name__ == '__main__':
    main()
