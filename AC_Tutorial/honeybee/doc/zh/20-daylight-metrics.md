# 20 · 采光指标与模拟

> DF 看最不利，sDA 看全年，ASE 看刺眼。

## 本章解决什么

材质、天空、网格、相机都已就位，剩下的是选对**配方（Recipe）**并读懂指标：

- **采光系数（DF, Daylight Factor）**：阴天条件下室内照度与室外水平照度之比，看最不利情况。
- **全年采光（Annual Daylight）**：逐时算出每个测点的照度，再转成 DA、cDA、UDI。
- **sDA（空间采光自主度）**：全年工作时间中，达到照度阈值的**面积比例**。
- **ASE（全年直射暴露）**：直射照度超过 1000 lux 且累计超过 250 小时的**面积比例**。
- **定点（Point-in-Time）**：某一时刻的照度或渲染图，用来看效果与出图。

## 需要的组件

| 组件 | 中文 | 用途 | 关键输入 |
|---|---|---|---|
| [[HB Daylight Factor]] | 采光系数 | 阴天 DF，不用气象 | `_model` |
| [[HB Annual Daylight]] | 全年采光 | 逐时照度与 DA | `_wea`、`_schedule_` |
| [[HB Annual Daylight Metrics]] | 全年采光指标 | 由结果再算 DA、UDI | `_results`、`_occ_sch_` |
| [[HB Spatial Daylight Autonomy]] | 空间采光自主度 | 算 sDA | `_DA`、`mesh_` |
| [[HB Annual Sunlight Exposure]] | 全年直射暴露 | 算 ASE | `_results`、`_occ_sch_` |
| [[HB Imageless Annual Glare]] | 无图像全年眩光 | 生成 DGP 结果 | `_wea`、`_glare_thresh_` |
| [[HB Annual Glare Metrics]] | 全年眩光指标 | GA、sGA | `_results`、`_glare_thresh_` |
| [[HB Direct Sun Hours]] | 直接日照小时数 | 累计直射时间 | `_wea`、`_timestep_` |
| [[HB Point-In-Time Grid-Based]] | 时刻网格采光 | 单时刻照度 | `_sky`、`_metric_` |
| [[HB Point-In-Time View-Based]] | 时刻视图渲染 | 单时刻图像 | `_sky`、`_resolution_` |
| [[HB Sky View]] | 天空视野 | SVF 天空视野系数 | `_model` |
| [[HB False Color]] | 伪彩色图 | 把 HDR 转伪彩 | `_hdr` |
| [[HB Extract HDR]] | 提取 HDR | 换视角或取出子图 | `_view`、`_hdr` |
| [[HB Radiance Parameter]] | Radiance 参数 | 精度档位 | `_detail_level_` |
| [[HB Recipe Settings]] | 配方设置 | 并行数与目录 | `_workers_` |

## 操作步骤

1. 准备三样输入：材质集（第 18 章）、挂好的网格（第 19 章）、`timestep_ = 1` 的 `.wea`。
2. 采光系数：[[HB Daylight Factor]] 只接 `_model`，`_run = True`。`results` 是百分比，可直接接 [[LB Spatial Heatmap]]。
3. 全年采光：[[HB Annual Daylight]] 接 `_model`、`_wea`、`_schedule_`（8760 小时占用计划），`_thresholds_` 填 `-t 300 -lt 100 -ut 3000`，`enhanced_ = True`。
4. 逐点指标：[[HB Annual Daylight Metrics]] 接 `_results` 与 `_occ_sch_`、`_threshold_ = 300`、`_min_max_ = (100, 3000)`。
5. sDA：[[HB Spatial Daylight Autonomy]] 的 `_DA` 接上一步的 DA，`mesh_` 接网格面（用于按面积加权），`_target_time_ = 0.5`。
6. ASE：[[HB Annual Sunlight Exposure]] 接 `_results`，`_threshold_ = 1000`、`_target_hrs_ = 250`；输出 `ASE` 是面积比例，`hrs_above` 是逐点小时数。
7. 眩光：[[HB Imageless Annual Glare]] → [[HB Annual Glare Metrics]]，`_glare_thresh_ = 0.4`（DGP），`_target_time_ = 0.95`。
8. 定点：[[HB Point-In-Time Grid-Based]] 用 CIE 或气候天空出照度；[[HB Point-In-Time View-Based]] 出 HDR 渲染图。
9. 出图：网格结果接 [[LB Spatial Heatmap]]；HDR 接 [[HB False Color]] 看伪彩，[[HB Extract HDR]] 换视角，再调曝光。
10. 提速：先用 [[HB Radiance Parameter]] 的 `_detail_level_ = 0` 跑通，再升档；[[HB Recipe Settings]] 的 `_workers_` 设为本机 CPU 数。

## 参数怎么填

| 参数 | 单位 / 取值 | 建议 |
|---|---|---|
| `_thresholds_`（Annual） | 文本 | `-t 300 -lt 100 -ut 3000`（办公） |
| `_threshold_`（Metrics） | lux | 300（住宅可 150） |
| `_min_max_` | lux | `(100, 3000)` |
| `_target_time_`（sDA） | 0–1 | 0.5，即 50% 工作时间 |
| `_threshold_`（ASE） | lux | 1000 |
| `_target_hrs_`（ASE） | 小时 | 250 |
| `_glare_thresh_` | DGP | 0.4 |
| `enhanced_` | 布尔 | `True`，更准地处理直射 |
| `_detail_level_` | 0 / 1 / 2 | 低 / 中 / 高 |
| `_resolution_` | 像素 | 800；预览可用 400 |

## 常见坑

1. **不给占用计划**：默认把全部小时当有人，sDA 虚高，结果不可用。
2. **拿平均照度当 sDA**：sDA 是**面积比例**，不是平均照度，也不是 DA 的平均值。
3. **只看 ASE 越小越好**：ASE 低说明无直射眩光，但可能采光不足，必须和 sDA 一起看。
4. **WEA 时间步不是 1**：[[HB Annual Daylight]] 直接报错；`hoys_` 过滤后小时数也要对得上。
5. **网格没挂上或材质没应用**：结果全为 0 或一片均匀，先回第 18、19 章检查。

## 下一步

能量与采光两条线都通了，进入 [第 21 章 · 完整案例](21-case-study.md)：用一间办公室把全流程串起来。
