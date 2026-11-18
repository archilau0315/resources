# 03 · 界面与数据流

> 四个标签页、一条主线，看懂线往哪走就不会乱接。

## 本章解决什么

Ladybug Tools 有 412 个组件，但真正的主线只有一条：气象数据 → 几何 → 房间 → 模型 → 属性 → 模拟设置 → 运行 → 结果 → 图表。看懂这条主线，剩下的组件都是在这条线上做分支。本章讲清三件事：界面怎么分组、数据是什么形状、一根线该往哪接。

四个标签页的分组（图标下方的数字就是子分类序号）：

| 标签页 | 子分类 |
|---|---|
| Ladybug | 0 Import / 1 Analyze Data / 2 Visualize Data / 3 Analyze Geometry / 4 Extra / 5 Version |
| Honeybee | 0 Create / 1 Visualize / 2 Organize / 3 Serialize |
| HB-Energy | 0 Basic Properties / 1 Constructions / 2 Schedules / 3 Loads / 4 HVAC / 5 Simulate / 6 Result / 7 Thermal Map |
| HB-Radiance | 0 Basic Properties / 1 Modifiers / 2 Light Sources / 3 Recipes / 4 Results |

命名规律很好记：`LB` 开头 = Ladybug，`HB` 开头 = Honeybee 核心；HB-Energy 与 HB-Radiance 的组件也叫 `HB ...`，只是放在各自标签页里。端口名的下划线也有含义：`_epw_file` 前加下划线是必填，`north_` 后加下划线是可选项，`_name_` 两端都有下划线是最常见的那种「必填但给好了默认值」。

数据形状主要有四种：单个数值（如 25）、文本（如文件路径）、带时间标签的数据集合（Data Collection，如 8760 个逐时温度）、Honeybee 对象（Room、Model、SimulationParameter）。线接错了 GH 会变红或直接报类型不符，先看形状再接线。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB Import EPW]] | 主线的起点：气象数据与 Location |
| [[HB Room]] | 几何 → 房间，围合成封闭体量 |
| [[HB Model]] | 房间 → 模型，所有模拟的入口 |
| [[HB Simulation Parameter]] | 汇总模拟设置（时段、输出、阴影、HVAC） |
| [[HB Model to OSM]] | 模型 + 气象 → OpenStudio，可直接运行 |
| [[HB Read Room Energy Result]] | 结果 sql → 逐时冷热负荷等数据集合 |
| [[HB Visualize by Type]] | 按墙、屋面、楼板、窗分别着色，检查建模 |
| [[HB Check Versions]] | 排查时先确认版本与引擎 |

## 操作步骤

1. 打开 GH，把 [[LB Import EPW]]、[[HB Room]]、[[HB Model]]、[[HB Simulation Parameter]]、[[HB Model to OSM]] 依次横排拖开，先摆位置再接线。
2. `LB Import EPW` 的 `location` 与 `dry_bulb_temperature` 各接一个 Panel，右键 Panel 选「显示数据」，确认是 8760 个值而不是一个数。
3. Rhino 里的封闭体量炸开后接 [[HB Room]] 的 `_faces`，`room` 接 [[HB Model]] 的 `rooms_`；把 `model` 接 [[HB Visualize by Type]] 的 `_hb_objs`，颜色分得清墙和屋面就说明房间建对了。
4. `model` 接 `_model`，`sim_par`（来自 [[HB Simulation Parameter]]）接 `_sim_par_`，同一个 .epw 接 `_epw_file`。
5. `_write` 设 True、`run_` 设 True，运行 [[HB Model to OSM]]；跑完把 `sql` 接 [[HB Read Room Energy Result]]。
6. 输出里 `heating`、`cooling` 是逐时负荷，接个 Panel 看数值范围；再接 [[LB Monthly Chart]] 就能看到月度分布。
7. 每条分支都留一个 Panel 做「观测点」，黑色线是几何、绿色线是数据，看着颜色走比记名字可靠。

## 参数怎么填

| 位置 | 约定 |
|---|---|
| `north_` | 0 表示北朝 Rhino 的 +Y；逆时针为正，90 = 西，270 = 东，容易填反 |
| `_scale`（可视化类） | 1 对应半径 100 米（指北针是 10 米），按模型尺寸调 |
| `_grid_size` | 与 Rhino 单位一致，米制模型填 0.5–1 比较合适 |
| `_run` / `_write` / `run_` | 默认都是 False，不改成 True 就只算不写、不跑 |
| `_timestep_` | 常用 6（每 10 分钟一步），气象数据本身是逐时的就别乱改 |

## 常见坑

- 把数据集合当成单个数字去接数值端口，线变红还找不到原因。
- 忘了 `north_`，默认 0 意味着 +Y 是北；Rhino 里习惯把北画在 -Y 时，所有结果都转了 180°。
- 每次改参数都新建一个组件，画布上出现三份 [[LB Import EPW]]，改了半天发现改的是没接的那个。
- Rhino 单位是毫米，却在 `_grid_size` 填 1，结果生成了几百万个测点。
- 把 `_write` 当运行开关：它只负责写文件，真正的计算在 `run_`。

## 下一步

主线上的第一块砖是气象数据：读 [04 · 天气数据与站点](04-weather.md)。
