# 11 · 属性查看与图面表达

> 把模型属性画出来，交付前自查。
![颜色库组件：按类型自动分配配色方案，批量给模型上色](../assets/shots/11-color-library.png)

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [正确的 Honeybee 分析模型建模姿势](https://www.bilibili.com/video/BV1pa411h7dh/)
- [Ladybug Tools 中的基础图形](https://www.bilibili.com/video/BV11b4y177Xq/)

## 本章解决什么

模型对不对，不能只靠转一圈看。本章用 Honeybee 的显示组件，按类型、边界条件、属性给模型上色和标注，并算出面积、体积、窗墙比这些硬指标。做完你能出一张"检查图"，也能直接放进方案汇报。
检查顺序建议：先整体、再类型、再边界条件、最后属性。
图不是效果图，重点是把看不见的属性变成一眼能判断的颜色和数字。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Visualize All]] | 整体显示模型 |
| [[HB Visualize by Type]] | 按墙、屋面、楼板、窗、门、遮阳分色 |
| [[HB Visualize by BC]] | 按边界条件（室外/相邻/地面/绝热）分色 |
| [[HB Visualize Normals]] | 显示每个面的法线方向 |
| [[HB Visualize Wireframe]] | 线框显示，大模型更流畅 |
| [[HB Room Attributes]] | 列出房间可用的属性名 |
| [[HB Face Attributes]] | 列出面可用的属性名 |
| [[HB Label Rooms]] | 在房间中心写属性值 |
| [[HB Label Faces]] | 在面上写属性值 |
| [[HB Color Room Attributes]] | 按房间属性着色 |
| [[HB Color Face Attributes]] | 按面属性着色 |
| [[HB Geometry Properties]] | 统计外墙面积、窗面积、体积、楼面积 |
| [[HB Deconstruct Model]] | 把模型拆成房间、面、窗、门、遮阳 |

## 操作步骤

1. 接 [[HB Visualize All]]，`_hb_objs` 接模型，先在 Rhino 里确认整体没有飞面、缺面。
2. 接 [[HB Visualize by Type]]，把 `walls`、`roofs`、`exterior_floors`、`apertures`、`doors` 分别接 GH 的 `Custom Preview`，配不同颜色。哪个面颜色不对，就是类型判错。
3. 接 [[HB Visualize by BC]]，重点看 `surface`（相邻）与 `outdoors`（室外）是否符合预期。
4. 接 [[HB Visualize Normals]]，箭头应统一朝室外；朝内说明面反了，回去改 [[HB Face]]。
5. 接 [[HB Room Attributes]]，把输出接到 [[HB Label Rooms]] 的 `_attribute_`，逐个试 `name`、`story`、`zone` 等值，标注会写在房间中心。
6. 接 [[HB Color Room Attributes]] 或 [[HB Color Face Attributes]]，`_attribute` 选要看的字段，接 `legend_par_` 可配图例。
7. 接 [[HB Geometry Properties]]：`ext_wall_area` 与 `ext_win_area` 相除得到窗墙比（WWR）；`floor_area` 用来核对总面积，`volume` 用来核对体量。
8. 需要单个对象时，用 [[HB Deconstruct Model]] 取 `rooms`、`faces`、`apertures`。

## 参数怎么填

| 参数 | 建议值 | 说明 |
|---|---|---|
| `_hb_objs` | 模型或对象列表 | 所有显示组件都收这个 |
| `_attribute_` | name / story / zone | 先接属性列表组件看可选值 |
| `_txt_height_` | 0.2–0.5 m | 按模型尺度调，太大互相压字 |
| `_rooms_model` | 房间列表或模型 | 标注与着色的入口 |
| `legend_par_` | LB Legend Parameters | 不接则用默认图例 |

## 常见坑

- 把着色当改属性：[[HB Color Room Attributes]] 只生成显示网格，不改模型。
- 没接 `Custom Preview`：组件输出的是几何，不接预览在 Rhino 里什么都看不到。
- 大模型逐面着色卡死：先用 [[HB Visualize Wireframe]] 或 [[HB Visualize All]] 检查，出图再上色。
- `_txt_height_` 用默认值：小模型字太大、大模型看不见，按建筑尺度调。
- 属性名拼错：`_attribute_` 区分大小写，先从 [[HB Room Attributes]] 的输出里选。

## 下一步

图面检查通过后，进入 12：把模型拆分、存成文件，或转给其他软件。
