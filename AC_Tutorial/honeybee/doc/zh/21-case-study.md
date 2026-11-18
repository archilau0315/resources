# 21 · 完整案例：一间办公室的采光 + 能耗

> 一间 12 m × 8 m、层高 3.2 m 的南向单间办公室，从一份 EPW 一路做到能量模拟、sDA / ASE 与结论表达。每一步只列关键组件、关键参数和该步产出；按顺序连起来，就是一条可以复现的完整链路。
![完整案例工作流概览：EPW → 建模 → 开窗 → 构造 → 能量 → 采光 → 结果](../assets/shots/21-case-overview.png)


## 案例设定

- 地点：北京（EPW 取 `CHN_Beijing.Capital.Intl.AP.545110_IWEC`），寒冷气候区。
- 几何：96 m² 单间，南墙为唯一外墙，其余三面按相邻或绝热处理，避免多房间耦合干扰判断。
- 目标：先确认"能跑通"，再看两个指标——采光 sDA300/50% 与能耗 EUI（kWh/m²·a）。
- 顺序铁律：**几何 → 属性 → 参数 → 模拟 → 读结果**。顺序颠倒，后面每一步都在返工。

| 阶段 | 关键组件 | 关键输入 / 参数 | 产出 |
|---|---|---|---|
| 气象 | [[LB Import EPW]]、[[LB Import STAT]] | `_epw_file`、`_stat_file` | location、室外干球温度、气候区 |
| 几何 | [[HB Room from Solid]]、[[HB Model]] | `_geo`、`_name_`、`conditioned_` | room、model |
| 开窗 | [[HB Apertures by Ratio]]、[[HB Extruded Border Shades]] | `_ratio`、`_win_height_`、`_sill_height_`、`_depth` | 带窗与挑檐的 model |
| 属性 | [[HB Apply ConstructionSet]]、[[HB Apply ProgramType]] | `_constr_set`、`_program` | 带构造与用途的 model |
| 能量 | [[HB Model to OSM]]、[[HB Read Room Energy Result]] | `_sim_par_`、`_epw_file` | sql、EUI |
| 采光 | [[HB Annual Daylight]]、[[HB Spatial Daylight Autonomy]] | `_thresholds`、`_target_time_` | DA、sDA、ASE |

## 步骤 1 · EPW 与站点

先固定气象数据，后面所有模拟都引用同一个文件，避免"能量用北京、采光用上海"这种低级错位。

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[LB Import EPW]] | `_epw_file` | 输出 location 与全年逐时气象，是全链路的源头 |
| [[LB Import STAT]] | `_stat_file` | 读 `ashrae_zone`、`koppen_zone`、设计日与典型周，决定后续取哪套构造集 |
| [[HB Wea From EPW]] | `_epw_file`、`timestep_` | 为采光生成 `.wea` 天空文件，供 [[HB Annual Daylight]] 使用 |

EPW 与 STAT 放在同一目录，路径只用英文和数字。中文路径在本机常常能读、在引擎子进程里却读不到，这是最常见的"文件明明在，就是报错"。

## 步骤 2 · Rhino 体量与房间

在 Rhino 里画一个闭合的 Box（12 × 8 × 3.2），单位确认为米。不要用 Mesh，不要留开口，也不要把地面画在 Z=0 以下——Honeybee 的地面边界依赖 Z 轴方向。

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Room from Solid]] | `_geo`、`_name_`、`conditioned_` | 一个实体直接转成一个 Room，自动切成 6 个 Face |
| [[HB Model]] | `rooms_`、`_name_` | 把 Room 收进模型容器，之后所有模拟只认这个 model |
| [[HB Solve Adjacency]] | `_rooms` | 多房间时求解共面相邻；单间可跳过 |
| [[HB Validate Model]] | `_model` | 必做的体检：非平面面、零面积面、法线方向都会在这里报出来 |

拿到模型先看 [[HB Visualize by Type]] 与 [[HB Visualize Normals]]：墙、顶、地颜色是否对，法线是否一律朝外。法线反了，后面的窗会开在背面，结果全错。

## 步骤 3 · 开窗与遮阳

南墙按 40% 窗墙比开窗，加 0.6 m 水平挑檐。挑檐不是为了好看，是为了压 ASE——直射暴露超标时，最先动的就是它。

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Apertures by Ratio]] | `_ratio` 0.4、`_win_height_` 1.8、`_sill_height_` 0.9 | 按比例在选中的面上批量开窗，自动避开面边界 |
| [[HB Extruded Border Shades]] | `_depth` 0.6、`indoor_` false | 沿窗洞外扩出挑檐，挂在窗上而不是墙上，改窗时自动跟随 |
| [[HB Louver Shades]] | `_depth`、`_shade_count_`、`_angle_` | 需要更细的遮阳控制时叠加百叶，注意片数越多采光模拟越慢 |
| [[HB Apply Window Modifier]] | `_mod` | 给窗指定 Radiance 玻璃材质，缺了它采光模拟会退回默认值 |

窗高加窗台高不要超过墙高。组件会替你截断，但截断后的窗形往往不是你要的，最好一开始就把参数算清楚。

## 步骤 4 · 构造与运行计划

两件事：围护结构传热怎么算（构造集），室内的人和灯什么时候在（用途模板 + 运行计划）。

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Construction Set by Climate]] | 气候区、建筑类型 | 按气候直接取成套构造，先跑通再替换 |
| [[HB Search Construction Sets]] | `keywords_` | 关键词检索内置构造集，比手搓材料快得多 |
| [[HB Apply ConstructionSet]] | `_rooms`、`_constr_set` | 一次性套到全部房间 |
| [[HB Search Programs]] | `keywords_`、`_vintage_` | 取 `OpenOffice` 一类标准用途模板 |
| [[HB Apply ProgramType]] | `_rooms`、`_program` | 套用人员、照明、设备、新风、设定点 |
| [[HB Apply Load Values]] | `people_per_floor_`、`lighting_per_floor_`、`vent_per_person_` | 覆盖成项目实际值：8 m²/人、9 W/m² 照明、30 m³/(h·人) 新风 |
| [[HB IdealAir]] | `_heat_temp_`、`_cool_temp_` | 方案阶段用理想空调，只评负荷需求，不评系统效率 |

先用标准库跑一遍，确认结果量级合理，再逐项替换成项目参数。反过来做，一旦结果离谱，你分不清是模型错还是参数错。

## 步骤 5 · 能量模拟

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Simulation Parameter]] | `_output_`、`_run_period_`、`_sim_control_`、`_shadow_calc_` | 把输出项、模拟期、阴影计算打包成一个参数对象 |
| [[HB Simulation Output]] | `zone_energy_use_`、`comfort_metrics_` | 只勾需要的输出，输出越多 sql 越大、跑得越慢 |
| [[HB Model to OSM]] | `_model`、`_epw_file`、`_sim_par_`、`_write`、`run_` | 翻译成 OSM 并交给 EnergyPlus，一次拿到 sql 与 html |
| [[HB Run OSM]] | `_osm`、`_epw_file`、`_cpu_count_` | 模型要改参数重跑时，单独跑 OSM 比重新翻译快 |

第一次运行会解压引擎，耗时明显偏长，属正常。`run_` 是布尔开关，忘了拨到 True 会得到"什么都没有"的空结果。

## 步骤 6 · 采光网格与模拟

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Sensor Grid from Rooms]] | `_grid_size` 0.5、`_dist_floor_` 0.8 | 按房间自动铺测点，0.8 m 是工作面高度 |
| [[HB Assign Grids and Views]] | `_model`、`grids_` | 把网格写进模型，配方才知道要算哪里 |
| [[HB Radiance Parameter]] | `_recipe_type`、`_detail_level_` | 全年模拟用默认档即可，调高精度会让时间成倍增长 |
| [[HB Annual Daylight]] | `_model`、`_wea`、`_thresholds` 300、`_schedule_`、`_run` | 输出 DA、cDA、UDI，是 sDA / ASE 的唯一上游 |

网格 0.5 m 已经够用。降到 0.2 m 精度提升有限，点数却涨六倍，内存和时间都吃不消。

## 步骤 7 · sDA / ASE

| 指标 | 组件 | 关键参数 | 判读 |
|---|---|---|---|
| sDA | [[HB Spatial Daylight Autonomy]] | `_DA`、`_target_time_` 50 | ≥ 50% 的时间达到 300 lux 的面积占比，常用 55% 为达标线 |
| ASE | [[HB Annual Sunlight Exposure]] | `_results`、`_occ_sch_`、`_threshold_` 1000、`_target_hrs_` 250 | 直射超 1000 lux 逾 250 h 的面积占比，宜 ≤ 10% |
| 复核 | [[HB Annual Daylight Metrics]] | `_results`、`_threshold_` | 换阈值或换运行计划重算，避免重复跑模拟 |

sDA 和 ASE 是一对反向指标。只报 sDA 会做出玻璃盒子，只报 ASE 会做出暗房间，两个必须同时出现。

## 步骤 8 · 结果对照与结论表达

| 组件 | 关键参数 | 说明 |
|---|---|---|
| [[HB Annual Results to Data]] | `_results`、`_all_pts` | 把逐点年结果转成 Ladybug 数据集合，才能画图 |
| [[LB Spatial Heatmap]] | `_values`、`_mesh`、`legend_par_` | 平面热力图，sDA 与照度都用它 |
| [[HB Color Rooms]] | `_data`、`_rooms_model`、`norm_by_flr_` | 按房间上色，适合汇报整层分布 |
| [[LB Create Legend]] | `_values`、`_base_plane_`、`title_` | 统一图例色阶与单位，两张图才好并排比较 |
| [[HB End Use Intensity]] | `_sql` | 直接给 EUI 与分项能耗 |
| [[HB Peak Loads]] | `_rooms`、`_ddy_file` | 冷热峰值负荷，用来讲设备容量 |

结论只写三句就够：**采光达标率多少、直射超标多少、单位面积能耗多少**。配一张热力图、一张分项能耗柱状图、一张 sDA 对照表，任何人都能在一分钟内看懂。

### 复现顺序（照抄即可）

1. 导入 EPW 与 STAT，确认 location 与气候区。
2. Rhino 建 Box，转 Room，装进 Model，`Validate Model` 无报错。
3. 开窗、加挑檐，检查窗是否落在正确的面上。
4. 套构造集与用途模板，覆盖关键负荷值。
5. 理想空调 + 模拟参数，跑通 OSM，拿到 sql。
6. 铺网格，跑全年采光，取 sDA / ASE。
7. 出图、对照、写结论。

> 本文所有组件端口名与官方 1.10.x 版本一致；参数值（0.4 窗墙比、0.6 m 挑檐、300 lux 等）是案例取值，换成你的项目条件后结论会变，读法不变。
