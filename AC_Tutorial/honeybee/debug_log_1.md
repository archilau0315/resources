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

### 6. 上线部署

- **模块**：服务器 `47.93.210.248`
- **变更**：打包 `site/ data/ assets/ doc/ tools/ reports/ cover.svg readme.md debug_log_1.md` 上传至 `/www/wwwroot/kbitai.com.cn/resources/AC_Tutorial/honeybee/`（替换前已备份至 `/tmp/honeybee-backup.tar.gz`）；同步更新 `/www/wwwroot/kbitai.com.cn/resources/index.html`（旧版备份 `/tmp/resources-index-backup.html`）。
- **备注**：线上抽查 5 个 URL 均 200；浏览器实测首页 412 组件、HB Room 详情端口表、教程页渲染全部通过。


### 7. 对齐 Pollination 随附的 Ladybug Tools 1.10

- **时间**：2026-11-18 10:48
- **模块**：组件安装、	ools/parse_components.py、	ools/extract_icons.py、data/*.json、eadme.md
- **变更**：
  1. 确认 Pollination 已把 Ladybug Tools 库与引擎装在 `C:\Program Files\ladybug_tools`（python / openstudio / radiance / resources / grasshopper），但 Grasshopper 的 UserObjects 中没有组件。
  2. 把 `C:\Program Files\ladybug_tools\grasshopper\{ladybug_grasshopper,honeybee_grasshopper_{core,energy,radiance}}\user_objects\*.ghuser` 复制到 `%APPDATA%\Grasshopper\UserObjects\<包名>\user_objects\`，共 429 个组件。
  3. 用 Pollination 自带 python 执行 `python -m ladybug_rhino set-python-search`，把 site-packages 写入 `C:\ProgramData\McNeel\Rhinoceros\8.0\scripts\python-3_lbt.pth`；清理了指向已删路径的冗余行。
  4. 数据流水线改为读取新路径，重跑 extract_icons / parse_components / build_data / gen_appendix；补 17 个新增组件的中文名与说明。
  5. 统计由 412（120/70/139/83）更新为 429（122/70/143/94），术语 117 条，readme 同步。
- **备注**：删除了一度误装的 `%USERPROFILE%\ladybug_tools`（pip 安装的 1.10.6 旧副本），避免与 Pollination 自带库版本冲突；现只保留一套 1.10.x。新增组件 17 个：LB Apply Metadata、LB Contour Mesh、HB Exhaust Air 系列 4 个、HB 灯具/采光标准 11 个。

### 8. 插入界面截图并统一 1.10 口径

- **时间**：2026-11-18 11:20
- **模块**：site/app.js、site/style.css、site/index.html、cover.svg、doc/zh/02-03-21-c-hbjson、doc/en/02-03-c-hbjson、开发计划.md
- **变更**：
  1. `mdToHtml` 新增块级图片语法 `![alt](src)`，输出 `<figure><img loading="lazy"><figcaption>`；`style.css` 补 figure/img/figcaption 样式（圆角、边框、图注居中）。
  2. 中文 02 章插入 `02-grasshopper.png`，03 章插入 `01-rhino.png`；英文 02/03 章插入同名图片与英文图注。
  3. 全部章节与站点头部的版本口径统一为 1.10.x / 429 组件；`cover.svg` 改为「429 组件速查 · 26 篇教程」。
  4. 开发计划.md 的 412 计数、1.9 版本号同步到 429 / 1.10.58。
- **备注**：截图由 `tools/gh_shot.ps1` 以 PrintWindow(PW_RENDERFULLCONTENT) 抓取，窗口级渲染，不含桌面悬浮窗；`python tools/check_data.py` 自检 0 错误。

### 9. 图标矢量清晰化 + 全站中英一键切换

- **时间**：2026-11-18 11:45
- **模块**：tools/vectorize_icons.py、tools/build_port_i18n.py、tools/check_data.py、site/{index.html,app.js,util.js,i18n.js,style.css}、data/{port_i18n.json,chapters.json}、readme.md
- **变更**：
  1. 新增 `tools/vectorize_icons.py`：以 96×96 PNG 为输入，VTracer 描摹为 SVG 并补 `viewBox="0 0 96 96"`，产出 `assets/icons/svg/*.svg` 429 个；`check_data.py` 增加矢量图标、端口译名、章节英文名校验。
  2. `style.css` 删除 `image-rendering: pixelated`，卡片图标改为最大 112px、弹窗 72px 的纯矢量缩放；新增语言按钮、端口折叠与中文要点样式。
  3. 新增 `site/i18n.js`（中英文案字典）、`site/util.js`（esc / 图标路径 / 端口要点 / Markdown）；`site/app.js` 增加 `state.lang`、`setUiLang`、双语渲染与 SVG 图标 `onerror` 回退，拆分后各文件均 ≤500 行。
  4. 新增 `tools/build_port_i18n.py` 生成 `data/port_i18n.json`：整名覆盖表 + token 词典，覆盖全部 1504 个端口名；`chapters.json` 补 `partEn` 英文篇名。
  5. `index.html` 顶栏加入「中 / EN」切换（默认中文，`localStorage` 记忆），静态文案改用 `data-i18n` 挂钩；教程正文按界面语言自动选择中/英文件。
- **备注**：端口中文要点由前端从英文原文抽取单位/默认值/范围，无法抽取则不显示，避免出现半句英文；无头浏览器实测 429 卡片渲染、80 张首批 SVG、中英切换、弹窗端口与教程正文均正常；`check_data.py` 0 错误。
