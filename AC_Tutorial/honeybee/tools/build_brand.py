"""品牌图标：直接用 Ladybug Tools 官方蜜蜂 PNG，导出站标与 favicon。

官方图 203×203 RGBA（黑 + 琥珀 + 近白 + 透明底），本身足够清晰；
描摹成 SVG 反而会把透明底变成实心块，所以这里只做高质量缩放。

输出：
    assets/brand/honeybee.png       203×203（页面站标）
    assets/brand/honeybee-180.png   180×180（apple-touch-icon）
    assets/brand/honeybee-32.png    32×32（favicon）
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, 'assets', 'brand')
SRC = os.path.join(BRAND, 'honeybee-src.png')


def main():
    im = Image.open(SRC).convert('RGBA')
    im.save(os.path.join(BRAND, 'honeybee.png'), optimize=True)
    for size in (180, 32):
        im.resize((size, size), Image.LANCZOS).save(
            os.path.join(BRAND, 'honeybee-%d.png' % size), optimize=True)
    for name in ('honeybee.png', 'honeybee-180.png', 'honeybee-32.png'):
        print(name, os.path.getsize(os.path.join(BRAND, name)))


if __name__ == '__main__':
    main()
