"""矢量化组件图标：透明感知放大 + 实色调色板 + 高倍多边形描摹。

原图只有 24×24，且边缘是半透明抗锯齿、透明区 RGB 为 0（黑）。旧流程直接
`convert('RGB')` 取调色板，会把黑色和混合色当成图标颜色，描摹后每条边都
多一圈浑浊过渡色，放大看就是“发虚、水泡”。这里改为：

1. 先把 RGBA 预乘 alpha 再放大，避免透明黑渗进颜色；
2. 调色板只从 alpha>200 的实色像素提取，颜色保持纯净；
3. 以 12 倍（288×288）二值轮廓做 polygon 描摹，边缘全为直线段、无曲线外鼓，
   1 个画布单位≈0.39 显示像素，阶梯远小于像素。

用法：
    python tools/vectorize_icons.py            # 全部
    python tools/vectorize_icons.py hb-room    # 只处理名称含关键字的图标
"""
import os
import sys
import tempfile

import numpy as np
import vtracer
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'icons', '24')
DST = os.path.join(ROOT, 'assets', 'icons', 'svg')
SCALE = 12       # 24 -> 288
PALETTE = 12     # 实色区域保留的配色数
ALPHA_CUT = 128  # 轮廓阈值（0.5 覆盖率）
ALPHA_GAMMA = 0.85  # 轻推阈值外扩，保住原图细线的墨量，避免细线发灰

# vtracer 只接受位置参数：
# colormode, hierarchical, mode, filter_speckle, color_precision, layer_difference,
# corner_threshold, length_threshold, max_iterations, splice_threshold, path_precision
ARGS = ('color', 'cutout', 'polygon', 6, 8, 16, 60, 2.0, 10, 45, 2)


def _resize_f(arr, size):
    im = Image.fromarray(arr.astype(np.float32), mode='F')
    return np.asarray(im.resize(size, Image.LANCZOS), dtype=np.float32)


def prepare(src_path):
    im = Image.open(src_path).convert('RGBA')
    px = np.asarray(im, dtype=np.float32) / 255.0
    rgb, alpha = px[..., :3], px[..., 3]
    size = (im.width * SCALE, im.height * SCALE)
    # 预乘 alpha 后再放大，边缘颜色不会被透明黑拖暗
    pm = rgb * alpha[..., None]
    pm_b = np.stack([_resize_f(pm[..., i], size) for i in range(3)], -1)
    a_b = np.clip(_resize_f(alpha, size), 0, 1)
    rgb_b = np.clip(np.where(a_b[..., None] > 0.004,
                             pm_b / np.maximum(a_b[..., None], 1e-6), 0), 0, 1)
    big = Image.fromarray(
        (np.concatenate([rgb_b, a_b[..., None]], -1) * 255).round().astype(np.uint8), 'RGBA')

    # 调色板只看实色像素，排除透明区与抗锯齿混合色
    src_px = np.asarray(im)
    solid = src_px[src_px[..., 3] > 200][:, :3]
    pal = Image.fromarray(solid.reshape(-1, 1, 3), 'RGB').quantize(colors=PALETTE)
    q = big.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    mask = big.getchannel('A').point(lambda v: int(255 * ((v / 255.0) ** ALPHA_GAMMA)))
    q.putalpha(mask.point(lambda v: 255 if v > ALPHA_CUT else 0))
    return q


def add_viewbox(path, size):
    """补 viewBox，保证任意尺寸缩放都按矢量重绘。"""
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
    fail, total, biggest = 0, 0, 0
    for n in names:
        dst = os.path.join(DST, n[:-4] + '.svg')
        try:
            vectorize(os.path.join(SRC, n), dst)
            size = os.path.getsize(dst)
            total += size
            biggest = max(biggest, size)
        except Exception as e:  # noqa: BLE001
            fail += 1
            print('FAIL', n, e)
    done = max(1, len(names) - fail)
    print('svg', len(names) - fail, 'failed', fail,
          'avg KB', round(total / 1024 / done, 1), 'max KB', round(biggest / 1024, 1))


if __name__ == '__main__':
    main()
