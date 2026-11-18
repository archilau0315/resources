# 07 · 舒适度与可视化表达

> 先判断「人舒不舒服」，再把结果画成一张能放进报告的图。
![焓湿图：干球温度、相对湿度与舒适区的叠加，用于热舒适评价](../assets/shots/07-comfort-psychrometric.png)


## 本章解决什么

舒适度有三个常用模型，选错模型比参数填错更致命：

| 模型 | 适用场景 | 组件 |
|---|---|---|
| PMV / PPD | 有空调的室内，ISO 7730 | [[LB PMV Comfort]] |
| Adaptive | 自然通风、可开窗的室内，ASHRAE 55 | [[LB Adaptive Comfort]] |
| UTCI | 室外、街道与广场 | [[LB UTCI Comfort]] |

三个模型都要四类输入：空气温度、平均辐射温度（MRT，mean radiant temperature）、相对湿度、风速。差别在于 MRT 从哪来：室内可近似取空气温度，室外必须用 [[LB Outdoor Solar MRT]] 把太阳直射和天空长波辐射算进去，否则结果会明显偏乐观。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB PMV Comfort]] | 算逐时 PMV、PPD 与是否舒适 |
| [[LB Adaptive Comfort]] | 算自然通风建筑的可接受温度范围 |
| [[LB UTCI Comfort]] | 算室外 UTCI 与冷热应激等级 |
| [[LB PMV Comfort Parameters]] | 设 PPD 阈值、湿度上下限、静风阈值 |
| [[LB Adaptive Comfort Parameters]] | 设标准版本、可接受偏移、建筑「空调程度」 |
| [[LB UTCI Comfort Parameters]] | 设冷不舒适与热不舒适的阈值温度 |
| [[LB Outdoor Solar MRT]] | 由太阳辐射与天空辐射算室外 MRT |
| [[LB Human to Sky Relation]] | 算人体暴露比例与天空视野，喂给上一个组件 |
| [[LB Thermal Indices]] | WBGT、热指数、风寒等「体感温度」 |
| [[LB Generate Point Grid]] | 把面细分成网格与测点，供热力图使用 |
| [[LB Spatial Heatmap]] | 用数值给网格上色，生成热力图 |
| [[LB Legend Parameters]] | 控制图例范围、分段数、配色与位置 |
| [[LB Color Range]] | 选一套现成色阶，接到图例的 `colors_` |
| [[LB Create Legend]] | 单独生成一个带标题的图例 |
| [[LB Preview VisualizationSet]] | 完整预览含图例、标签的图面 |
| [[LB Dump VisualizationSet]] | 导出 SVG 或 JSON，交给排版软件 |

## 操作步骤

1. 室外舒适度：`air_temp` 接 `dry_bulb_temperature`，`_rel_humid` 接 `relative_humidity`，`wind_vel` 接 `wind_speed`，`_run` 设 True，先不接 MRT 跑一次看基准结果。
2. 再算 MRT：[[LB Outdoor Solar MRT]] 的 `_location` 接站点，`_surface_temp` 接干球温度，`_dir_norm_rad`、`_diff_horiz_rad`、`_horiz_infrared` 分别接 EPW 同名输出，`_ground_ref_` 填 0.25，把 `mrt` 回接 [[LB UTCI Comfort]]。
3. 有周边建筑时，先用 [[LB Human to Sky Relation]] 算 `fract_body_exp` 与 `sky_exposure`，再接到 MRT 组件的同名输入。
4. 室内 PMV：把室内空气温度、MRT、相对湿度接给 [[LB PMV Comfort]]，`_met_rate_` 填 1.1（坐姿打字）、`_clothing_` 填 0.7（长袖长裤），`_run` 设 True。
5. 自然通风房间改接 [[LB Adaptive Comfort]]：`_out_temp` 必须接全年室外干球温度，`_air_temp` 接室内温度，`_run` 设 True。
6. 读结果：`comfort` 是每小时 0/1 的判定，`pmv` 在 -3 到 +3 之间，`ppd` 是不满意百分比；悬停端口能看到 `condition` 的整数编码含义。
7. 把结果画成图：[[LB Generate Point Grid]] 的 `_geometry` 接地面，`_grid_size` 填 1，得到 `mesh`；`values` 与 `mesh` 一起接 [[LB Spatial Heatmap]]。
8. 配色：[[LB Color Range]] 的 `_index_` 填 7（Annual Comfort 色阶），输出 `colors` 接 [[LB Legend Parameters]] 的 `colors_`，再把 `leg_par` 接热力图的 `legend_par_`。
9. 需要独立的图例或标题时，用 [[LB Create Legend]]，`_values` 接同一批数值，`title_` 写单位。
10. 出图：把热力图或图表的 `vis_set` 接 [[LB Preview VisualizationSet]] 预览，或接 [[LB Dump VisualizationSet]]，`_format_` 填 0 导出 SVG。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `_air_temp` / `_mrt_` / `_rel_humid` | 数据集合或单个数值；湿度是 0–100 的百分数 |
| `_air_speed_` / `wind_vel_` | m/s；UTCI 用的是 10 米高气象风速 |
| `_met_rate_` | 代谢率，静坐 1.0–1.1 met，走动 1.6–2.0 met |
| `_clothing_` | 服装热阻，夏季 0.5 clo，西装 1.0 clo |
| `_ppd_thresh_` | 可接受的不满意率上限，默认 10（%） |
| `_cold_thresh_` / `_heat_thresh_` | UTCI 冷热阈值，默认 9 ℃ 与 26 ℃ |
| `_ground_ref_` | 室外地面反射率，草地与裸土约 0.25 |
| `_index_`（Color Range） | 0 原始、3 Ecotect、7 Annual Comfort、8 Thermal |
| `min_` / `max_`（图例） | 建议手动锁定，多张图才能横向比较 |
| `_format_`（导出） | 0 = SVG，1 = JSON |

## 常见坑

- 给自然通风建筑用 PMV，结论会偏严；反过来给全空调房间用 Adaptive 又会偏松。
- 室外算 UTCI 却不接 MRT，默认 MRT 等于气温，太阳晒着的广场会被判成舒适。
- 把相对湿度填成 0–1，结果全判为极干。
- 热力图的 `values` 数量与 `mesh` 的面数或点数不一致，组件报错或颜色错位。
- 每张图都让图例自动取 min/max，几张图看起来一样漂亮，实际不可比。
- UTCI 直接填 1.5 m 处的人体感受风速，数值偏大；该输入是 10 米高气象风速。

## 下一步

气候、太阳、舒适度这条 Ladybug 主线到此走完，接下来进入建模：读 [08 · 建出第一个模型](08-first-model.md)。
