"""P2 数据合并：raw_components.json + 4 份中文译名表 -> data/components.json、categories.json。

用法：
    python tools/build_data.py

人工维护的文件：
    data/zh_ladybug.json / zh_honeybee.json / zh_energy.json / zh_radiance.json
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

TAB_ORDER = ["Ladybug", "Honeybee", "HB-Energy", "HB-Radiance"]
ZH_FILES = {
    "Ladybug": "zh_ladybug.json",
    "Honeybee": "zh_honeybee.json",
    "HB-Energy": "zh_energy.json",
    "HB-Radiance": "zh_radiance.json",
}

SUB_ZH = {
    "Import": "导入", "Analyze Data": "数据分析", "Visualize Data": "数据可视化",
    "Analyze Geometry": "几何分析", "Extra": "扩展工具", "Version": "版本管理",
    "Create": "创建", "Visualize": "显示与检查", "Organize": "组织与筛选",
    "Serialize": "序列化与交换",
    "Basic Properties": "基础属性", "Constructions": "材料与构造",
    "Schedules": "运行计划", "Loads": "负荷与内扰", "HVAC": "暖通系统",
    "Simulate": "模拟运行", "Result": "结果读取", "Thermal Map": "热力图",
    "Modifiers": "材质", "Light Sources": "光源与天空", "Recipes": "模拟配方",
    "Results": "结果处理",
}

CHAPTER = {
    ("Ladybug", "Import"): 4, ("Ladybug", "Analyze Data"): 6,
    ("Ladybug", "Visualize Data"): 6, ("Ladybug", "Analyze Geometry"): 5,
    ("Ladybug", "Extra"): 7, ("Ladybug", "Version"): 2,
    ("Honeybee", "Create"): 8, ("Honeybee", "Visualize"): 11,
    ("Honeybee", "Organize"): 9, ("Honeybee", "Serialize"): 12,
    ("HB-Energy", "Basic Properties"): 13, ("HB-Energy", "Constructions"): 13,
    ("HB-Energy", "Schedules"): 14, ("HB-Energy", "Loads"): 14,
    ("HB-Energy", "HVAC"): 15, ("HB-Energy", "Simulate"): 16,
    ("HB-Energy", "Result"): 17, ("HB-Energy", "Thermal Map"): 17,
    ("HB-Radiance", "Basic Properties"): 19, ("HB-Radiance", "Modifiers"): 18,
    ("HB-Radiance", "Light Sources"): 18, ("HB-Radiance", "Recipes"): 20,
    ("HB-Radiance", "Results"): 20,
}

TYPE_ZH = {
    "text": "文本", "number": "数值", "int": "整数",
    "bool": "布尔", "list": "列表", "any": "",
}


def load_zh():
    """合并四份译名表，返回 {英文名: (中文名, 中文说明)}。"""
    merged = {}
    for tab, fname in ZH_FILES.items():
        with open(os.path.join(DATA, fname), encoding="utf-8") as fp:
            table = json.load(fp)
        for name, pair in table.items():
            if name.startswith("_"):
                continue
            zh, desc = pair
            merged[name] = (zh, desc)
    return merged


def port_view(port, direction):
    """端口精简字段，控制数据体积。"""
    return {
        "n": port["name"],
        "t": TYPE_ZH.get(port["type"], ""),
        "r": bool(port["required"]) if direction == "in" else False,
        "d": port["desc"],
    }


def main():
    with open(os.path.join(DATA, "raw_components.json"), encoding="utf-8") as fp:
        raw = json.load(fp)
    zh = load_zh()

    components = []
    missing = []
    for item in raw:
        pair = zh.get(item["name"])
        if not pair:
            missing.append(item["name"])
            pair = ("", "")
        chapter = CHAPTER.get((item["tab"], item["sub_label"]), 0)
        components.append({
            "id": item["id"],
            "name": item["name"],
            "zh": pair[0],
            "nick": item["nickname"],
            "tab": item["tab"],
            "sub": item["sub_label"],
            "subZh": SUB_ZH.get(item["sub_label"], item["sub_label"]),
            "desc": pair[1],
            "descEn": item["summary"],
            "ver": item["message"],
            "chapter": chapter,
            "valueList": item["value_list"],
            "in": [port_view(p, "in") for p in item["inputs"]],
            "out": [port_view(p, "out") for p in item["outputs"]],
        })

    components.sort(key=lambda c: (
        TAB_ORDER.index(c["tab"]), c["sub"], c["name"].lower()
    ))

    with open(os.path.join(DATA, "components.json"), "w", encoding="utf-8") as fp:
        json.dump(components, fp, ensure_ascii=False, separators=(",", ":"))

    cats = []
    for tab in TAB_ORDER:
        subs = []
        for comp in components:
            if comp["tab"] != tab:
                continue
            if comp["sub"] not in subs:
                subs.append(comp["sub"])
        cats.append({
            "tab": tab,
            "subs": [{
                "key": sub,
                "zh": SUB_ZH.get(sub, sub),
                "count": sum(1 for c in components if c["tab"] == tab and c["sub"] == sub),
                "chapter": CHAPTER.get((tab, sub), 0),
            } for sub in subs],
            "count": sum(1 for c in components if c["tab"] == tab),
        })

    with open(os.path.join(DATA, "categories.json"), "w", encoding="utf-8") as fp:
        json.dump(cats, fp, ensure_ascii=False, indent=1)

    print(f"组件：{len(components)}  分类：{sum(len(c['subs']) for c in cats)}")
    print(f"缺少译名：{len(missing)}")
    for name in missing[:10]:
        print("  ", name)
    size = os.path.getsize(os.path.join(DATA, "components.json")) / 1024
    print(f"components.json：{size:.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
