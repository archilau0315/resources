# -*- coding: utf-8 -*-
"""生成资源页「澳洲内训」卡片缩略图 autrain_thumb.jpg（1000×1000）。

版式：B 方案图标 430px 居中 + 标题「澳洲内训」120px + 蓝短横线 +
副标题「中英双语 · 设计实务」42px + 底部英文脚注 44px（2026-11-05 由 24px 加大，
原尺寸在 120px 卡片上不足 3px 不可辨认）。

依赖：Pillow、系统字体 msyhbd.ttc / msyh.ttc（Windows）。
用法：在 resources/ 目录下 python make_autrain_thumb.py
"""
from PIL import Image, ImageDraw, ImageFont

BG = (250, 250, 248)
W = 1000
FB = "C:/Windows/Fonts/msyhbd.ttc"
FR = "C:/Windows/Fonts/msyh.ttc"


def build():
    im = Image.new("RGB", (W, W), BG)
    d = ImageDraw.Draw(im)

    def center(text, font, cy, fill):
        bb = d.textbbox((0, 0), text, font=font)
        d.text(((W - (bb[2] - bb[0])) / 2 - bb[0], cy - (bb[3] - bb[1]) / 2 - bb[1]),
               text, font=font, fill=fill)
        return bb[2] - bb[0]

    icon = Image.open("autrain_icon.png").convert("RGBA").resize((430, 430), Image.LANCZOS)
    im.paste(icon, ((W - 430) // 2, 105), icon)

    center("澳洲内训", ImageFont.truetype(FB, 120), 628, (28, 28, 26))
    d.rectangle([(W - 84) // 2, 714, (W - 84) // 2 + 84, 721], fill=(47, 124, 158))
    center("中英双语 · 设计实务", ImageFont.truetype(FR, 42), 768, (47, 124, 158))

    w = center("A U  D E S I G N  P R A C T I C E  K I T",
               ImageFont.truetype(FR, 44), 938, (125, 127, 125))
    assert w <= 920, "脚注过宽，需收窄字距"

    im.save("autrain_thumb.jpg", quality=93, subsampling=0)
    im.resize((120, 120), Image.LANCZOS).save("_thumb_preview_120.png")


if __name__ == "__main__":
    build()
    print("已生成 autrain_thumb.jpg 与预览 _thumb_preview_120.png")
