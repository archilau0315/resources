"""生成附录 A（术语表）与附录 B（组件全索引）的中英 Markdown。

用法：
    python tools/gen_appendix.py
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
DOC = os.path.join(ROOT, "doc")


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as fp:
        return json.load(fp)


def build_terms():
    terms = load("terms.json")
    zh = ["# A · 术语表", "",
          "> 收录 Ladybug Tools 工作流中最常遇到的 120 个术语，中英对照。", "",
          "| English | 中文 | 说明 |", "|---|---|---|"]
    en = ["# A · Glossary", "",
          "> 120 terms you will meet in a Ladybug Tools workflow.", "",
          "| English | Chinese | Notes |", "|---|---|---|"]
    for t in terms:
        zh.append(f"| {t['en']} | {t['zh']} | {t['note']} |")
        en.append(f"| {t['en']} | {t['zh']} | {t['note']} |")
    zh += ["", "## 下一步", "",
           "回到速查站，用术语名搜索组件；或直接进入 [B · 组件全索引](b-index.md)。"]
    en += ["", "## Next", "",
           "Search these terms in the component finder, or open [B · Component Index](b-index.md)."]
    return zh, en


def build_index(comps):
    tabs = []
    for c in comps:
        if c["tab"] not in tabs:
            tabs.append(c["tab"])
    zh = ["# B · 组件全索引", "",
          f"> 全部 {len(comps)} 个组件，按插件标签页与子分类排列；点击站点中的组件可查看端口与说明。", ""]
    en = ["# B · Component Index", "",
          f"> All {len(comps)} components grouped by tab and sub-category.", ""]
    for tab in tabs:
        group = [c for c in comps if c["tab"] == tab]
        zh += [f"## {tab}（{len(group)}）", "", "| 组件 | 中文名 | 子分类 | 章节 |", "|---|---|---|---|"]
        en += [f"## {tab} ({len(group)})", "", "| Component | Chinese | Sub-category | Chapter |", "|---|---|---|---|"]
        for c in group:
            zh.append(f"| {c['name']} | {c['zh']} | {c['subZh']} | {c['chapter']} |")
            en.append(f"| {c['name']} | {c['zh']} | {c['subZh']} | {c['chapter']} |")
        zh.append("")
        en.append("")
    return zh, en


def write(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(lines).rstrip() + "\n")


def main():
    terms_zh, terms_en = build_terms()
    write(os.path.join(DOC, "zh", "a-terms.md"), terms_zh)
    write(os.path.join(DOC, "en", "a-terms.md"), terms_en)

    comps = load("components.json")
    index_zh, index_en = build_index(comps)
    write(os.path.join(DOC, "zh", "b-index.md"), index_zh)
    write(os.path.join(DOC, "en", "b-index.md"), index_en)
    print(f"术语 {len(load('terms.json'))} 条，组件 {len(comps)} 条")


if __name__ == "__main__":
    main()
