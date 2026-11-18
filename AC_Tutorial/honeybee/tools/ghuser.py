"""读取 Grasshopper .ghuser 档案（raw deflate 压缩的 GH_IO 二进制）。

.ghuser = zlib raw deflate(-15) 压缩的 GH 二进制；解压后为一串「名-值」数据块：
    名称长度(1 字节) + 名称 + 0xFFFFFFFF + 4 字节类型码 + 数据
类型码：3=int32  9=Guid(16B)  10=字符串(变长整数长度)  20=字节数组(int32 长度)

用法：
    from ghuser import read_user_object
    data = read_user_object(path)
    data["Name"], data["Category"], data["Icon"](PNG bytes)
"""

import zlib

T_INT = 3
T_GUID = 9
T_STRING = 10
T_BYTES = 20

FIELDS = (
    "BaseID", "Category", "SubCategory", "Name", "NickName",
    "Description", "Exposure", "Icon",
)


def _varint(buf, pos):
    """读取 7-bit 变长整数。"""
    value = 0
    shift = 0
    while True:
        byte = buf[pos]
        pos += 1
        value |= (byte & 0x7F) << shift
        if not byte & 0x80:
            return value, pos
        shift += 7


def _read_item(buf, name):
    """按字段名定位并解析一个数据块，返回 Python 值；找不到返回 None。"""
    key = name.encode("utf-8")
    pattern = bytes([len(key)]) + key + b"\xff\xff\xff\xff"
    idx = buf.find(pattern)
    if idx < 0:
        return None
    pos = idx + len(pattern)
    kind = int.from_bytes(buf[pos:pos + 4], "little")
    pos += 4

    if kind == T_STRING:
        size, pos = _varint(buf, pos)
        return buf[pos:pos + size].decode("utf-8", "replace")
    if kind == T_BYTES:
        size = int.from_bytes(buf[pos:pos + 4], "little")
        return buf[pos + 4:pos + 4 + size]
    if kind == T_GUID:
        return buf[pos:pos + 16].hex()
    if kind == T_INT:
        return int.from_bytes(buf[pos:pos + 4], "little")
    return None


def _png_from(blob):
    """从字节数组中裁出完整 PNG（含 IEND）。"""
    if not blob:
        return None
    start = blob.find(b"\x89PNG\r\n\x1a\n")
    end = blob.find(b"IEND", start)
    if start < 0 or end < 0:
        return None
    return blob[start:end + 8]


def read_user_object(path):
    """解压并解析 .ghuser，返回字段字典（Icon 为 PNG 字节）。"""
    with open(path, "rb") as fp:
        raw = fp.read()
    buf = zlib.decompress(raw, -15)
    data = {field: _read_item(buf, field) for field in FIELDS}
    data["Icon"] = _png_from(data["Icon"])
    return data
