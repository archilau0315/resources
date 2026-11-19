# 14 · 运行计划、负荷与内扰

> 计划定形状，负荷定大小，模板打包。

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [Honeybee 建筑能耗设置 1](https://www.bilibili.com/video/BV1Wi4y117iw/)

## 本章解决什么

同样的房子，办公室和住宅的能耗能差一倍，差别在"怎么用"。本章先做运行计划（Schedule，0–1 的时间曲线），再做内扰对象（人、灯、设备、新风、渗透、设定点），最后用用途模板（ProgramType）打包，一次赋给房间。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Constant Schedule]] | 全年恒定值，如常开的渗透 |
| [[HB Weekly Schedule]] | 周计划，七天各 24 个值 |
| [[HB Fixed Interval Schedule]] | 按固定时间步给值 |
| [[HB Seasonal Schedule]] | 按季节切换不同计划 |
| [[HB Schedule to Data]] | 展开成逐时数据，用于画图核对 |
| [[HB People]] | 人员密度、在室计划、活动强度 |
| [[HB Lighting]] | 照明功率密度与开关计划 |
| [[HB Equipment]] | 设备功率密度与使用计划 |
| [[HB Infiltration]] | 围护结构漏风 |
| [[HB Ventilation]] | 设计新风量 |
| [[HB Setpoint]] | 制冷、供热设定温度 |
| [[HB ProgramType]] | 把上述对象打包成用途模板 |
| [[HB Blend ProgramTypes]] | 按比例混合多种用途 |
| [[HB Apply ProgramType]] | 把模板赋给房间 |
| [[HB Apply Load Values]] | 直接改房间负荷数值 |
| [[HB Search Programs]] | 从标准库检索用途模板 |
| [[HB Deconstruct ProgramType]] | 拆开模板逐项检查 |

## 操作步骤

1. 先做计划：[[HB Weekly Schedule]] 的 `_sun` 到 `_sat` 各接 24 个 0–1 的值，`_type_limit_` 填 `Fraction`。上班族可按 8 点开、18 点关。
2. 常开项（如渗透）用 [[HB Constant Schedule]]，`_values` 填 1。
3. 做人员：[[HB People]] 的 `_occupancy_sch` 接在室计划，`_activity_sch_` 可留空（默认 120 W/人）；人员密度按用途填。
4. 做照明与设备：[[HB Lighting]]、[[HB Equipment]] 的 `_schedule` 接各自计划，功率密度按房间设。
5. 做新风与渗透：[[HB Ventilation]] 用 `_flow_per_person_`（如 0.008 m³/s·人）或 `_ach_`；[[HB Infiltration]] 用 `_flow_per_ext_area`（如 0.0002 m³/s·m²）。
6. 做设定点：[[HB Setpoint]] 的 `_cooling_sch` 接温度计划，计划类型必须是 `Temperature`。
7. 打包：[[HB ProgramType]] 把 `_people_`、`_lighting_`、`_electric_equip_`、`_infiltration_`、`_ventilation_`、`_setpoint_` 接进去，`_name_` 写 `Office_Open`。
8. 赋给房间：[[HB Apply ProgramType]] 的 `_rooms` 接房间，`_program` 接模板；`overwrite_` 设 True 会清掉房间上单独的负荷覆盖。
9. 只改某一项时，用 [[HB Apply Load Values]] 或 [[HB Apply Setpoint Values]]，不要重做整个模板。
10. 检查：[[HB Deconstruct ProgramType]] 看 8 个输出是否都有值；[[HB Schedule to Data]] 接计划，再用 `LB Hourly Plot` 看曲线。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_values` | 0–1 | 分数计划，不是人数或瓦数 |
| `_type_limit_` | Fraction / Temperature / Activity Level | 必须与用途匹配 |
| 人员密度 | 0.05–0.2 人/m² | 办公室约 0.1 |
| 照明功率 | 5–12 W/m² | 办公室约 9 |
| 设备功率 | 5–15 W/m² | 含电脑、打印机 |
| `_flow_per_person_` | 0.008–0.01 m³/s·人 | 约 30 m³/h·人 |
| `_flow_per_ext_area` | 0.0001–0.0003 m³/s·m² | 0.0001 为气密建筑 |
| 制冷设定 | 24–26 °C | 夏季 |
| 供热设定 | 20–22 °C | 冬季 |
| `_ratios_` | 总和 = 1 | 混合用途的比例 |

## 常见坑

- 计划填了人数或瓦数：计划只收 0–1，实际大小由负荷对象给。
- 温度计划用了 Fraction 类型：模拟直接报类型不匹配。
- 模板缺 `_setpoint_`：赋给有空调的房间会失败，先补设定点。
- 改了模板忘了重赋：房间拿到的是副本，必须重新 [[HB Apply ProgramType]]。
- 把新风当渗透：[[HB Ventilation]] 是设计新风，[[HB Infiltration]] 是漏风，两套对象。
- 混合比例不归一：[[HB Blend ProgramTypes]] 的 `_ratios_` 加起来要等于 1。

## 下一步

负荷与计划齐了，进入 15：选空调系统与生活热水。
