# 18 · Radiance 材质与天空

> 材质决定反射，天空决定光从哪来。

## 本章解决什么

前面的 EnergyPlus 算的是热量，Radiance 算的是光。光的结果高度依赖两样东西：表面怎么反射、天空怎么发光。本章把这两样配齐：

- **材质（Modifier）**：Radiance 专用，和 EnergyPlus 的构造（Construction）不是一套，不能直接复用。
- **材质集（ModifierSet）**：把外墙、屋面、窗、遮阳的材质打包，一次赋给整个模型。
- **天空（Sky / WEA）**：全年模拟用 `.wea` 天空文件，定点模拟用 CIE 或气候天空。

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB Opaque Modifier]] | 不透光材质 | 墙、顶、地 | `_reflect`、`_rough_` |
| [[HB Glass Modifier]] | 玻璃材质 | 单层可见光透过 | `_trans`、`_refract_` |
| [[HB Metal Modifier]] | 金属材质 | 金属、百叶 | `_diff`、`_spec_` |
| [[HB Mirror Modifier]] | 镜面材质 | 高反射面 | `_reflect` |
| [[HB Translucent Modifier]] | 半透材质 | 磨砂玻璃、织物 | `_diff_trans` |
| [[HB BSDF Modifier]] | BSDF 材质 | 复杂镀膜、遮阳系统 | `_xml_file` |
| [[HB Search Modifier Sets]] | 搜索材质集 | 直接取现成材质 | `keywords_` |
| [[HB ModifierSet]] | 材质集 | 打包各类材质 | 四个 subset 输入 |
| [[HB Apply ModifierSet]] | 应用材质集 | 赋给房间或模型 | `_rooms`、`_mod_set` |
| [[HB Apply Window Modifier]] | 应用窗材质 | 局部覆盖窗 | `_hb_objs`、`_mod` |
| [[HB Apply Face Modifier]] | 应用面材质 | 局部覆盖外墙 | `_hb_objs`、`_mod` |
| [[HB Apply Shade Modifier]] | 应用遮阳材质 | 遮阳构件 | `_hb_objs`、`_mod` |
| [[HB Wea From EPW]] | 由 EPW 生成天空 | 全年 `.wea` | `_epw_file`、`timestep_` |
| [[HB CIE Standard Sky]] | CIE 标准天空 | 定点模拟 | `_location`、`_type_` |
| [[HB Climatebased Sky]] | 气候天空 | 定点、彩色天空 | `_wea`、时刻 |
| [[HB Visualize Sky]] | 天空可视化 | 检查天空亮度 | `_sky` |

## 操作步骤

1. 先查库：[[HB Search Modifier Sets]] 不给关键词会输出全部材质集，能直接用的就别重建。
2. 自建材质，按表面分四类：
   - 墙、顶、地：[[HB Opaque Modifier]]，`_reflect` 是漫反射率。
   - 玻璃：[[HB Glass Modifier]]，`_trans` 填**可见光透过率（VLT）**。
   - 金属与百叶：[[HB Metal Modifier]]，`_spec_` 通常 0.9 以上。
   - 磨砂或织物：[[HB Translucent Modifier]]。
3. 复杂玻璃：用 [[HB BSDF Modifier]] 加载 LBNL WINDOW 导出的 XML，`_bsdf_type_` 有镜面透射时选 aBSDF。
4. 打包：[[HB ModifierSet]] 的 `_exterior_subset_`、`_subface_subset_`、`_shade_subset_` 接对应的子集组件输出，未接的项保持默认。
5. 赋值：[[HB Apply ModifierSet]] 接 `_rooms` 与 `_mod_set`；个别窗或墙用 [[HB Apply Window Modifier]]、[[HB Apply Face Modifier]] 覆盖。
6. 全年天空：[[HB Wea From EPW]]，`timestep_` 取 1，`hoys_` 可用 [[LB Analysis Period]] 只取工作时间。
7. 定点天空：[[HB CIE Standard Sky]]，`_type_` 0 晴天有太阳、4 阴天、5 均匀天空；或 [[HB Climatebased Sky]] 用 `.wea` 取某一时刻。
8. 检查：[[HB Visualize Sky]] 出 HDR 预览，同时看 `ghi` 是否落在合理范围。
9. 精度：[[HB Radiance Parameter]] 的 `_detail_level_` 用 0 先跑通，再升到 1 或 2。

## 参数怎么填

| 参数 | 单位 / 取值 | 建议 |
|---|---|---|
| `_reflect`（不透光） | 0–1 | 白墙 0.7–0.8，深色 0.2–0.3 |
| `_spec_` | 0–1 | 非金属 0–0.05，与 `_reflect` 之和小于 1 |
| `_rough_` | 0–1 | 不超过 0.2，越大越粗糙 |
| `_trans`（玻璃） | 0–1 | 双玻 0.6–0.7，Low-E 0.4–0.6 |
| `_refract_` | — | 普通玻璃 1.52，ETFE 1.4 |
| `_type_`（CIE） | 0–5 | 0 晴天有太阳，4 阴天，5 均匀 |
| `timestep_`（WEA） | 整数 | 1；Annual Daylight 只接受 1 |
| `hoys_` | 0–8759 列表 | 留空为全年 |
| `_detail_level_` | 0 / 1 / 2 | 低 / 中 / 高 |

## 常见坑

1. **把 EnergyPlus 构造当 Radiance 材质**：两套体系不通用，必须另建 ModifierSet。
2. **玻璃 `_trans` 填成 SHGC**：太阳得热系数通常高于可见光透过率，采光结果会虚高。
3. **WEA 时间步不是 1**：[[HB Annual Daylight]] 直接报错，别在天空文件上省事。
4. **建了材质集却忘记应用**：模型仍用默认灰材质，各房间结果几乎一样。
5. **反射率之和超过 1**：`_reflect` 加 `_spec_` 大于 1 在物理上不成立，渲染会出现异常亮斑。

## 下一步

材质和天空就位后，进入 [第 19 章 · 传感器网格与视图](19-sensor-grids-views.md)：决定“在哪里测”和“从哪里看”。
