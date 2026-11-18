"""P6 数据自检：图标、字段、教程文件、组件引用。

用法：
    python tools/check_data.py
退出码 0 表示全部通过。
"""

import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
SIZES = (24, 48, 96)


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as fp:
        return json.load(fp)


def main():
    comps = load("components.json")
    chapters = load("chapters.json")
    terms = load("terms.json")
    port_i18n = load("port_i18n.json")
    names = {c["name"] for c in comps}
    errors = []

    for c in comps:
        for field in ("id", "name", "zh", "tab", "sub", "desc", "in", "out"):
            if field not in c:
                errors.append(f"{c.get('name')} 缺字段 {field}")
        if not c["zh"]:
            errors.append(f"{c['name']} 无中文名")
        if not os.path.exists(os.path.join(ROOT, "assets", "icons", "svg", c["id"] + ".svg")):
            errors.append(f"缺矢量图标 svg/{c['id']}.svg")
        for size in SIZES:
            if not os.path.exists(os.path.join(ROOT, "assets", "icons", str(size), c["id"] + ".png")):
                errors.append(f"缺回退图标 {size}/{c['id']}.png")
                break

    for c in comps:
        for p in c["in"] + c["out"]:
            if not port_i18n.get(p["n"]):
                errors.append(f"端口缺中文名 {p['n']}")

    for part in chapters:
        if not part.get("partEn"):
            errors.append(f"章节缺英文名 {part.get('part')}")

    for part in chapters:
        for item in part["items"]:
            for lang in ("zh", "en"):
                path = os.path.join(ROOT, "doc", lang, item["slug"] + ".md")
                if not os.path.exists(path):
                    errors.append(f"缺教程 {lang}/{item['slug']}.md")

    for path in glob.glob(os.path.join(ROOT, "doc", "*", "*.md")):
        with open(path, encoding="utf-8") as fp:
            text = fp.read()
        for ref in re.findall(r"\[\[([^\]]+)\]\]", text):
            if ref not in names:
                errors.append(f"{os.path.basename(path)} 引用不存在的组件 {ref}")
        if not text.startswith("# "):
            errors.append(f"{os.path.basename(path)} 缺少一级标题")

    for name in ("components.json", "categories.json", "chapters.json", "terms.json", "port_i18n.json"):
        if not os.path.exists(os.path.join(DATA, name)):
            errors.append(f"缺数据文件 {name}")

    print(f"组件 {len(comps)} · 教程 {sum(len(p['items']) for p in chapters)} 篇 · 术语 {len(terms)} 条")
    print(f"错误 {len(errors)} 条")
    for err in errors[:30]:
        print("  -", err)
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
