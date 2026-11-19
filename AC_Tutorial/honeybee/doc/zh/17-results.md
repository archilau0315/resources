# 17 · 读结果与看图

> 先看总量，再看分项，最后看分布。

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [从零开始的 Honeybee 自然通风模型建模及分析](https://www.bilibili.com/video/BV1X3411W7rt/)
- [Honeybee 建筑能耗设置 1](https://www.bilibili.com/video/BV1Wi4y117iw/)

## 本章解决什么

一次能量模拟会生成 `sql`、`zsz`、`html` 等文件。`sql` 是数据库，不能直接画图；本章用 HB-Energy 的 Result 组件把它翻译成带时间标签的**数据集合（Data Collection）**，再回答五个问题：

- 这栋楼一年用多少能？——**EUI（能耗强度）**
- 哪个分项最费？——分项能耗与热负荷平衡
- 设备够不够大？——峰值负荷与选型结果
- 哪个房间最差？——房间着色与空间分布
- 人舒不舒服？——温度、湿度、未满足小时数

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB End Use Intensity]] | 终端能耗强度 | 总量与分项 EUI | `_sql`、`ip_` |
| [[HB Carbon Emission Intensity]] | 碳排放强度 | kg CO₂/m² | `_loc_kgMWh`、`_year_` |
| [[HB Read Room Energy Result]] | 读取房间能耗 | 逐时冷热、照明、设备、热水 | `_sql` |
| [[HB Thermal Load Balance]] | 热负荷平衡 | 拆解负荷来源 | `_rooms_model`、各分项数据 |
| [[HB Peak Loads]] | 峰值负荷 | 设计日峰值 W | `_rooms`、`_ddy_file` |
| [[HB Read Zone Sizing]] | 读取热区选型 | 从 zsz 读逐时负荷 | `_zsz` |
| [[HB Color Rooms]] | 房间结果着色 | 空间分布 | `_data`、`_rooms_model` |
| [[HB Color Faces]] | 面结果着色 | 表面温度、得热 | `_data`、`_hb_objs` |
| [[HB Read Room Comfort Result]] | 读取房间舒适 | 温度、湿度、unmet | `_sql` |
| [[HB PMV Comfort Map]] | PMV 舒适度图 | 空间热舒适 | `_model`、`_epw` |
| [[HB Read Thermal Matrix]] | 读取热工矩阵 | 载入舒适度 CSV | `_comf_result`、`_load` |
| [[HB Visualize Thermal Map]] | 可视化热力图 | 逐时切片 | `_comf_mtx`、`_mesh` |
| [[LB Monthly Chart]] | 月度图表 | 月度柱状对比 | 月度数据集合 |
| [[LB Hourly Plot]] | 逐时曲线 | 全年曲线 | 逐时数据集合 |

## 操作步骤

1. 先打开模拟生成的 `html` 汇总报表，核对面积、EUI 与未满足小时数（unmet hours），确认结果不是“跑歪了”。
2. 总量：[[HB End Use Intensity]] 的 `_sql` 接上，看 `eui`；`eui_end_use` 与 `end_uses` 一一对应，得到供暖、制冷、照明、设备分项。
3. 时间序列：[[HB Read Room Energy Result]] 的 `cooling`、`heating`、`lighting`、`electric_equip`、`hot_water` 接 [[LB Monthly Chart]] 看月度，或接 [[LB Hourly Plot]] 看逐时。
4. 峰值：设计日看 [[HB Peak Loads]] 的 `peak_cool` / `peak_heat`（W）；已有 zsz 就用 [[HB Read Zone Sizing]] 的 `cooling_load` / `heating_load`。
5. 负荷来源：[[HB Thermal Load Balance]] 接入房间与各分项数据，`balance` 接 [[LB Monthly Chart]]，看围护、太阳、人员、渗透各占多少。
6. 空间分布：[[HB Color Rooms]] 的 `_data` + `_rooms_model`，`_norm_by_flr_` 设 `True` 按面积归一；`sim_step_` 选某一小时。
7. 舒适度：[[HB Read Room Comfort Result]] 看 `oper_temp`、`rel_humidity`、`unmet_heat`；需要空间图先跑 [[HB PMV Comfort Map]]。
8. 热力图：[[HB Read Thermal Matrix]] 的 `_load` 必须为 `True`，再用 [[HB Visualize Thermal Map]] 选时刻出图。
9. 碳排：[[HB Carbon Emission Intensity]] 的 `_loc_kgMWh` 填当地电网因子，`_year_` 默认 2030。

## 参数怎么填

| 参数 | 单位 / 取值 | 建议 |
|---|---|---|
| `_sql` | 文件路径 | 接 Run 组件的 `sql` 输出 |
| `ip_` | 布尔 | `True` 输出 kBtu/ft²，国内一般用 `False` |
| `_norm_by_flr_` | 布尔 | 比较大小不同的房间时设 `True` |
| `sim_step_` | 整数 | 从 0 起；留空 = 全年合计 |
| `period_` | AnalysisPeriod | 只看夏季或工作时段 |
| `_data` | 同类型数据集合 | 类型必须一致，否则无法对齐 |
| `_load`（热工矩阵） | 布尔 | 必须为 `True`，否则矩阵为空 |
| `_loc_kgMWh` | Location 或数值 | 填当地公布的电网排放因子 |
| `_target_time_` | 0–1 | 舒适度或达标判定常取 0.95 |

## 常见坑

1. **把理想空调的 `cooling` 当空调用电**：那是需要移除的热量，未除以 COP，也没算风机与水泵。
2. **不归一就横向比较**：大房间数值天然更大，`_norm_by_flr_` 忘了开。
3. **拿旧 `sql` 配新模型**：改过构造或计划后没重跑，图与模型对不上。
4. **`_load` 设成 `False`**：[[HB Read Thermal Matrix]] 只返回空壳，热力图全灰。
5. **月度图喂逐时数据**：[[LB Monthly Chart]] 需要月度集合，小时数据会挤成一根柱子。

## 下一步

能量部分到此闭环。下一章换引擎，进入 Radiance 的世界：[第 18 章 · Radiance 材质与天空](18-radiance-materials-sky.md)。
