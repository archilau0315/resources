# 19 · 传感器网格与视图

> 网格回答“哪里亮”，视图回答“看着怎样”。

## 本章解决什么

采光结果不是画在房间上的，而是落在一个个**测点**上；渲染图也不是凭空生成，而是从一个**相机**看出去。本章准备这两样输入：

- **传感器网格（Sensor Grid）**：一组带位置和朝向的测点，是采光计算的接收面。
- **视图（View）**：相机的位置、朝向、视角类型，是渲染与眩光分析的观察点。

两者都要挂到模型上，配方才能找到它们。

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB Sensor Grid from Rooms]] | 按房间生成网格 | 室内地面布点 | `_rooms`、`_grid_size` |
| [[HB Sensor Grid from Faces]] | 按面生成网格 | 屋面、墙面 | `_hb_objs`、`_face_type_` |
| [[HB Sensor Grid from Apertures]] | 按窗生成网格 | 立面采光、窗面 | `_offset_`、`_ap_type_` |
| [[HB Sensor Grid]] | 传感器网格 | 自定义点与方向 | `_positions`、`_directions_` |
| [[HB Radial Sensor Grid]] | 径向传感器网格 | 视野、眩光 | `_positions`、`_dir_count_` |
| [[HB Radial Grid from Rooms]] | 按房间生成径向网格 | 全景视野 | `_rooms`、`_dir_count_` |
| [[HB View]] | 视图 | 手工定义相机 | `_position`、`_direction` |
| [[HB View from Viewport]] | 由视口创建视图 | 直接用 Rhino 视角 | `_viewport_` |
| [[HB Assign Grids and Views]] | 指定网格与视图 | 挂到模型 | `grids_`、`views_` |
| [[HB Get Grids and Views]] | 读取网格与视图 | 检查是否挂上 | `_model` |

## 操作步骤

1. 室内布点：[[HB Sensor Grid from Rooms]]，`_grid_size` 常用 0.6 m，`_dist_floor_` 取 0.8 m 表示工作面高度。
2. 去掉贴墙点：`wall_offset_` 设 0.2 m；房间形状复杂时把 `remove_out_` 设为 `True` 再检查一遍。
3. 需要按热区汇总时，`by_zone_` 设为 `True`，每个热区生成一个网格而不是每个房间一个。
4. 立面：[[HB Sensor Grid from Apertures]]，`_offset_` 取 0.1 m（向外为正），`_ap_type_` 1 窗 / 2 天窗 / 3 全部。
5. 屋面或墙面：[[HB Sensor Grid from Faces]]，`_face_type_` 选 `Wall`、`Roof` 或 `Floor`；有洞时 `punched_` 设 `True`。
6. 自定义：[[HB Sensor Grid]] 给 `_positions` 点列表，`_directions_` 留空默认朝上 `(0, 0, 1)`。
7. 视野或眩光：[[HB Radial Sensor Grid]] 或 [[HB Radial Grid from Rooms]]，`_dir_count_` 取 8，每个点一圈方向。
8. 相机：[[HB View from Viewport]] 在 Rhino 里调好视角后直接取，`_viewport_` 留空表示当前视口；或用 [[HB View]] 填 `_position`、`_direction`、`_view_type_`。
9. 挂载：把 `grid` 与 `view` 列表接入 [[HB Assign Grids and Views]] 的 `grids_` 与 `views_`，输出 `model` 进入配方。
10. 核对：[[HB Get Grids and Views]] 的 `points` 与 `meshes` 接到 Rhino 点预览，确认没有点落进墙体或家具。

## 参数怎么填

| 参数 | 单位 / 取值 | 建议 |
|---|---|---|
| `_grid_size` | m | 0.3 精细，0.6 常规，1.0 快速 |
| `_dist_floor_` | m | 0.8 工作面；0 表示地面 |
| `wall_offset_` | m | 0.2 |
| `_offset_`（窗） | m | 0.1 向外，负值向内 |
| `_face_type_` | 文本 / 整数 | `Wall`、`Roof`、`Floor` |
| `_ap_type_` | 1 / 2 / 3 | 窗 / 天窗 / 全部 |
| `_dir_count_` | 个 | 8，即每 45° 一个方向 |
| `_view_type_` | 0–5 | 0 透视，1 半球鱼眼，2 平行 |
| `_h_angle_` / `_v_angle_` | 度 | 默认 60 |

## 常见坑

1. **网格过密**：0.1 m 网格会让测点从几千变成几万，模拟时间成倍增长。
2. **忘记挂载**：网格建好了但没接 [[HB Assign Grids and Views]]，配方报“模型没有网格”。
3. **视图方向弄反**：`_direction` 是相机朝向，不是“从哪里看”。
4. **测点落在墙里或家具里**：结果出现 0 值或异常值；用 `wall_offset_` 与 `remove_out_` 处理。
5. **用窗面网格看室内采光**：窗面网格服务立面分析，室内要看地面网格。

## 下一步

测点与相机准备好，进入 [第 20 章 · 采光指标与模拟](20-daylight-metrics.md)：选配方、跑模拟、判达标。
