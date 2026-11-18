"""统一的命名与路径规则。

组件键（id）= 英文名转小写连字符：`HB Apertures by Ratio` -> `hb-apertures-by-ratio`
该键同时用作图标文件名与站点 URL 片段。
"""

import re


def slugify(name):
    """英文名 -> URL/文件名安全的键。"""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def pkg_of(key):
    """按 id 前缀判断所属标签页键。"""
    for prefix, pkg in (("lb-", "ladybug"), ("hb-", "honeybee")):
        if key.startswith(prefix):
            return pkg
    return "honeybee"
