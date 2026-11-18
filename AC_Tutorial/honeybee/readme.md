# Honeybee 组件速查与系统教程 · Component Reference & Tutorials

> **Ladybug Tools 1.10 · 429 个组件 · 22 篇双语教程 · 零依赖静态站**
> **Ladybug Tools 1.10 · 429 components · 22 bilingual tutorials · zero-dependency static site**

在线访问 / Live: <https://www.kbitai.com.cn/resources/AC_Tutorial/honeybee/site/index.html>

---

## 这是什么 · What It Is

**中文** — 一套面向中文用户的 Ladybug Tools 学习资料：把 Rhino / Grasshopper 中 Ladybug、Honeybee、HB-Energy、HB-Radiance 四个标签页的 **429 个组件**做成可搜索的速查手册，每个组件都带原厂图标、中英名称、完整输入输出端口，并配套 **22 篇中英双语教程**与 **117 条术语表**。

**English** — A bilingual learning resource for Ladybug Tools. Every one of the **429 components** across the Ladybug, Honeybee, HB-Energy and HB-Radiance tabs is catalogued with its native icon, Chinese and English names, full input/output ports, and linked to **22 bilingual tutorials** plus a **117-term glossary**.

| 能力 Capability | 中文说明 | English |
|---|---|---|
| 组件速查 | 429 条，按 4 个标签页、23 个子分类组织，支持中英名、昵称、端口、说明全文搜索 | 429 entries across 4 tabs and 23 sub-categories, full-text search over names, nicknames, ports and descriptions |
| 原厂图标 | 直接提取自官方 `.ghuser`，24 / 48 / 96 三档，像素级还原 | Icons extracted from the official `.ghuser` files at 24 / 48 / 96 px |
| 端口表 | 输入输出名称、推断类型、是否必填、官方英文说明 | Port names, inferred types, required flags and official English notes |
| 系统教程 | 入门 → 气象 → 建模 → 能量 → 采光 → 实战，共 22 篇 + 4 个附录 | 22 chapters from fundamentals to daylight and energy, plus 4 appendices |
| 术语表 | 117 条中英对照，覆盖 EPW、构造、采光指标等 | 117 bilingual terms covering EPW, constructions, daylight metrics and more |
| 明暗主题 | 跟随系统记忆，支持打印与移动端 | Dark / light theme, print-friendly, responsive |

---

## 快速开始 · Quick Start

**中文** — 站点使用 `fetch` 读取数据，需通过本地 HTTP 服务打开（直接双击 `index.html` 会被浏览器拦截）：

```bash
cd resources/AC_Tutorial/honeybee
python -m http.server 8080
# 打开 http://localhost:8080/site/index.html
```

**English** — The site loads JSON at runtime, so serve it over HTTP:

```bash
cd resources/AC_Tutorial/honeybee
python -m http.server 8080
# open http://localhost:8080/site/index.html
```

快捷键 / Shortcuts：<kbd>/</kbd> 聚焦搜索，<kbd>Esc</kbd> 清空或关闭详情。

---

## 目录结构 · Structure

```
honeybee/
├── readme.md                 本文档 · this file
├── 开发计划.md               开发计划 v1.1 · plan
├── debug_log_1.md            变更记录 · change log
├── cover.svg                 封面与主站卡片缩略图 · cover
├── site/                     静态站（index.html / app.js / style.css）
├── assets/icons/{24,48,96}/  429 × 3 张原厂图标
├── data/
│   ├── components.json       429 条组件（端口、中英说明）
│   ├── categories.json       4 标签页 / 23 子分类
│   ├── chapters.json         22 篇教程 + 4 附录清单
│   ├── terms.json            117 条术语
│   ├── raw_components.json   解析中间产物
│   └── zh_*.json             人工中文译名表（4 份）
├── doc/zh|en/                26 篇中英对照 Markdown
├── tools/                    数据流水线脚本
└── reports/                  构建报告（图标缺失清单）
```

---

## 数据流水线 · Data Pipeline

**中文** — 所有组件数据来自本机安装的官方 Python 包（`ladybug_grasshopper`、`honeybee_grasshopper_core`、`-energy`、`-radiance`）。`.ghuser` 是 raw deflate 压缩的 GH 二进制档案，解压后可读出名称、分类、说明与内嵌 PNG 图标；端口说明来自同名的 `src/*.py` docstring。**官方英文原文不改写，中文为人工校订。**

**English** — All component data is derived from the locally installed official packages. Each `.ghuser` is a raw-deflate compressed GH archive containing the name, category, description and an embedded PNG icon; port documentation is parsed from the matching `src/*.py` docstring. **Official English text is preserved verbatim; Chinese is human-reviewed.**

```bash
python tools/extract_icons.py     # .ghuser -> 24/48/96 PNG
python tools/parse_components.py  # .ghuser + src/*.py -> raw_components.json
python tools/build_data.py        # 叠加中文译名 -> components.json
python tools/gen_appendix.py      # 生成附录 A / B
python tools/check_data.py        # 图标、字段、链接、引用自检
```

| 标签页 Tab | 组件数 | 子分类 | 教程章节 |
|---|---:|---:|---|
| Ladybug | 122 | 6 | 04–07 |
| Honeybee | 70 | 4 | 08–12 |
| HB-Energy | 143 | 8 | 13–17 |
| HB-Radiance | 94 | 5 | 18–20 |
| **合计 Total** | **429** | **23** | **22 + 4 附录** |

---

## 维护约定 · Maintenance

**中文** — 修改数据后依次运行 `build_data.py` 与 `check_data.py`，自检失败不要提交；新增或改名组件时同步更新 `data/zh_*.json` 中的中文译名；结构变更需同步更新本 readme。组件图标与英文说明版权归 Ladybug Tools 所有，本站仅作功能说明用途。

**English** — After any data change, run `build_data.py` then `check_data.py`; do not commit when the check fails. When components are added or renamed, update the matching Chinese entries in `data/zh_*.json`. Keep this readme in sync with structural changes. Icons and English descriptions remain the property of Ladybug Tools and are used here solely to document component functions.

---

## 许可与致谢 · License & Credits

- **组件图标与英文说明**：© [Ladybug Tools](https://github.com/ladybug-tools)，[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)。仅用于说明各组件功能，不单独再分发图标包。
- **教程文字、中文译名、站点代码**：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)。
- 版本依据：Pollination 随附的 `lbt-grasshopper 1.10.6`（组件 `Component.Message` 为 1.10.0–1.10.4）。
- 官方资料：[Honeybee Primer](https://docs.ladybug.tools/honeybee-primer/) · [HB-Energy Primer](https://docs.ladybug.tools/hb-energy-primer/) · [HB-Radiance Primer](https://docs.ladybug.tools/hb-radiance-primer/) · [Ladybug Primer](https://docs.ladybug.tools/ladybug-primer/)

---

<p align="center">
  <b>KBIT AI</b> · 天津匡形无界智能科技有限公司<br>
  <sub>让建筑性能分析看得懂、查得到、用得上。</sub>
</p>
