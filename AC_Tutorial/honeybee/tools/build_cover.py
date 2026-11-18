"""生成资源页展示卡封面：原厂蜜蜂 logo + 文字。

把 assets/brand/honeybee.png（官方 203×203 透明底 PNG）以 base64 内嵌进
cover.svg 中央的白色圆盘，下方放中英标题文字，输出 300×300 封面。
"""
import base64
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEE = os.path.join(ROOT, 'assets', 'brand', 'honeybee.png')
COVER = os.path.join(ROOT, 'cover.svg')

TPL = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="Honeybee 组件速查与系统教程">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b2a12"/>
      <stop offset="0.5" stop-color="#b06a12"/>
      <stop offset="1" stop-color="#f2b33d"/>
    </linearGradient>
    <pattern id="comb" width="34" height="30" patternUnits="userSpaceOnUse">
      <path d="M8.5 2 L17 7 L17 17 L8.5 22 L0 17 L0 7 Z" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1"/>
      <path d="M25.5 17 L34 22 L34 32 L25.5 37 L17 32 L17 22 Z" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="0.28" cy="0.22" r="0.75">
      <stop offset="0" stop-color="#ffd88a" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#ffd88a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="300" height="300" fill="url(#bg)"/>
  <rect width="300" height="300" fill="url(#comb)"/>
  <rect width="300" height="300" fill="url(#glow)"/>

  <!-- 原厂蜜蜂 logo 圆盘 -->
  <circle cx="150" cy="116" r="78" fill="#fffdf7" fill-opacity="0.97"/>
  <circle cx="150" cy="116" r="78" fill="none" stroke="#f2b33d" stroke-width="2.5"/>
  <g><image x="%(bx).2f" y="%(by).2f" width="118" height="118" href="data:image/png;base64,%(bee)s"/></g>

  <!-- 文字 -->
  <text x="150" y="238" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="800" fill="#ffffff" letter-spacing="1">HONEYBEE</text>
  <text x="150" y="262" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, Segoe UI, sans-serif"
        font-size="13" font-weight="600" fill="#fff8e6" letter-spacing="1">组件速查 · 系统教程</text>
  <text x="150" y="281" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="9.5" fill="#ffe6a8" letter-spacing="0.5">Ladybug Tools 1.10 · 429 components · 26 tutorials</text>

  <text x="288" y="292" text-anchor="end" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="9" fill="#ffffff" fill-opacity="0.55">KBIT AI</text>
</svg>
'''


def main():
    png = io.open(BEE, 'rb').read()
    b64 = base64.b64encode(png).decode('ascii')
    bx = 150 - 118 / 2.0
    by = 116 - 118 / 2.0
    out = TPL % {'bee': b64, 'bx': bx, 'by': by}
    io.open(COVER, 'w', encoding='utf-8').write(out)
    print('cover.svg', round(len(out) / 1024, 1), 'KB')


if __name__ == '__main__':
    main()
