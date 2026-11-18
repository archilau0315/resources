# 08 · 建出第一个模型

> 从 Rhino 实体到可校验的 Honeybee 模型。

![Grasshopper 画布：几何输入 → HB Room from Solid → HB Add Subface → HB Model 的真实连线](../assets/shots/02-grasshopper.png)

## 本章解决什么

Rhino 里的盒子只是几何，Ladybug Tools 看不懂。本章把封闭实体变成 Honeybee 的层级对象：模型（Model）→ 房间（Room）→ 面（Face）→ 窗（Aperture）/ 门（Door），并跑通第一次校验。做完你会得到一个能继续加材料、加负荷的标准模型。
先求正确，再求好看；模型不通，后面的模拟都是白做。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Room from Solid]] | 把封闭实体（Brep / Mesh）直接转成房间，最快 |
| [[HB Room]] | 用若干 Honeybee 面围合成房间，控制更细 |
| [[HB Face]] | 把一个 Rhino 面指定为墙、屋面或楼板 |
| [[HB Aperture]] | 由 Rhino 矩形生成窗洞 |
| [[HB Door]] | 由 Rhino 矩形生成门洞 |
| [[HB Add Subface]] | 把窗、门贴到父级墙面并投影 |
| [[HB Model]] | 把房间汇总成模型 |
| [[HB Validate Model]] | 检查几何与属性，输出问题清单 |
| [[HB Visualize All]] | 在 Rhino 中整体预览 |

## 操作步骤

1. 把 Rhino 单位设为米，模型放在原点附近。单位错了后面全错。
2. 用 `Box` 建一个 6 m × 5 m × 3 m 的封闭体量，代表一间办公室。一个房间一个封闭体量，不要重叠。
3. 接 [[HB Room from Solid]]：`_geo` 接这个 Box，`_name_` 写 `Room_101`，`conditioned_` 设 True（有空调）。
4. 接 [[HB Visualize All]]，`_hb_objs` 接房间，确认 Rhino 里能看到完整六面体。
5. 画窗：在南墙表面画一个矩形，离地 0.9 m、高 1.8 m、宽 2.4 m，接 [[HB Aperture]] 的 `_geo`。
6. 接 [[HB Add Subface]]：`_hb_obj` 接房间，`_sub_faces` 接上一步的窗，`project_dist_` 填 0.1。输出 `hb_obj` 是带窗的房间；`unmatched` 有值说明没贴上。
7. 画门：在墙面画矩形，接 [[HB Door]]（`glass_` 设 False），再用一个 [[HB Add Subface]] 贴到房间上。
8. 接 [[HB Model]]：`rooms_` 接最终房间，`_name_` 写 `FirstModel`。
9. 接 [[HB Validate Model]]：`_model` 接模型，`_validate` 设 True，读 `report`。没有 `[SEVERE]` 才算通过。
10. 想手工控制每个面时，改用 [[HB Face]]：`_geo` 接单个 Rhino 面，`_type_` 填 Wall / RoofCeiling / Floor，`_bc_` 填 Outdoors，六个面接 [[HB Room]] 的 `_faces`。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_geo`（Room from Solid） | 封闭 Brep | 必须是闭合实体，开口面会报错 |
| `_name_` | Room_101 | 后续看图、查结果都靠它 |
| `conditioned_` | True | 有无采暖空调；办公室、卧室一般 True |
| `project_dist_` | 0.1 m | 窗与墙有偏差时，靠它投影贴合 |
| `_type_`（Face） | Wall / RoofCeiling / Floor | 不填则按法线自动判断 |
| `_bc_`（Face） | Outdoors | 外墙用 Outdoors；与邻室共用墙留给 Solve Adjacency |
| `_validate` | True | 必须打开才会计算 |
| `_model`（Validate） | 模型 | 也可以直接给 HBJSON 文件路径 |

## 常见坑

- 把 Rhino 曲面直接接到 [[HB Room]] 的 `_faces`：它只收 Honeybee 面，要先过 [[HB Face]]，或直接用 [[HB Room from Solid]]。
- 体量没封口：`Room from Solid` 报 "not closed"，先在 Rhino 里 `Cap`。
- 窗画在墙外 1 m 远：`project_dist_` 改大也没用，超出容差就进 `unmatched`。先 `Move` 贴回墙面。
- 面法线朝内：`_type_` 和 `_bc_` 会判反，用 [[HB Visualize Normals]] 检查。
- 房间互相重叠：能量计算会重复计面积，下一章先用 [[HB Intersect Solids]] 切干净。

## 下一步

模型能过校验后，进入 09：处理重叠、建立相邻、设置楼层与热区，把"能看"变成"能算"。
