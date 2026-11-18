"""矢量化组件图标：透明感知放大 + 实色调色板 + 高倍多边形描摹。

原图只有 24×24，且边缘是半透明抗锯齿、透明区 RGB 为 0（黑）。旧流程直接
`convert('RGB')` 取调色板，会把黑色和混合色当成图标颜色，描摹后每条边都
多一圈浑浊过渡色，放大看就是“发虚、水泡”。这里改为：

1. 先把 RGBA 预乘 alpha 再放大，避免透明黑渗进颜色；
2. 调色板只从完全不透明的实色像素提取，排除抗锯齿混合色；
3. 32 色 + 6 级层次差，保留原厂图标的渐变与高光，不被压成大片平色；
4. 以 12 倍（288×288）二值轮廓做 polygon 描摹，边缘全为直线段、无曲线外鼓，
   1 个画布单位≈0.39 显示像素，阶梯远小于像素；
5. 轮廓阈值取 50% alpha，不外扩，避免图标发胖、边缘呈水泡状；
6. 描摹后把所有填充色吸附回调色板，消除 vtracer 生成的近似色薄层，颜色交界变硬边。

用法：
    python tools/vectorize_icons.py            # 全部
    python tools/vectorize_icons.py hb-room    # 只处理名称含关键字的图标
"""
import os
import re
import sys
import tempfile

import numpy as np
import vtracer
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'icons', '24')
DST = os.path.join(ROOT, 'assets', 'icons', 'svg')
SCALE = 12       # 24 -> 288
PALETTE = 32     # 实色区域保留的配色数（原厂图标最多 22 色）
MERGE = 12       # 调色板内距离小于该值的近似色合并为一个，避免同色薄层
ALPHA_CUT = 128  # 轮廓阈值（50% 覆盖率，不内缩也不外扩）

# vtracer 只接受位置参数：
# colormode, hierarchical, mode, filter_speckle, color_precision, layer_difference,
# corner_threshold, length_threshold, max_iterations, splice_threshold, path_precision
ARGS = ('color', 'cutout', 'polygon', 2, 8, 6, 60, 2.0, 10, 45, 2)


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

    # 调色板只取完全不透明的实色像素，排除抗锯齿混合色；色数不足时放宽
    src_px = np.asarray(im)
    solid = src_px[src_px[..., 3] >= 255][:, :3]
    if len(solid) < PALETTE:
        solid = src_px[src_px[..., 3] > 200][:, :3]
    pal = Image.fromarray(solid.reshape(-1, 1, 3), 'RGB').quantize(colors=PALETTE)
    q = big.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    q.putalpha(big.getchannel('A').point(lambda v: 255 if v > ALPHA_CUT else 0))

    # 直接统计不透明像素的实际颜色，避免调色板索引不连续导致取错色
    rgba = np.asarray(q)
    solid_px = rgba[..., :3][rgba[..., 3] > 0]
    uniq, counts = np.unique(solid_px, axis=0, return_counts=True)
    # 按出现次数保留主色，距离过近的近似色直接合并
    keep = []
    for i in np.argsort(-counts):
        c = uniq[i].astype(np.int32)
        if all(int(((c - k) ** 2).sum()) > MERGE * MERGE for k in keep):
            keep.append(c)
    return q, np.array(keep, dtype=np.int32)


def snap_fills(text, colors):
    """把 vtracer 生成的近似色全部吸附回调色板，消除同色系薄层与虚边。"""
    def repl(m):
        h = m.group(1)
        rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.int32)
        idx = int(((colors - rgb) ** 2).sum(1).argmin())
        return 'fill="#%02X%02X%02X"' % tuple(colors[idx])
    return re.sub(r'fill="#([0-9a-fA-F]{6})"', repl, text)


def finalize(path, size, colors):
    """吸附近似色并补 viewBox，保证任意尺寸缩放都按矢量重绘。"""
    with open(path, encoding='utf-8') as f:
        s = snap_fills(f.read(), colors)
    if 'viewBox' not in s:
        s = s.replace('<svg ', '<svg viewBox="0 0 %d %d" ' % (size, size), 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(s)


def vectorize(src_path, dst_path):
    img, colors = prepare(src_path)
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    tmp.close()
    try:
        img.save(tmp.name)
        vtracer.convert_image_to_svg_py(tmp.name, dst_path, *ARGS)
        finalize(dst_path, img.width, colors)
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
