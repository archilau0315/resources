# 变更记录 · Debug Log 1

> 记录 Honeybee 组件速查与教程项目的全部代码与数据变更。

## 2026-11-18

### 1. 项目初始化与数据流水线

- **模块**：`tools/`
- **变更**：
  - 新增 `ghuser.py`：解析 raw deflate 压缩的 `.ghuser`（类型码 3/9/10/20），提取名称、分类、说明与内嵌 PNG。
  - 新增 `naming.py`：组件 id 统一为小写连字符（如 `hb-room`）。
  - 新增 `extract_icons.py`：412 个组件导出 24/48/96 三档图标，缺失 0 条，名称不一致 0 条。
  - 新增 `parse_components.py`：`.ghuser` + `src/*.py` docstring 合并为 `raw_components.json`；17 个无源码的下拉值列表组件按 `values` 输出端口补齐；Python 2 语法文件回退正则提取 docstring。
  - 新增 `build_data.py`：合并 4 份中文译名表，产出 `components.json`（412 条）与 `categories.json`（4 标签页 / 23 子分类）。
  - 新增 `gen_appendix.py`：由数据生成附录 A（术语表）与附录 B（组件全索引）。
  - 新增 `check_data.py`：校验图标、字段、教程文件与 `[[组件]]` 引用。
- **备注**：以 `.ghuser` 为权威清单；端口说明保留官方英文原文，避免误译。

### 2. 中文内容

- **模块**：`data/zh_*.json`、`doc/`
- **变更**：完成 412 条中文名与中文功能说明（Ladybug 120 / Honeybee 70 / HB-Energy 139 / HB-Radiance 83）；新增 120 条术语表；撰写 22 篇教程 + 4 个附录，中英各一份（`doc/zh`、`doc/en` 各 26 篇）。
- **备注**：英文版为中文内容的精简忠实版本；组件名与端口名一律保留英文。

### 3. 前端站点

- **模块**：`site/`
- **变更**：新增零依赖静态站（`index.html` / `app.js` / `style.css`），含四标签页分类树、全文搜索、卡片懒加载、详情弹窗、教程阅读器（中英切换 + 极简 Markdown 渲染）、术语表、明暗主题与移动端适配。
- **备注**：需通过 HTTP 服务打开（`python -m http.server`），`fetch` 不支持 `file://`。

### 4. 主站入口与封面

- **模块**：`resources/index.html`、`cover.svg`
- **变更**：新增 Honeybee 教程卡片（中英 i18n 键 `article-hb-*`）；新增 300×300 封面，蜂窝纹理 + 原厂风格的组件连线。
- **备注**：卡片链接指向 `./AC_Tutorial/honeybee/site/index.html`。

### 5. 验收

- **模块**：`tools/check_data.py`、浏览器实测
- **变更**：自检 0 错误；本地 8099 端口实测：卡片与图标渲染、详情端口表、教程渲染与中英切换全部通过。
- **备注**：服务器部署时需同步 `resources/AC_Tutorial/honeybee/` 与 `resources/index.html`。
