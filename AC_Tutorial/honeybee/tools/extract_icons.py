"""P0 图标导出：4 个 Ladybug Tools 包的 .ghuser -> 24/48/96 三档 PNG。

用法：
    python tools/extract_icons.py

输出：
    assets/icons/{24,48,96}/<id>.png
    构建日志打印到终端（缺失清单写入 reports/icons_missing.txt）
"""

import os
import sys

from PIL import Image

from ghuser import read_user_object
from naming import slugify

SITE_PACKAGES = r"C:\Program Files\python311\Lib\site-packages"
PACKAGES = (
    "ladybug_grasshopper",
    "honeybee_grasshopper_core",
    "honeybee_grasshopper_energy",
    "honeybee_grasshopper_radiance",
)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZES = (24, 48, 96)


def iter_objects():
    """遍历四个包的 user_objects 目录，逐个产出解析结果。"""
    for pkg in PACKAGES:
        folder = os.path.join(SITE_PACKAGES, pkg, "user_objects")
        if not os.path.isdir(folder):
            print(f"[跳过] 未安装：{pkg}")
            continue
        for fname in sorted(os.listdir(folder)):
            if not fname.endswith(".ghuser"):
                continue
            path = os.path.join(folder, fname)
            yield pkg, fname[:-7], read_user_object(path)


def main():
    out_dirs = {size: os.path.join(ROOT, "assets", "icons", str(size)) for size in SIZES}
    for folder in out_dirs.values():
        os.makedirs(folder, exist_ok=True)

    report_dir = os.path.join(ROOT, "reports")
    os.makedirs(report_dir, exist_ok=True)

    total = 0
    missing = []
    mismatched = []
    for pkg, stem, data in iter_objects():
        total += 1
        name = (data.get("Name") or stem).strip()
        if name != stem:
            mismatched.append(f"{pkg}/{stem} -> Name={name!r}")
        png = data.get("Icon")
        if not png:
            missing.append(f"{pkg}/{stem}")
            continue
        key = slugify(name)
        image = Image.open(__import__("io").BytesIO(png)).convert("RGBA")
        for size, folder in out_dirs.items():
            resample = Image.NEAREST if size >= 24 else Image.LANCZOS
            image.resize((size, size), resample).save(
                os.path.join(folder, key + ".png"), optimize=True
            )

    with open(os.path.join(report_dir, "icons_missing.txt"), "w", encoding="utf-8") as fp:
        fp.write("\n".join(missing) or "none")

    print(f"组件总数：{total}")
    print(f"图标缺失：{len(missing)}")
    print(f"名称不一致：{len(mismatched)}")
    for line in mismatched[:20]:
        print("  ", line)
    return 0 if not missing else 1


if __name__ == "__main__":
    sys.exit(main())
