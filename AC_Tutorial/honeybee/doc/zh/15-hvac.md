# 15 · HVAC 与生活热水

> 先选系统类型，再谈效率参数。

## 本章解决什么

第 13、14 章算出来的是**负荷（Load）**：房间需要多少冷热量。负荷不等于能耗，中间还差一套设备。本章把负荷接到设备上，有三条路线：

- **理想空调（Ideal Air Loads）**：不建设备，只回答“需要多少”，用于基线对比。
- **模板系统**：填一个系统名称，自动生成整套设备，配置快、精度够用。
- **详细系统（Detailed HVAC）**：用 Ironbug 逐台设备搭，只在特殊项目使用。

生活热水分两半：**用多少水**在第 14 章的用途模板里定（[[HB Service Hot Water]]），**用什么加热**在本章定（[[HB SHW System]]）。

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB IdealAir]] | 理想空调 | 只算负荷，最快 | `_rooms`、`_heat_limit_` |
| [[HB All-Air HVAC Templates]] | 全空气模板 | 取系统名称列表 | 无 |
| [[HB All-Air HVAC]] | 全空气系统 | 变风量 / 定风量 | `_rooms`、`_system_type` |
| [[HB DOAS HVAC Templates]] | 新风模板 | 取系统名称列表 | 无 |
| [[HB DOAS HVAC]] | 独立新风 | 新风 + 末端 | `_system_type`、`doas_avail_sch_` |
| [[HB HeatCool HVAC]] | 冷热末端 | 只供热供冷，不带新风 | `_system_type`、`_vintage_` |
| [[HB Detailed HVAC]] | 详细系统 | 接 Ironbug 系统 | `_hvac_system` |
| [[HB SHW Templates]] | 热水模板 | 取系统名称列表 | 无 |
| [[HB SHW System]] | 生活热水系统 | 热水设备与损失 | `_system_type`、`_efficiency_` |
| [[HB Set Conditioned]] | 设置空调与否 | 标记非空调房间 | `_conditioned` |
| [[HB Building Vintages]] | 建筑年代 | 取设备效率年代 | 无 |

## 操作步骤

1. 先用 [[HB IdealAir]] 跑一遍负荷，`_heat_limit_` 与 `_cool_limit_` 都填 `autosize`，得到没有设备上限的基线。
2. 定系统层级：整栋集中空调选全空气；新风与末端分开选 DOAS + HeatCool；只有暖气或风机盘管就只接 HeatCool。
3. 把 [[HB All-Air HVAC Templates]] 的 `values` 接到 [[HB All-Air HVAC]] 的 `_system_type`，不要手打名称。
4. `_vintage_` 接 [[HB Building Vintages]] 的 `values`，默认 `ASHRAE_2019`，它决定水泵、锅炉、冷机的效率。
5. 有热回收就填 `sensible_hr_` 与 `latent_hr_`（0–1）；显热板换约 0.5，焓轮显热可到 0.81、潜热 0.76。
6. 人员波动大的房间把 `dcv_` 设为 `True`，新风量随人数变化，可省风机与冷热量。
7. 热水：先在用途模板里用 [[HB Service Hot Water]] 定每人或每平米用水量，再用 [[HB SHW System]] 定设备；`_system_type` 取自 [[HB SHW Templates]]。
8. 楼梯间、机房、储藏间等不空调的空间，用 [[HB Set Conditioned]] 把 `_conditioned` 设为 `False`。
9. 各组件输出的 `rooms` 串回同一条模型主线，交给第 16 章运行。

## 参数怎么填

| 参数 | 取值 | 建议 |
|---|---|---|
| `_system_type` | 文本 | 必须来自对应模板组件的 `values` |
| `_vintage_` | 文本 | 默认 `ASHRAE_2019`，与项目年代一致 |
| `sensible_hr_` | 0–1 | 板式 0.5，焓轮 0.7–0.81 |
| `latent_hr_` | 0–1 | 只有焓轮有效，最高 0.76 |
| `_economizer_` | 文本 | 需要免费冷却时启用，类型见组件说明 |
| `dcv_` | 布尔 | 会议室、教室设 `True` |
| `_efficiency_`（热水） | 0–1 或 COP | 燃气 0.8，热泵 2–3，电 1 |
| `_condition_` | °C | 水箱环境温度，默认 22 |
| `_loss_coeff_` | W/K | 默认 6，保温好可降低 |
| `_heat_limit_` / `_cool_limit_` | W 或文本 | 负荷基线填 `autosize` |

## 常见坑

1. **把理想空调当真实能耗**：它只算需要的冷热量，不含风机、水泵与效率损失，EUI 会明显偏低。
2. **系统名称手打**：`_system_type` 拼错会直接报错，务必从模板组件的 `values` 里取。
3. **忘记设置非空调房间**：楼梯间、管井被当成空调区，负荷与面积统计都虚高。
4. **DOAS 只接新风不接末端**：显热负荷无人处理，未满足设定点的小时数（unmet hours）会飙升。
5. **只建设备不设用水量**：热水系统没有负荷可算，`hot_water` 结果始终为 0。

## 下一步

系统配好后，进入 [第 16 章 · 模拟设置与运行](16-simulation.md)：设定时段、步长、输出，然后真正跑一次 EnergyPlus。
