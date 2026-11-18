# 10 · 批量生成与参数化

> 一套体量，批量开窗、分区、命名。

## 本章解决什么

手动画一百个窗不现实。本章用 Honeybee 的批量组件，把"体量 → 房间 → 窗 → 遮阳 → 热区 → 命名"串成一条可复用的链，所有关键数字接滑杆（Number Slider），改一个值整栋楼跟着变。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Room from Solid]] | 批量把封闭体量转成房间 |
| [[HB Rooms by Floor Height]] | 按平均层高把房间分组 |
| [[HB Rooms by Orientation]] | 按外墙朝向把房间分组 |
| [[HB Apertures by Ratio]] | 按窗墙比（WWR）批量开窗 |
| [[HB Apertures by Width Height]] | 按窗宽、窗高、窗台高开窗 |
| [[HB Apertures by Guide Surface]] | 按导向面的范围开窗 |
| [[HB Skylights by Ratio]] | 按比例开天窗 |
| [[HB Louver Shades]] | 生成百叶遮阳 |
| [[HB Extruded Border Shades]] | 沿窗边外挑遮阳板 |
| [[HB Automatic Zoning]] | 按楼层、朝向、用途自动归热区 |
| [[HB Straight Skeleton]] | 把不规则平面切成规则房间 |
| [[HB Add Prefix]] | 批量加名称前缀 |

## 操作步骤

1. 在 Rhino 用 `Box` 按层高做标准层，再用 `Series` + `Move` 复制到各层，每层都是封闭实体。
2. 全部体量接 [[HB Room from Solid]] 的 `_geo`，`_name_` 接统一前缀，一次得到整栋房间。
3. 接 [[HB Rooms by Floor Height]]：输出 `flr_hgts` 与 `rooms` 一一对应，用来分层统计或给不同层赋参数。
4. 接 [[HB Rooms by Orientation]]：`n_groups_` 填 4（东南西北）或 8，`north_` 填真北角度。
5. 先求相邻：接 [[HB Solve Adjacency]]（见 09），否则内墙会被当成外墙。
6. 接 [[HB Apertures by Ratio]]：`_hb_objs` 接房间，`_ratio` 填 0.3–0.4，`_sill_height_` 0.9，`_win_height_` 1.8，`_subdivide_` 设 True。
7. 想按尺寸控窗，改用 [[HB Apertures by Width Height]]；想只在一面墙开窗，用 [[HB Apertures by Guide Surface]]。
8. 屋顶开天窗用 [[HB Skylights by Ratio]]；遮阳用 [[HB Louver Shades]] 或 [[HB Extruded Border Shades]]。
9. 接 [[HB Automatic Zoning]]：同层、同朝向、同用途的房间归入同一热区，减少计算量，几何不变。
10. 接 [[HB Add Prefix]] 统一命名，保证每个房间 ID 唯一；重复 ID 会在校验时报错。
11. 把 `_ratio`、`_win_height_`、`n_groups_` 全部接 Number Slider，做方案对比。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_ratio` | 0.2–0.6 | 窗洞面积 ÷ 墙面面积，上限 0.95 |
| `_ratio` 数组 | {0.3, 0.2, 0.4, 0.25} | 从北开始顺时针给四个方向 |
| `_win_height_` | 1.5–2.1 m | 目标窗高，放不下时以比例为优先 |
| `_sill_height_` | 0.9 m | 窗台离墙底高度 |
| `_horiz_separ_` | 0.2–0.5 m | 多扇窗的中线间距 |
| `n_groups_` | 4 或 8 | 朝向分组数 |
| `north_` | 0–360 | 真北相对 Y 轴的角度 |
| `_orient_count_` | 4 或 8 | 自动分区的朝向细分 |
| `_prefix` | `L1_` | 统一加前缀，便于分层识别 |

## 常见坑

- 以为 [[HB Rooms by Floor Height]] 会拉伸体量：它只按平均层高分组，拉伸要自己做。
- 先开窗后求相邻：内墙会被开满窗。顺序必须是 体量 → 房间 → 求相邻 → 开窗。
- `_ratio` 填 30：单位是 0–1 的比例，不是百分比。
- `north_` 用了磁北：真北要先换算，否则朝向统计全偏。
- 遮阳放在窗内侧：外遮阳应保持 `indoor_` 为 False。

## 下一步

批量模型建好后，进入 11：用标注和着色把属性、朝向、边界条件画出来，交付前自查。
