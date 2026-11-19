# 12 · 拆分、重组与文件交换

> 存盘、传阅、跨软件，模型不丢属性。

![组件连线：模型通过 Object 类型数据流在组件之间传递，拆分重组不丢属性](../assets/shots/03-rhino-interface.png)

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [ladybug_honeybee 使用分享](https://www.bilibili.com/video/BV1dzgseUE9S/)
- [正确的 Honeybee 分析模型建模姿势](https://www.bilibili.com/video/BV1pa411h7dh/)

## 本章解决什么

模型不能只活在当前的 Grasshopper 里。本章讲三件事：把模型拆开只取需要的部分；把对象存成文件再读回来；和 OpenStudio、EnergyPlus、gbXML 这些外部工具交换。关键点是：序列化（serialize）会保留属性，手工重建会丢。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Deconstruct Model]] | 拆出房间、面、窗、门、遮阳 |
| [[HB Deconstruct Object]] | 拆单个对象的面、窗、门、遮阳 |
| [[HB Dump Objects]] | 把对象写成 JSON（HBJSON）文件 |
| [[HB Load Objects]] | 从 JSON 文件读回对象 |
| [[HB Dump Compressed Objects]] | 写成压缩的 `.pkl` 文件，体积更小 |
| [[HB Load Compressed Objects]] | 读回压缩文件 |
| [[HB Object to String]] | 对象转 JSON 字符串 |
| [[HB String to Object]] | 字符串还原为对象 |
| [[HB Dump gbXML]] | 导出 gbXML 给其他能耗软件 |
| [[HB Model to OSM]] | 生成 OpenStudio / EnergyPlus 模型 |
| [[HB Load gbXML OSM IDF]] | 反读 gbXML / OSM / IDF |
| [[HB Update HBJSON]] | 旧版 HBJSON 升级到当前 schema |

## 操作步骤

1. 拆分：[[HB Deconstruct Model]] 的 `_model` 接模型，按需取 `rooms`、`faces`、`apertures`、`doors`、`shades`。
2. 存盘：[[HB Dump Objects]] 的 `_hb_objs` 接要保存的对象，`_name_` 写文件名，`_folder_` 选目录，`_dump` 设 True。
3. 读回：[[HB Load Objects]] 的 `_hb_file` 接上一步的 `hb_file`，`_load` 设 True，输出 `hb_objs` 可直接接回流程。
4. 文件太大时用 [[HB Dump Compressed Objects]]，得到 `.pkl`；读回用 [[HB Load Compressed Objects]]。它只适合 Honeybee 内部周转，不适合对外交付。
5. 想在 GH 内部传递（存进 Panel、写数据库），用 [[HB Object to String]] 和 [[HB String to Object]]。
6. 交换给能耗软件：[[HB Dump gbXML]] 出 gbXML；[[HB Model to OSM]] 需要 EPW，能直接产出 OSM / IDF。
7. 接收别人的文件：[[HB Load gbXML OSM IDF]] 的 `_model_file` 接路径，`reset_props_` 设 True 只保留几何与边界条件。
8. 旧项目打不开：[[HB Update HBJSON]] 的 `_hbjson` 接文件路径，`version_` 留空升到当前版本，`_update` 设 True。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_name_` | 项目名_版本 | 不带扩展名，组件自动补 |
| `_folder_` | 项目目录 | 留空则写到默认模拟目录 |
| `_dump` / `_load` | True | 不打开不执行 |
| `indent_` | 2 | JSON 缩进，便于人读 |
| `abridged_` | False | True 会精简字段，且不能再还原 |
| `reset_props_` | False | True 只导入几何与边界条件 |
| `version_` | 留空 | 留空升到当前版本，填如 `1.41.2` 指定版本 |
| `validate_`（Update） | True | 升级后顺手校验 |

## 常见坑

- 用 `abridged_` 存档：精简对象读不回来，只能看不能算。
- 把压缩 `.pkl` 发给同事：对方版本不同可能读不了，交付统一用 HBJSON。
- 只存了房间没存构造/计划：HBJSON 会带着房间上的属性，但独立定义的 Material、Schedule 要一起 Dump。
- 路径含中文或空格：部分引擎会失败，尽量用英文短路径。
- 反读 gbXML 后直接算：属性可能来自旧模型，先校验再改。

## 下一步

模型能存能传，进入 13：给模型配材料与构造。
