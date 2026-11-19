# 16 · 模拟设置与运行

> 参数管精度，运行管产物。

![完整能量模拟工作流：气象、模型、参数汇入模拟组件，输出结果文件](../assets/shots/21-case-overview.png)

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [Honeybee 建筑能耗设置 1](https://www.bilibili.com/video/BV1Wi4y117iw/)
- [从零开始的 Honeybee 自然通风模型建模及分析](https://www.bilibili.com/video/BV1X3411W7rt/)

## 本章解决什么

模型、气象、参数三样齐了，才是一次完整的能量模拟。本章做三件事：

- **把设置组装起来**：时段、时间步长、阴影算法、输出变量，最后汇总成一个参数对象。
- **跑起来**：HB-Energy 基于 OpenStudio 与 EnergyPlus，提供 OSM、IDF、OSW 三种入口。
- **拿到产物**：`sql` 结果库、`zsz` 设计日负荷、`rdd` 可用变量清单、`html` 汇总报表。

三种运行方式的区别：**OSM** 是 OpenStudio 模型，可继续翻译和模拟；**IDF** 是 EnergyPlus 原生输入，直接运行；**OSW** 是工作流脚本，按步骤执行 Measure。日常用 OSM 就够。

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB Simulation Output]] | 模拟输出设置 | 勾选要哪些结果 | `zone_energy_use_`、`_report_frequency_` |
| [[HB Simulation Control]] | 模拟控制 | 算不算选型、跑不跑全年 | `_do_zone_sizing_` |
| [[HB Shadow Calculation]] | 阴影计算设置 | 算法与更新频率 | `_calc_method_`、`_update_method_` |
| [[HB Sizing Parameter]] | 设备选型参数 | 设计日与放大系数 | `ddy_file_`、`_cooling_fac_` |
| [[HB Simulation Parameter]] | 模拟参数 | 汇总全部设置 | `_run_period_`、`_timestep_` |
| [[HB Model to OSM]] | 模型转 OSM | 一步翻译，可直接运行 | `_write`、`run_` |
| [[HB Run OSM]] | 运行 OSM | 分步运行已有 OSM | `_translate`、`run_` |
| [[HB Run IDF]] | 运行 IDF | 直接跑 IDF | `_idf`、`_run` |
| [[HB Run OSW]] | 运行 OSW | 按工作流运行 | `_osw`、`_translate` |
| [[HB Annual Loads]] | 全年负荷 | 只求负荷，不看设备 | `_rooms`、`_epw_file` |
| [[HB Peak Loads]] | 峰值负荷 | 设计日峰值，用于选型 | `_ddy_file` |

## 操作步骤

1. 先过一遍 [[HB Validate Model]]，有 `SEVERE` 或 `ERROR` 就先修模型，别急着跑。
2. 输出：[[HB Simulation Output]] 勾 `zone_energy_use_`、`comfort_metrics_`，`_report_frequency_` 选 `Hourly`；不确定就先少勾，文件小、跑得快。
3. 控制：[[HB Simulation Control]] 默认三项选型都为 `True`，`_for_run_period_` 为 `True`。
4. 阴影：[[HB Shadow Calculation]] 默认每 30 天更新一次；遮阳构件少于约 200 个时用 `PolygonClipping` 更快。
5. 选型：[[HB Sizing Parameter]] 的 `ddy_file_` 指向与 EPW 同名的 `.ddy`，`_heating_fac_` 1.25、`_cooling_fac_` 1.15 是常用值。
6. 汇总：以上全部接入 [[HB Simulation Parameter]]，再补 `_north_`、`_run_period_`（留空为全年）、`_timestep_`（默认 6）、`_terrain_`（默认 `City`）。
7. 运行，三选一：
   - 最省事：[[HB Model to OSM]] 的 `_write = True`、`run_ = True`，直接出 `sql`。
   - 分步：[[HB Model to OSM]] 只写 → [[HB Run OSM]]，`_translate = True`、`run_ = True`。
   - 已有文件：[[HB Run IDF]] 或 [[HB Run OSW]]（`_translate = True`）。
8. 先看 `report`，出现 `Simulation Failed` 就别读结果，打开生成的 `.err` 找第一条错误。
9. 把 `sql`、`zsz`、`rdd`、`html` 交给第 17 章。

## 参数怎么填

| 参数 | 单位 / 取值 | 建议 |
|---|---|---|
| `_timestep_` | 次/小时 | 6（默认）；精度优先可到 10–12，速度会变慢 |
| `_run_period_` | AnalysisPeriod | 留空 = 全年 |
| `_terrain_` | 文本 | `City` / `Urban` / `Suburbs` / `Country` / `Ocean` |
| `_report_frequency_` | 文本 | `Hourly`；只要月度就改 `Monthly` |
| `_heating_fac_` | 倍数 | 1.25 |
| `_cooling_fac_` | 倍数 | 1.15 |
| `_cpu_count_` | 个 | 留空 = CPU 数减 1 |
| `_translate` | 布尔 | Run OSM / Run OSW 必须为 `True` |
| `run_` | 布尔或 2 | `True` 显示批处理窗口，`2` 静默运行 |
| `add_str_` | 文本 | 仅高级用途，可追加 EnergyPlus 原生对象 |

## 常见坑

1. **只写 OSM 不运行**：`run_` 没开，`sql` 输出为空，常被误判为模拟失败。
2. **DDY 与 EPW 不配套**：设计日取错城市，峰值负荷偏大或偏小，设备选型跟着错。
3. **输出全勾且用 Timestep 频率**：`sql` 可达数 GB，Grasshopper 直接卡死。按分析目标勾。
4. **路径含中文或空格**：OpenStudio 命令行找不到文件，报错信息还很含糊。项目目录用英文。
5. **模拟参数没接全**：`_sim_par_` 留空会使用默认参数，之前设的阴影、选型全部失效。

## 下一步

拿到结果文件后，进入 [第 17 章 · 读结果与看图](17-results.md)：先看总量，再拆分项，最后落到空间分布。
