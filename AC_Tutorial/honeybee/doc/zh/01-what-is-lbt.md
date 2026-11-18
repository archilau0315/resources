# 01 · Ladybug Tools 是什么

> 一套跑在 Grasshopper 里、能算能耗与采光的免费建筑性能工具集。

## 本章解决什么

Ladybug Tools 是一组免费的 Grasshopper 插件，把 Rhino 里的体量变成能计算的数据：一年晒多少太阳、室内冷不冷、采光够不够、全年用多少电。它不是一个按钮出结果的软件，而是把「气象数据 → 模型 → 属性 → 模拟引擎 → 图表」拆成一串电池，由你自己接线。

四个标签页分工不同：

| 标签页 | 负责 | 底层引擎 |
|---|---|---|
| Ladybug（瓢虫） | 气象、太阳、舒适度、图表 | 本地计算；天空辐射借用 Radiance 的 gendaymtx |
| Honeybee（蜜蜂） | 房间、面、窗等几何与属性 | 不跑计算，只产出模型 |
| HB-Energy | 能耗、负荷、空调、生活热水 | OpenStudio → EnergyPlus |
| HB-Radiance | 采光、日照、辐射 | Radiance |

1.9.x 共 412 个组件，四页分别是 120 / 70 / 139 / 83 个。同门的 Dragonfly（蜻蜓）做城市街区尺度，本教程不涉及；Pollination 既是官方一键安装器，也是云端模拟平台，安装那一步会用到。

与 0.x 老教程的区别：0.x 时代 Ladybug 和 Honeybee 分开安装、各带版本号，Honeybee 直接拼 EnergyPlus 的 idf 文本；1.x 统一了版本与安装器，Honeybee 先把模型写成 HBJSON（一种 JSON 格式的模型文件），再翻译成 OpenStudio 的 OSM，最后交给 EnergyPlus。网上大量 0.x 接线图在 1.x 里已经对不上，认准组件名前的 `LB` / `HB` 前缀最稳。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB Versioner]] | 检查并更新整包组件与核心库 |
| [[HB Check Versions]] | 显示本机各引擎版本，验安装 |
| [[LB Import EPW]] | 读入 .epw 气象文件，输出 Location 与逐时数据 |
| [[HB Room]] | 用一组面围合成房间，是模拟的基本单元 |
| [[HB Model]] | 把房间、遮阳汇总成可模拟的模型 |
| [[HB Model to OSM]] | 模型翻译成 OpenStudio 模型并可直接运行 |
| [[HB Run OSM]] | 运行已有 .osm，输出 sql 结果文件 |
| [[HB Annual Daylight]] | 跑 Radiance 全年逐时采光 |
| [[HB Read Room Energy Result]] | 从 sql 里读房间的冷热负荷与能耗 |

## 操作步骤

1. 打开 Grasshopper，确认顶部能看到 Ladybug、Honeybee、HB-Energy、HB-Radiance 四个标签页；缺页说明没装好，先看下一章。
2. 拖出 [[HB Check Versions]]，看 `energyplus`、`openstudio`、`radiance` 三行是否有版本号，没有就是引擎缺失。
3. 拖出 [[LB Import EPW]]，`_epw_file` 上右键 Set One File Path，指向本地 .epw；接一个 Panel 看 `location` 是否显示城市名与经纬度。
4. 在 Rhino 里画一个封闭盒子（单位设为米），炸开成 6 个面，全部接给 [[HB Room]] 的 `_faces`，得到 `room`。
5. `room` 接 [[HB Model]] 的 `rooms_`，得到 `model`；把 `model` 接 [[HB Model to OSM]] 的 `_model`，`_epw_file` 接同一个 .epw。
6. 把 `_write` 设为 True，`run_` 设为 True，运行一次。等右下角计时结束后，`sql` 输出就是结果文件。
7. 想试采光，就 `model` → `HB Sensor Grid from Rooms` → [[HB Annual Daylight]]，`_wea` 可直接填 .epw 路径，`_run` 设 True。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `_epw_file` | .epw 的完整路径，用纯英文目录，别用中文和空格 |
| `_model`（HB Model to OSM） | 至少含一个 Room 的模型；空模型会直接报错 |
| `_sim_par_` | 不接就用默认设置，第一次跑通可以先留空 |
| `_write` | True，才会真正写出 osm 与 idf |
| `run_` | True 或整数 2（静默运行，不弹命令行窗口） |
| `_faces`（HB Room） | 必须围成封闭体量，缺面会得到开口房间 |

## 常见坑

- 把 Honeybee 当成「点了就出结果」：它只产模型，不算数，必须经过 HB-Energy 或 HB-Radiance。
- 用 0.x 教程照抄：老的 `Honeybee_Honeybee`、`Run Energy Simulation` 这类组件在 1.x 里已经没了。
- Rhino 单位是毫米却按米填数值，房间会缩得像灰尘，EnergyPlus 报面积异常。
- 只装 Grasshopper 组件、没装引擎，组件全绿但一运行就报 `Solution exception`。
- 把 Dragonfly 的教程混进来，找不到对应的 `DF` 组件就以为装漏了。

## 下一步

先把环境装干净、能自检，再谈接线：读 [02 · 安装与自检](02-install.md)。
