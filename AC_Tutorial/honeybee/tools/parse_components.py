"""P1 组件清单：4 个包的 .ghuser + src/*.py 合并为 data/raw_components.json。

.ghuser 提供：英文名、昵称、分类、子分类、说明、图标
src/*.py 提供：Args / Returns 端口说明、组件版本号（ghenv.Component.Message）

用法：
    python tools/parse_components.py
"""

import ast
import json
import os
import re
import sys

from ghuser import read_user_object
from naming import slugify

SITE_PACKAGES = r"C:\Program Files\python311\Lib\site-packages"
PACKAGES = (
    ("ladybug_grasshopper", "Ladybug"),
    ("honeybee_grasshopper_core", "Honeybee"),
    ("honeybee_grasshopper_energy", "HB-Energy"),
    ("honeybee_grasshopper_radiance", "HB-Radiance"),
)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "raw_components.json")

PORT_RE = re.compile(r"^\s{4,8}([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$")
TYPE_RULES = (
    ("list", ("a list of", "list of")),
    ("bool", ("boolean", "set to true", "set to false", "if true", "if false")),
    ("int", ("integer", "an int")),
    ("number", ("number", "a value", "numeric")),
    ("text", ("text", "a string", "string for")),
)


def parse_docstring(py_path):
    """解析模块 docstring，返回 (摘要, 输入端口, 输出端口)。"""
    with open(py_path, "r", encoding="utf-8") as fp:
        source = fp.read()
    try:
        doc = ast.get_docstring(ast.parse(source)) or ""
    except SyntaxError:  # 少数老组件是 Python 2 语法，退回文本提取
        match = re.search(r'"""(.*?)"""', source, re.S)
        doc = match.group(1) if match else ""

    lines = doc.splitlines()
    args_at = next((i for i, l in enumerate(lines) if l.strip().lower() == "args:"), None)
    returns_at = next((i for i, l in enumerate(lines) if l.strip().lower() == "returns:"), None)

    summary_lines = lines[:args_at] if args_at is not None else lines
    while summary_lines and summary_lines[-1].strip() in ("", "-", "_", "+", "~", "*"):
        summary_lines.pop()
    summary = "\n".join(summary_lines).strip()

    inputs = parse_ports(lines[args_at + 1:returns_at]) if args_at is not None else []
    outputs = parse_ports(lines[returns_at + 1:]) if returns_at is not None else []
    return summary, inputs, outputs


def parse_ports(lines):
    """把 docstring 片段解析成端口列表。"""
    ports = []
    for line in lines:
        if not line.strip():
            continue
        match = PORT_RE.match(line)
        if match:
            name, text = match.group(1), match.group(2).strip()
            ports.append({"name": name, "desc": text, "type": infer_type(text)})
        elif ports and line.startswith("        "):
            ports[-1]["desc"] = (ports[-1]["desc"] + " " + line.strip()).strip()
    for port in ports:
        port["required"] = port["name"].startswith("_") and not port["name"].endswith("_")
    return ports


def infer_type(text):
    """按官方说明的措辞粗略判断端口数据类型。"""
    low = text.lower()
    for kind, words in TYPE_RULES:
        if any(w in low for w in words):
            return kind
    return "any"


def clean_text(text):
    """去掉图中的分隔符行，统一换行。"""
    lines = [
        line for line in text.replace("\r\n", "\n").split("\n")
        if line.strip() not in ("_", "-")
    ]
    return "\n".join(lines).strip()


def read_message(py_path):
    """从 ghenv.Component 取版本号与昵称。"""
    with open(py_path, "r", encoding="utf-8") as fp:
        source = fp.read()
    version = re.search(r"Component\.Message\s*=\s*['\"]([^'\"]+)", source)
    nick = re.search(r"Component\.NickName\s*=\s*['\"]([^'\"]+)", source)
    return (version.group(1) if version else "", nick.group(1) if nick else "")


def main():
    records = []
    unmatched = []
    for pkg, tab in PACKAGES:
        obj_dir = os.path.join(SITE_PACKAGES, pkg, "user_objects")
        src_dir = os.path.join(SITE_PACKAGES, pkg, "src")
        py_files = {
            f[:-3]: os.path.join(src_dir, f)
            for f in os.listdir(src_dir)
            if f.endswith(".py")
        } if os.path.isdir(src_dir) else {}

        for fname in sorted(os.listdir(obj_dir)):
            if not fname.endswith(".ghuser"):
                continue
            stem = fname[:-7]
            raw = read_user_object(os.path.join(obj_dir, fname))
            name = (raw.get("Name") or stem).strip()
            py_path = py_files.pop(stem, None)
            if py_path:
                summary, inputs, outputs = parse_docstring(py_path)
                message, py_nick = read_message(py_path)
            else:
                summary, inputs, outputs, message, py_nick = "", [], [], "", ""
                unmatched.append(f"{pkg}/{stem}")

            sub = (raw.get("SubCategory") or "").strip()
            label = sub.split("::", 1)[-1].strip() if sub else ""
            value_list = not py_path  # 17 个下拉值列表组件没有 py 源码
            if value_list:
                outputs = [{
                    "name": "values",
                    "desc": "List of preset values to choose from.",
                    "type": "list",
                    "required": False,
                }]
            records.append({
                "id": slugify(name),
                "name": name,
                "nickname": (raw.get("NickName") or "").strip() or py_nick,
                "tab": tab,
                "sub": sub,
                "sub_label": label,
                "description": clean_text(raw.get("Description") or ""),
                "summary": summary,
                "message": message,
                "inputs": inputs,
                "outputs": outputs,
                "has_source": bool(py_path),
                "value_list": value_list,
            })
        for leftover in py_files:
            unmatched.append(f"{pkg}/{leftover}.py (无组件)")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fp:
        json.dump(records, fp, ensure_ascii=False, indent=1)

    empty_ports = [r["name"] for r in records if not r["inputs"] and not r["outputs"]]
    print(f"组件：{len(records)}  无端口：{len(empty_ports)}")
    print(f"端口合计：{sum(len(r['inputs']) + len(r['outputs']) for r in records)}")
    print(f"未匹配：{len(unmatched)}")
    for line in unmatched[:15]:
        print("  ", line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
