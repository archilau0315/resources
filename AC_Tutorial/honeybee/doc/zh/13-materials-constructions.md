# 13 · 材料与构造三步法

> 材料 → 构造 → 构造集，一层层打包。

## 本章解决什么

能量模拟的热量进出，全靠围护结构的热工参数。Honeybee 把它们分成三层：材料（Material）是最小一层；构造（Construction）是若干材料按顺序叠成的一层墙或窗；构造集（ConstructionSet）把所有部位的构造打包，一次性赋给房间。顺序不能跳。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Opaque Material]] | 定义导热、密度、比热、厚度 |
| [[HB Opaque Material No Mass]] | 只给热阻 R，用于保温板等等效层 |
| [[HB Window Material]] | 用 U 值、SHGC、可见光透过率定义窗 |
| [[HB Glass Material]] | 分层玻璃，用于采光与详细窗构造 |
| [[HB Opaque Construction]] | 把多层材料从外到内叠成墙、屋面、楼板 |
| [[HB Window Construction]] | 把玻璃与间层叠成窗，可加窗框 |
| [[HB ConstructionSet]] | 打包外墙、屋面、楼板、窗、门 |
| [[HB Exterior Construction Subset]] | 只覆盖外部构造 |
| [[HB Ground Construction Subset]] | 只覆盖与土壤接触的构造 |
| [[HB Interior Construction Subset]] | 只覆盖内隔墙、内楼板 |
| [[HB Subface Subset]] | 只覆盖窗、门等子面构造 |
| [[HB Apply ConstructionSet]] | 把构造集赋给房间 |
| [[HB Apply Opaque Construction]] | 给指定面单独换构造 |
| [[HB Apply Window Construction]] | 给指定窗单独换构造 |
| [[HB Search Construction Sets]] | 从标准库检索现成构造集 |
| [[HB Construction Set by Climate]] | 按气候区、年代、结构类型取构造集 |
| [[HB Deconstruct Construction]] | 反查 U 值、R 值、SHGC、透光率 |

## 操作步骤

1. 做材料：外墙用 [[HB Opaque Material]]，`_thickness` 0.2，`_conductivity` 1.4，`_density` 2300，`_spec_heat` 900。保温层可再用一层，或直接用 [[HB Opaque Material No Mass]] 给 `_r_value`。
2. 做窗材料：[[HB Window Material]]，`_u_factor` 2.0，`_shgc` 0.4，`_t_vis_` 0.6。这是简化法，够做能耗。
3. 做构造：[[HB Opaque Construction]] 的 `_materials` 按"室外 → 室内"顺序接材料列表；[[HB Window Construction]] 的 `_materials` 接玻璃（多层时中间接 [[HB Window Gap Material]]）。
4. 做构造集：[[HB ConstructionSet]] 的 `_name` 写 `MySet`，`base_constr_set_` 可接 [[HB Search Construction Sets]] 的结果做底，再用四个 Subset 覆盖个别部位。
5. 赋给房间：[[HB Apply ConstructionSet]] 的 `_rooms` 接房间，`_constr_set` 接构造集。也可以直接填库里的构造集名字。
6. 局部替换：某一面墙要改，接 [[HB Apply Opaque Construction]]；某一扇窗要改，接 [[HB Apply Window Construction]]。
7. 检查：[[HB Deconstruct Construction]] 看 `u_fac_si`、`r_val_si`、`shgc`、`t_vis` 是否符合预期；[[HB Deconstruct ConstructionSet]] 看 12 类构造是否齐全。
8. 没有把握时先用现成的：[[HB Construction Set by Climate]] 填气候区、年代、结构类型，直接得到一套合规构造集。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_thickness` | 0.2 m | 材料厚度，单位米 |
| `_conductivity` | 0.035–1.7 W/mK | 保温小、混凝土大 |
| `_density` | 30–2300 kg/m³ | 影响蓄热 |
| `_spec_heat` | 900–1400 J/kgK | 影响蓄热 |
| `_r_value` | 1.5–4.0 m²K/W | 无质量材料的等效热阻 |
| `_u_factor` | 1.4–2.8 W/m²K | 整窗传热系数 |
| `_shgc` | 0.25–0.6 | 太阳得热系数，越小越遮阳 |
| `_t_vis_` | 0.3–0.8 | 可见光透过率 |
| `_materials` | 外 → 内 | 顺序反了热工就错 |
| `_climate_zone` | 1–8 | ASHRAE 气候区 |
| `_vintage_` | 2019 / pre_1980 | 建筑年代 |
| `_constr_type_` | SteelFramed / Mass | 结构类型 |

## 常见坑

- 材料顺序反了：U 值可能还对，但冷凝位置和蓄热全错。永远从室外写到室内。
- 只建材料不建构造：材料不能直接赋给面，必须先进构造。
- 把 [[HB Window Material]] 当分层玻璃：它是整体等效参数，做详细采光要换 [[HB Glass Material]]。
- 构造集缺项：校验会报某类面找不到构造。用 [[HB Deconstruct ConstructionSet]] 逐项看。
- 改了材料不重新赋：构造集是快照，改完要重新 [[HB Apply ConstructionSet]]。
- 内墙用了外部构造：内隔墙要用 [[HB Interior Construction Subset]]，否则传热方向错。

## 下一步

构造齐了，进入 14：加运行计划、人员、照明、设备与新风。
