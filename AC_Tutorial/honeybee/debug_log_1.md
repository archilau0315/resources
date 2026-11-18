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
- **模块**：组件安装、	ools/parse_components.py、	ools/extract_icons.py、data/*.json、
eadme.md
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
- **备注**：端口中文要点由前端从英文原文抽取单位/默认值/范围，无法抽取则不显示，避免出现半句英文；无头浏览器实测 429 卡片渲染、80 张首批 SVG、中英切换、弹窗端口与教程正文均正常；`check_data.py` 0 错误。静态资源统一加 `?v=20261118`，避免浏览器命中旧缓存。

### 10. 原厂蜜蜂品牌图标 + 端口详细说明补中文

- **时间**：2026-11-18 12:10
- **模块**：assets/brand/*、tools/build_brand.py、site/{index.html,style.css,app.js,util.js,i18n.js}、readme.md
- **变更**：
  1. 下载 Ladybug Tools 官方蜜蜂图标（`https://www.ladybug.tools/assets/img/honeybee.png`，203×203），新增 `tools/build_brand.py`：VTracer 描摹为 `assets/brand/honeybee.svg`（补 `viewBox=\"0 0 203 203\"`），并用 resvg-py 渲染 `honeybee-180.png` / `honeybee-32.png`。
  2. `index.html` 顶栏 `HB` 文字块换成蜜蜂矢量图标，`<head>` 增加 SVG favicon、32px PNG 与 apple-touch-icon（均带 `?v=20261118`）；`style.css` 的 `.brand-mark` 改为浅底描边容器 + `img` 等比填充，暗色主题单独配色。
  3. 端口“详细说明”折叠块升级：始终包含「中文说明」段，中文模式下再附「English original」原文；英文模式折叠块保留中文说明（`Details · 中文说明`）。
  4. `site/util.js` 新增 `portFacts` / `portZhDetail`：抽取默认值、单位、范围、括号区间、枚举、布尔开关、None 语义、库内标识符、Rhino 单位、列表数据、涉及对象（Room/Face/Construction/Schedule/Sky 等），统一生成中文；`portNote` 复用同一解析结果。
  5. `site/i18n.js` 增加 `portDetail`、`zhNotes` 中英文案；`style.css` 补 `.port-d-zh / .port-d-en / .port-d-label` 样式，折叠区高度放宽到 220px。
- **备注**：全量 2553 条端口说明 100% 生成中文说明，平均 34 字；无头浏览器实测品牌蜜蜂图标加载（naturalWidth 203）、中文模式与 EN 模式下折叠块均含中文说明与英文原文；临时校验脚本已删除。

### 11. 图标二次矢量化：消除 4px 阶梯

- **时间**：2026-11-18 15:40
- **模块**：tools/vectorize_icons.py、assets/icons/svg/*、site/util.js、readme.md
- **问题**：上一版直接把 24px 图 4 倍 NEAREST 放大后描摹，矢量里保留了 4px 一个台阶的原始像素轮廓，放大到 112px 仍是锯齿。
- **变更**：
  1. 重写 `tools/vectorize_icons.py` 流水线：24px → 6 倍 LANCZOS 放大到 144×144 → 用原图调色板量化还原颜色（去除插值杂色）→ 透明边界按 alpha>110 取轮廓 → VTracer 描摹（filter_speckle 8、color_precision 5、layer_difference 24、corner 60、path_precision 1）→ 补 `viewBox="0 0 144 144"`。
  2. 429 个 SVG 全部重生成：平均 17.5KB、最大 52KB，零失败；1 个画布单位≈0.6 屏幕像素，阶梯降为亚像素。
  3. `site/util.js` 的 `iconSrc` 加 `?v=20261118b`，强制浏览器丢弃旧 SVG 缓存。
  4. readme 的图标章节与能力表同步更新为 144 画布 + 调色板还原流程。
- **验证**：脚本校验 429 个 SVG 均含 `viewBox="0 0 144 144"` 与路径；浏览器把 6 个图标渲染到 224px，边缘像素呈 88→255、32→159→255 的渐变抗锯齿，无 0/255 突变，无裁切。
- **备注**：临时参数对比脚本与预览页已删除；PNG 回退仍保留 24/48/96 三档。


### 12. 资源页卡片改用原厂蜜蜂 + 文字，品牌图回归 PNG

- **时间**：2026-11-18 16:30
- **模块**：tools/build_cover.py、tools/build_brand.py、cover.svg、assets/brand/*、site/index.html、resources/index.html、readme.md
- **问题**：资源页 Honeybee 卡片缩略图只是渐变底 + 文字；品牌蜜蜂此前用 VTracer 描摹成 SVG，透明底被描成实心块，显示为黑底方块。
- **变更**：
  1. 重写 `tools/build_cover.py`：读取官方 `assets/brand/honeybee.png`（203×203 RGBA），base64 内嵌到 300×300 `cover.svg` 的白色圆盘（r=78，描边 #f2b33d）中央，尺寸 118×118；下方三行文字 HONEYBEE、组件速查 · 系统教程、Ladybug Tools 1.10 · 429 components · 26 tutorials，右下 KBIT AI 角标。SVG 内嵌 base64 是因为 cover 以 `<img>` 加载，外链 SVG 会被浏览器拦截。
  2. 重写 `tools/build_brand.py`：不再描摹 SVG，仅用官方 PNG 经 LANCZOS 导出 `honeybee.png`（203）、`honeybee-180.png`、`honeybee-32.png`，透明底保持正确。
  3. `site/index.html` 顶栏品牌图、favicon、apple-touch-icon 全部切到 PNG（`?v=20261118c`）。
  4. `resources/index.html` 卡片缩略图加 `?v=20261118c` 破缓存；描述文案由 1.9 / 412 / 22 更新为 1.10 / 429 / 26（中英各一处，共三处）。
  5. readme 的目录树、流水线、图标章节同步改为 PNG 品牌图 + `build_cover.py`。
- **验证**：resvg 渲染 cover.svg 到 300px PNG 后采样——logo 区 dark=0.255 / light=0.40 / amber=0.218（透明底未变黑块），标题行与中文行均有亮色文字；`honeybee.png` 26692B、`-180` 33628B、`-32` 3026B。
- **备注**：临时校验脚本 `_cover_check.py` 与 `_cover.png` 已删除。


### 13. 版面留白收紧 + 图标边缘去浑浊重制

- **时间**：2026-11-18 12:24
- **模块**：site/style.css、site/util.js、site/index.html、tools/vectorize_icons.py、assets/icons/svg/*（429）
- **问题**：① 大屏下版心 1400px、左右各 24px 内边距，1920 屏两侧各空 260px，内容显得小而散；② 图标放大后边缘发虚、有灰雾光晕、形状像水泡。
- **根因**：旧脚本 `im.convert('RGB')` 取调色板时把透明区的黑色和抗锯齿混合色当成图标颜色，描摹后每条边多一圈浑浊过渡；同时样条（spline）拟合会让轮廓外鼓。
- **布局变更**：`.layout` 版心 1400→1760px、左右内边距 24→16px；`.content` 内边距 28/24→22/20px；`.grid` 最小列宽 196→192px、间距 18→16px；`.topbar` 左右 24→18px。1920 屏两侧留白由 260px 降到 80px（实测 1278 视口下右侧仅 15px）。
- **图标变更**（tools/vectorize_icons.py 重写）：
  1. RGBA 先预乘 alpha 再用 LANCZOS 放大 12 倍（24→288），透明黑不再渗进颜色；
  2. 调色板只从 alpha>200 的实色像素提取（12 色），杜绝混合色进入矢量；
  3. alpha 施加 0.85 gamma 后按 0.5 阈值二值化，细线墨量保持 1.00；
  4. vtracer 改 `polygon` + `cutout`，参数 (6,8,16,60,2.0,10,45,2)，补 `viewBox="0 0 288 288"`。
- **验证**（8~10 个随机图标，渲染 128px 与原图对比）：形状 IoU 0.955→0.984（初版）／0.957（含 gamma），颜色偏差 6.39→3.3（降 48%），墨量比 1.00，429 个 SVG 全部含 288 viewBox、0 失败、平均 11.8KB（旧 17.5KB），最大 45KB；112px 实际显示尺寸下边缘过渡 1–2px。
- **备注**：图标 URL 版本号升 `?v=20261118d`，CSS/JS 同步；临时评估脚本已删除。

### 14. 图标去“水泡感”：取消轮廓外扩 + 恢复原厂配色层次

- **时间**：2026-11-18 15:40
- **模块**：tools/vectorize_icons.py、assets/icons/svg/*（429）、site/util.js、site/index.html、readme.md
- **问题**：第 13 版图标仍被反馈“有水泡感”，边缘发胖、内部大片平色、渐变消失。
- **根因**：① alpha 用 0.85 gamma 后按 128 二值化，实际阈值降到约 44%，轮廓整体外扩；② 调色板只有 12 色、`layer_difference=16`，把原厂最多 22 色的渐变与高光压平成色块；③ `filter_speckle=6` 抹掉细小结构。三者叠加，图标看起来像发胖的软色块。
- **变更**：
  1. 去掉 alpha gamma，直接按 50% 覆盖率（>128）二值化，轮廓不外扩；
  2. 调色板 12→32 色，`layer_difference` 16→6，`filter_speckle` 6→2，保留渐变与高光；
  3. 仍为 `polygon` + `cutout`，288×288 画布 + viewBox；`corner_threshold=60`、`length_threshold=2.0` 不变。
- **验证**（10 个随机图标，288 渲染）：轮廓外溢 11.27%→7.75%，轮廓缺失 3.86%→6.90%（内外基本平衡，不再单向发胖），颜色偏差 7.02→4.84（降 31%）；429 个 SVG 全部生成、0 失败，平均 22.1KB、最大 58.7KB、总计 9.24MB，全部含 `viewBox="0 0 288 288"`。
- **备注**：图标 URL 版本号升 `?v=20261118e`，i18n/util/app 同步；临时脚本 `_color_probe.py`、`_shape_probe.py`、`_check_svg.py` 用后删除。

### 15. 图标颜色交界硬边化：合并近似色 + 填充吸附

- **时间**：2026-11-18 13:20
- **模块**：tools/vectorize_icons.py、assets/icons/svg/*（429）、site/util.js、site/index.html、readme.md
- **问题**：第 14 版图标轮廓已正常，但各颜色之间的边界仍不够清晰利落，整体仍有薄雾感。
- **根因**：调色板本身没问题，问题在 vtracer 输出端——它会为同一色系生成大量仅差 1~2 个色阶的填充色（hb-room 249 个 path 里有 187 个不同 fill，lb-adaptive-comfort 38 个），相邻色块差值小于人眼分辨阈值，放大后表现为同色系薄层和虚边。
- **变更**：
  1. `prepare()` 改为直接从量化后的不透明像素统计实际颜色与出现次数（原实现用调色板索引取色，索引不连续会取错色并抛 IndexError）；
  2. 按出现次数保留主色，RGB 欧氏距离小于 `MERGE=12` 的近似色合并为一个；
  3. 新增 `snap_fills()`，描摹后把每个 `fill` 吸附到最近的主色，`finalize()` 统一完成吸附与 `viewBox` 补全。
- **验证**：hb-room 唯一填充色 187→20、lb-adaptive-comfort 38→8；429 个 SVG 唯一色数最大 32、平均 15.8，无一超过调色板上限；resvg 全量渲染 429 个 0 失败，半透明像素占比平均 2.73%（仅轮廓抗锯齿）；平均 20.6KB、最大 57.9KB。
- **备注**：图标 URL 版本号升 `?v=20261118f`，`util.js` 同步升版；临时脚本 `_progress.py`、`_pal_probe.py`、`_verify.py`、`_render_check.py`、`_svg_stat.py`、`_crisp_probe.py` 用后删除。

### 16. 图标精细化：配色阶数与近似色阈值取平衡

- **时间**：2026-11-18 13:50
- **模块**：tools/vectorize_icons.py、assets/icons/svg/*（429）、site/util.js、site/index.html、readme.md
- **背景**：第 15 版把近似色阈值设到 12，清掉了虚边，但收色偏猛——渐变被压成少数色块，色阶跨度偏大，边缘观感偏硬。
- **变更**：
  1. 调色板 32 → 48 色，为原始渐变保留足够色阶；
  2. 近似色合并阈值 12 → 6，只清掉肉眼不可分（相距 1~2 个色阶）的冗余填充层，保留真实过渡；
  3. 其余不变：预乘 alpha 的 12 倍 LANCZOS 放大、50% alpha 轮廓、polygon 描摹、`fill` 吸附主色板、288 画布 + viewBox。
- **参数对比**（8 个代表图标，渲染 24/48/112 与 24px 原图比对）：32 色/阈值 12 组合颜色误差 8.41；32 色/6 为 8.32；48 色/6 为 7.26；64 色/6 为 6.96 但半透明占比升到 11.16、体积 19.8KB（best 平衡点取 48 色/6）；16 倍放大与 spline 模式均更差（IoU 降至 0.962、体积增至 63KB），弃用。
- **多尺寸验证**（429 个全量，与 24px 原图 LANCZOS 对比）：24px IoU 0.965 / 48px 0.978 / 96px 0.984 / 112px 0.981 / 224px 0.981；颜色误差 12.28 / 8.87 / 8.68 / 8.67 / 8.98；半透明像素占比 45.2% / 33.7% / 14.6% / 12.7% / 4.1%（小尺寸下为正常抗锯齿）。唯一填充色平均 24.8、最大 47；平均 22.7KB、最大 60.1KB、0 失败。
- **备注**：图标 URL 版本号升 `?v=20261118g`；临时脚本 `_fine_probe.py`、`_size_check.py` 与 `_probe_out/` 用后删除。

### 17. 组件速查模块重设计 + 描边修复方案撤回

- **时间**：2026-11-18 15:20
- **模块**：site/style.css、site/util.js、site/index.html、tools/vectorize_icons.py、assets/icons/svg/*（429）
- **背景**：
  1. 用户反馈「教程页里的组件徽章长得都一样、点哪个都不变」→ 排查发现 `inline()` 把 `[[HB Room]]` 渲染成统一风格的 `.doc-chip` 徽章，1163 处散布在 26 篇教程 md 中，每篇都有，所以看起来都一样。
  2. 用户随后反馈「图标描边断断续续」→ 尝试给 vtracer 每个 path 补同色 `stroke-width=0.8` 消接缝，但验证显示 **IoU 从 0.967 掉到 0.952、体积从 22.7KB 涨到 30.9KB**，且接缝并未减少（因为 cutout 模式下缝隙比 stroke 宽度大），方案证伪。
  3. 同时组件速查卡片 CSS 有硬编码尺寸：`.card-icon img` 强制 76% + `max-width: 112px`，`.modal-icon img` 硬编码 72px——SVG 是矢量却被按像素锁死，卡片变大时图标不会跟着放大，比例失调。
- **变更**：
  1. `inline()` 里 `[[组件名]]` 改为直接输出纯文本，不再渲染徽章——组件图标和跳转只在组件速查页出现（`openByName` 函数保留）。
  2. 从 `vectorize_icons.py` 删除 `close_seams()` 与描边逻辑，回到 48 色/阈值 6 的干净 SVG；全量重生成 429 个，平均 22.7KB、IoU 0.967。
  3. 组件速查卡片 CSS 重写：`.card-icon img` 改为 `width/height: 100%; object-fit: contain`（随容器等比缩放，移除 76% 和 max 限制）；`.card-icon` 加 `padding: 10px` 让图标有呼吸空间；`.grid` 最小从 192px 调到 200px；`.modal-icon` 从 88px 增到 96px，内部 img 也改为 100% 自适应。
  4. 版本号统一升 `?v=20261118j`（iconSrc、style.css、util.js）。
- **验证**：429 SVG 全量渲染 IoU 0.967、平均 22.7KB、0 失败；hb-room.svg 确认无 stroke 残留、231 paths、231 fills。
- **备注**：临时脚本 `_stroke_probe.py`、`_ascii_check.py`、`_seam_probe.py`、`_seam_probe2.py`、`_stroke_fix.py`、`_final_check.py` 与 `_probe_out/` 用后删除。

### 18. 教程配图改用真实画布截图，弃用自绘连线示意图

- **时间**：2026-11-19 09:10
- **模块**：doc/zh/{08-first-model,12-serialize-exchange,16-simulation}.md、doc/en 同名三篇、assets/flows（删除）、tools/build_flow.py（删除）
- **背景**：为补「组件连接」配图，先按真实数据流自绘了 SVG 连线示意图（`tools/build_flow.py`，图标内联、10 节点、渲染校验通过），用户反馈「不够真实，应该用实际电池组件连接的图片」，明确要求官方真实截图。
- **官方素材调研结论**：
  1. `docs.ladybug.tools/ladybug-tools-academy`（39 页，llms.txt 全量索引）全部为 YouTube 嵌入，**零图片**；
  2. `honeybee-primer`、`hb-energy-primer`、`hb-radiance-primer` 只有单个组件的输入输出说明图（1000×800 RGBA），无画布连线；
  3. `lbt-grasshopper-samples` 仓库只有 `.gh` 文件，无任何截图；
  4. `ladybug-primer/.gitbook/assets` 仅 24 张旧版组件图；
  5. **Food4Rhino 官方插件页是唯一直连可下的真实截图来源**，共 10 张，其中 3 张为画布连线图。
- **变更**：把 3 张真实连线图补进此前缺图的核心章节（中英各 3 处，共 6 处）：
  - `02-grasshopper.png`（完整画布）→ 08 建出第一个模型；
  - `03-rhino-interface.png`（组件连线）→ 12 拆分重组与交换；
  - `21-case-overview.png`（全流程）→ 16 模拟设置与运行。
  同时删除自绘示意图、6 张视频候选帧、接触表与全部临时脚本，清理 `tmp/`（227MB 视频）。
- **备注**：后续若需更多真实连线图，只能走视频抽帧（本机 yt-dlp + opencv 可用，无 ffmpeg，需整段下载后抽帧；OpenCV 在中文路径下 `imwrite` 静默失败，须用 `imencode().tofile()`）。
