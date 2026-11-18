# 06 · 数据分析与图表

> 把 8760 个数字变成月曲线、焓湿图、风玫瑰，先看懂气候再动手设计。
![辐射玫瑰图：各朝向太阳辐射量的比较，叠加周边建筑遮挡](../assets/shots/06-data-analysis.png)


## 本章解决什么

气象数据本身是 8760 个数字，直接看没有意义。本章把它压成几张能读的图：月度温度与辐射、逐时冷热分布、焓湿图上的舒适区、风玫瑰、朝向辐射、度日数。这些图回答的是设计前期的问题——要不要遮阳、能不能自然通风、哪个朝向最晒。

所有图表组件都接受「数据集合（Data Collection）」，即带单位与时间标签的数值序列。[[LB Import EPW]] 的输出全都是这种形状，所以可以直接接图表，不用手工整理。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB Monthly Chart]] | 按月柱状图或折线图，看月度均值与区间 |
| [[LB Hourly Plot]] | 全年 8760 小时的热力条带，看昼夜与季节规律 |
| [[LB Psychrometric Chart]] | 焓湿图，叠加气象点与舒适区 |
| [[LB Wind Rose]] | 风玫瑰，按风向统计风速频次 |
| [[LB Radiation Rose]] | 辐射玫瑰，比较各朝向收到的太阳辐射 |
| [[LB Degree Days]] | 采暖与制冷度日数，估算能耗量级 |
| [[LB Humidity Metrics]] | 由温度与相对湿度算含湿量、露点、湿球、焓值 |
| [[LB Time Aggregate]] | 把逐时功率聚合成日/月总量，如 W 变 kWh |
| [[LB Construct Header]] | 手工数据也要有数据头：类型、单位、时段 |
| [[LB Construct Data]] | 把数值列表 + 数据头组成数据集合 |

## 操作步骤

1. [[LB Import EPW]] 的 `dry_bulb_temperature` 接 [[LB Monthly Chart]] 的 `_data`，`_base_pt_` 填 `0,0,0`，`_x_dim_` 填 10、`_y_dim_` 填 40，运行看十二个月的柱状分布。
2. 同一个数据接 [[LB Hourly Plot]] 的 `_data`，`_z_dim_` 给一个正数就能看到数值高低起伏；想看夏季，把 [[LB Analysis Period]] 的 `period` 接 `period_`。
3. [[LB Psychrometric Chart]] 的 `_temperature` 接干球温度，`_rel_humidity` 接相对湿度，`_pressure_` 接 `barometric_pressure`，`_scale` 先填 1。
4. 把 `direct_normal_rad` 也接给 `data_`，再写一个 `statement_`（例如 `a > 500`），就能只给高辐射时刻上色。
5. [[LB Degree Days]] 的 `_dry_bulb` 接干球温度，`_heat_base_` 填 18、`_cool_base_` 填 23，读 `heat_deg_days` 与 `cool_deg_days`。
6. 风玫瑰：`wind_speed` 接 [[LB Wind Rose]] 的 `_data`，`wind_direction` 接 `_wind_direction`，`north_` 与模型一致，`_dir_count_` 填 36。
7. 辐射玫瑰需要天空矩阵：`direct_normal_rad`、`diffuse_horizontal_rad` 与 `hoys` 接 [[LB Cumulative Sky Matrix]]，`sky_mtx` 再接 [[LB Radiation Rose]] 的 `_sky_mtx`。
8. 湿度：`dry_bulb_temperature` 与 `relative_humidity` 接 [[LB Humidity Metrics]]，`_pressure_` 接气压，得到 `dew_point`、`wet_bulb`、`enthalpy`。
9. 自己实测的数据：[[LB Construct Header]] 填 `_data_type`（如 Temperature）、`_unit_`（如 C）、`_a_period`（[[LB Analysis Period]] 的 `period`），再和数值一起接 [[LB Construct Data]] 的 `_header`、`_values`。
10. 逐时功率想变年总量，接 [[LB Time Aggregate]] 的 `_data`，输出的 `data_aggr` 就是聚合后的数据集合。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `_base_pt_` / `_center_pt_` | 图表摆放的世界坐标，默认原点；图叠在一起就换个点 |
| `_x_dim_` / `_y_dim_` / `_z_dim_` | 以 Rhino 模型单位计；月度图常用 10 / 40 |
| `percentile_` | 逐时数据的区间带宽，常用 34（约一个标准差） |
| `_dir_count_` | 风玫瑰与辐射玫瑰的方向数，默认 36 |
| `_freq_hours_` | 风玫瑰每圈代表的小时数，默认 50 |
| `_heat_base_` / `_cool_base_` | 度日基准温度，默认 18 / 23，夏热冬冷地区习惯取 18 / 26 |
| `_scale_`（焓湿图） | 整体缩放，1 大致对应一张几百毫米宽的图 |
| `statement_` | 条件表达式，如 `a > 25`；变量名固定为 a、b、c |

## 常见坑

- 图表画出来只有指甲盖大，通常是 Rhino 单位是毫米，而尺寸按米填。
- 把所有图都放原点，几张图叠成一团，看不出来；`_base_pt_` 分别往 X 方向挪。
- 风玫瑰的 `_data` 错填成风向，结果所有花瓣一样长；`_data` 应是风速。
- 风向是「风从哪个方向吹来」，不是吹向哪里，读图时容易说反。
- 用辐射玫瑰却发现没有天空矩阵，`_sky_mtx` 空着，组件直接报错。
- 焓湿图的 `_rel_humid` 填了 0–1 的小数，正确范围是 0–100。

## 下一步

气候看明白了，接着把「人舒不舒服」算出来并画到图上：读 [07 · 舒适度与可视化表达](07-comfort-visualize.md)。
