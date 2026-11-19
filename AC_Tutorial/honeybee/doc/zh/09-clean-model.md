# 09 · 模型整理与合法性

> 切重叠、建相邻、查错误，让模型可计算。

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [正确的 Honeybee 分析模型建模姿势](https://www.bilibili.com/video/BV1pa411h7dh/)

## 本章解决什么

上一章只保证"看起来是个房间"。真实项目里体量会重叠、墙面对不齐、内墙被当成外墙。本章把几何收拾干净，建立房间之间的相邻关系（adjacency），再用校验器逐项体检。目标是 `report` 里没有 SEVERE。
顺序不能反：先修几何，再建相邻，最后校验。
跳过任何一步，后面都要返工。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Intersect Solids]] | 相互切割重叠体量，生成匹配的共面墙 |
| [[HB Planarize Brep]] | 把带曲率的面细分为平面，满足 EnergyPlus 要求 |
| [[HB Solve Adjacency]] | 自动识别共面房间面并设为 Surface 相邻 |
| [[HB Patch Missing Adjacency]] | 把找不到邻居的面改成 Adiabatic |
| [[HB Validate Model]] | 全面校验几何、相邻与能量/采光属性 |
| [[HB Face]] | 手工指定面的类型与边界条件 |
| [[HB Set Story]] | 标记房间所属楼层 |
| [[HB Set Zone]] | 把多个房间归入同一热区 |
| [[HB Set Multiplier]] | 用一个房间代表多个相同房间 |
| [[HB Visualize by BC]] | 按边界条件分色检查 |

## 操作步骤

1. 全部房间接 [[HB Intersect Solids]]，`_run` 设 True。输出 `int_rooms` 是切好的房间，墙面对齐、可匹配。
2. 接 [[HB Solve Adjacency]]：`_rooms` 接 `int_rooms`，`_run` 设 True。程序会找共面且重合的墙，把两侧边界条件都改成 Surface。
3. 用 [[HB Visualize by BC]] 检查：`outdoors` 应是真正的外墙，`surface` 应是内隔墙。若内墙还留在 `outdoors`，说明没匹配上。
4. 只算局部模型或单层时，接 [[HB Patch Missing Adjacency]] 把缺邻居的面设为 Adiabatic。它会删掉这些面上的窗，别拿它掩盖缝隙。
5. 非平面面先用 [[HB Planarize Brep]] 处理，再重新求相邻。
6. 接 [[HB Validate Model]]：`_model` 接模型，`extension_` 可填 `Energy` 或 `Radiance`，留空或填 `Generic` 则全查；`_validate` 设 True。
7. 整理组织信息：[[HB Set Story]] 标楼层（如 `L1`），[[HB Set Zone]] 归热区（同层同朝向可共用一个），[[HB Set Multiplier]] 让一个标准层代表多个相同层。
8. 改完再校验一次，直到只剩提示级信息。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_run`（Intersect） | True | 不打开不会计算 |
| `_cpu_count_` | 留空 | 默认用 CPU 数减一 |
| `_rooms`（Solve） | 切好的房间 | 必须先有匹配面 |
| `adiabatic_` | False | True 则相邻面全按绝热，不传热 |
| `air_boundary_` | False | True 用于空气边界，如开敞办公 |
| `overwrite_` | False | 是否重算已有的 Surface |
| `extension_` | 空 / Energy / Radiance | 决定查哪套属性 |
| `_multiplier` | 1–30 | 仅用于完全相同的重复房间 |

## 常见坑

- 跳过 Intersect 直接 Solve：面不完全重合就识别不到，内墙仍是 Outdoors，负荷偏大。
- 两个房间留 1 mm 缝：看起来贴着，其实不共面。要么对齐，要么用 Intersect 切。
- `adiabatic_` 开成 True：所有相邻面都变绝热，冬夏都"不漏热"，结果偏乐观。只有做局部模型时才用。
- Patch 用得太多：它把问题藏起来，校验能过但模型是错的。先修几何。
- 校验只报 WARNING 就上线：能量扩展的构造缺失、计划缺失常以 WARNING 出现，后面模拟会失败。

## 下一步

模型干净后，进入 10：用一批组件把开窗、遮阳、分区批量做完。
