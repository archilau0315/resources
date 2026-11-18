# Honeybee 组件速查与系统教程 · Component Reference & Tutorials

> **Ladybug Tools 1.10 · 429 个组件 · 26 篇双语教程 · 矢量图标 · 中英一键切换**
> **Ladybug Tools 1.10 · 429 components · 26 bilingual tutorials · vector icons · one-click ZH/EN switch**

在线访问 / Live: <https://www.kbitai.com.cn/resources/AC_Tutorial/honeybee/site/index.html>

---

## 这是什么 · What It Is

**中文** — 一套面向中文用户的 Ladybug Tools 学习资料：把 Rhino / Grasshopper 中 Ladybug、Honeybee、HB-Energy、HB-Radiance 四个标签页的 **429 个组件**做成可搜索的速查手册，每个组件都带矢量图标、中英名称、完整输入输出端口，并配套 **26 篇中英双语教程**与 **117 条术语表**。界面默认中文，右上角「中 / EN」一键切换，全局实时生效。

**English** — A bilingual learning resource for Ladybug Tools. Every one of the **429 components** across the Ladybug, Honeybee, HB-Energy and HB-Radiance tabs is catalogued with its vector icon, Chinese and English names, full input/output ports, and linked to **26 bilingual tutorials** plus a **117-term glossary**. The UI defaults to Chinese and switches instantly with the **中 / EN** control.

| 能力 Capability | 中文说明 | English |
|---|---|---|
| 组件速查 | 429 条，按 4 个标签页、23 个子分类组织，支持中英名、昵称、端口、说明全文搜索 | 429 entries across 4 tabs and 23 sub-categories, full-text search over names, nicknames, ports and descriptions |
| 矢量图标 | 原图先做透明感知放大（预乘 alpha），调色板只取实色像素并保留 32 色，再 12 倍多边形描摹为 SVG（288×288 画布 + viewBox），渐变与高光不丢失，线条笔直、边缘干净；PNG 保留作回退 | Alpha-aware upscaling, a 32-colour palette sampled from solid pixels only, then 12× polygon tracing to SVG (288×288 canvas with viewBox) so gradients and highlights survive, with straight, clean edges; PNG kept as fallback |
| 中英切换 | 顶栏「中 / EN」，默认中文，界面文案、侧栏、计数、弹窗、端口说明全部实时切换并记住选择 | 中 / EN in the header, Chinese by default; chrome, sidebar, counts, modal and ports switch instantly and persist |
| 端口表 | 中英端口名、类型、是否必填、中文要点（单位/默认值/范围）+ 可展开的「中文说明 + 英文原文」 | Bilingual port names, types, required flags, Chinese key points (unit / default / range) and a collapsible Chinese explanation with the English source |
| 系统教程 | 入门 → 气象 → 建模 → 能量 → 采光 → 实战，共 26 篇 + 4 个附录，正文可独立切换中英 | 26 chapters from fundamentals to daylight and energy, plus 4 appendices; article language switchable |
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
├── site/                     静态站（index.html / app.js / util.js / i18n.js / style.css）
├── assets/icons/svg/         429 个矢量图标（主用）
├── assets/icons/{24,48,96}/  429 × 3 张原厂 PNG（回退）
├── assets/brand/             原厂蜜蜂 PNG（203）与 180/32 缩放版（站标与 favicon）
├── data/
│   ├── components.json       429 条组件（端口、中英说明）
│   ├── categories.json       4 标签页 / 23 子分类
│   ├── chapters.json         26 篇教程 + 4 附录清单（含英文篇名）
│   ├── terms.json            117 条术语
│   ├── port_i18n.json        1504 个端口名的中文译名
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
python tools/vectorize_icons.py   # PNG -> assets/icons/svg/*.svg（透明感知放大 + polygon 描摹）
python tools/build_brand.py       # 原厂蜜蜂 PNG -> assets/brand/honeybee.png + 180/32 PNG
python tools/build_cover.py       # 原厂蜜蜂 PNG -> cover.svg（资源页卡片缩略图）
python tools/parse_components.py  # .ghuser + src/*.py -> raw_components.json
python tools/build_data.py        # 叠加中文译名 -> components.json
python tools/build_port_i18n.py   # 端口中文名 -> port_i18n.json
python tools/gen_appendix.py      # 生成附录 A / B
python tools/check_data.py        # 图标、字段、端口译名、链接、引用自检
```

| 标签页 Tab | 组件数 | 子分类 | 教程章节 |
|---|---:|---:|---|
| Ladybug | 122 | 6 | 04–07 |
| Honeybee | 70 | 4 | 08–12 |
| HB-Energy | 143 | 8 | 13–17 |
| HB-Radiance | 94 | 5 | 18–20 |
| **合计 Total** | **429** | **23** | **26 + 4 附录** |

---

## 图标与双语实现 · Icons & i18n

**中文** — 图标：原厂图标只有 24×24 PNG。旧流程直接 `convert('RGB')` 取色，会把透明区的黑色和抗锯齿混合色当成图标颜色，描摹后每条边多一圈灰浊过渡，放大看就是发虚、水泡状。`tools/vectorize_icons.py` 现在先把 RGBA 预乘 alpha 再 12 倍 LANCZOS 放大，调色板只从 alpha>200 的实色像素提取并保留 32 色（层次差 6），原厂的渐变与高光不会被压成平色；轮廓直接取 50% alpha 阈值，不外扩，避免图标发胖、边缘呈水泡状；最后以 polygon 模式描摹成 288×288 的 SVG（补 `viewBox="0 0 288 288"`）。多边形全为直线段，不会像样条那样外鼓，1 个画布单位≈0.39 屏幕像素，阶梯远小于 1px。页面用 `<img>` 直接引用（带 `?v=` 版本号防缓存），CSS 只给尺寸不给 `image-rendering: pixelated`；加载失败时 `onerror` 自动回退到 48/96 PNG。站标直接用 Ladybug Tools 原厂蜜蜂图（`assets/brand/honeybee.png`，203×203 RGBA，由 `tools/build_brand.py` 仅做 LANCZOS 缩放导出 180/32 两档），同时作为 favicon 与 apple-touch-icon——描摹成 SVG 会把透明底变成实心块，故保留 PNG。资源页卡片缩略图 `cover.svg` 由 `tools/build_cover.py` 生成：原厂蜜蜂 PNG 以 base64 内嵌于白色圆盘，下方配 HONEYBEE 与中英说明文字。双语：`site/i18n.js` 存界面字典，`site/app.js` 维护 `state.lang`（`localStorage` 持久化，默认 `zh`），切换时重渲染并按 `port_i18n.json` 取端口中文名；端口「详细说明」折叠块始终给出中文说明（类型、涉及对象、默认值、单位、范围、枚举、开关、None 语义等，由 `site/util.js` 的 `portFacts` / `portZhDetail` 从英文原文抽取），中文模式下再附英文原文，英文模式下也保留这份中文说明。

**English** — Icons: the native assets are 24×24 PNGs. The old pipeline sampled colours via `convert('RGB')`, so the black of transparent pixels and anti-aliased blends leaked into the palette and produced a muddy ring around every edge — the "soft, bubbly" look. `tools/vectorize_icons.py` now premultiplies alpha before a 12× LANCZOS upscale, builds a 32-colour palette from solid pixels (alpha > 200) with a layer difference of 6 so the original gradients and highlights are not flattened, cuts the silhouette at the 50% alpha level without dilation so icons do not grow fat or look bubbly, and traces in `polygon` mode to a 288×288 SVG (`viewBox="0 0 288 288"`). Straight segments never bulge like splines, and one canvas unit is ≈0.39 screen pixels, so residual steps stay far below one pixel. Images are referenced by `<img>` with a `?v=` cache tag, size-only CSS and no `image-rendering: pixelated`; an `onerror` fallback loads the 48/96 PNG. The site mark is the official Ladybug Tools honeybee artwork (`assets/brand/honeybee.png`, 203×203 RGBA; `tools/build_brand.py` only exports 180/32 versions with LANCZOS) and doubles as favicon and apple-touch-icon — tracing it to SVG filled the transparent background with a solid block, hence PNG. The resources-page thumbnail `cover.svg` is generated by `tools/build_cover.py`: the original bee PNG is embedded as base64 on a white disc with the HONEYBEE title and bilingual captions below. i18n: `site/i18n.js` holds UI strings, `site/app.js` keeps `state.lang` (persisted, default `zh`) and re-renders on switch, pulling Chinese port names from `port_i18n.json`. Every port's collapsible details block always carries a Chinese explanation (type, related object, default, unit, range, enum values, boolean behaviour, None semantics — extracted from the English source by `portFacts` / `portZhDetail` in `site/util.js`); Chinese mode adds the English original, and English mode keeps the Chinese notes.

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
