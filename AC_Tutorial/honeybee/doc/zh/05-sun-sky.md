# 05 · 太阳、天空与阴影

> 把站点位置变成太阳轨迹，再用它判断谁被挡住、谁晒得到。
![年度气象数据映射到太阳轨迹：全年 8760 小时数值在天球上的可视化](../assets/shots/05-sun-sky.png)

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [太阳、太阳辐射与环境](https://www.bilibili.com/video/BV11P4y1F7AA/)
- [日照分析](https://www.bilibili.com/video/BV1XR4y1L7Qb/)

## 本章解决什么

有了 Location，就能回答三个日常问题：一年里太阳怎么走、某个时刻谁在阴影里、这块地最多能盖多高。本章的主线是「Location → 太阳轨迹 → 太阳矢量 → 遮挡判断」，天空穹顶与天空遮罩是另一条支线，用来看辐射从哪个方向来。

先记住一个容易搞错的约定：所有 `north_` 参数都是「北与 Rhino +Y 轴的夹角，逆时针为正」，所以 90 表示西、270 表示东。模型里北朝 -Y 时，`north_` 应填 180，而不是 0。

`hoys` 是全年小时序号（Hour of the Year，1–8760），可以由 [[LB Analysis Period]] 的 `hoys` 输出，也可以由 [[LB Calculate HOY]] 按月、日、时换算。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB SunPath]] | 画全年太阳轨迹，输出太阳矢量、高度角、方位角 |
| [[LB Compass]] | 在模型里画指北针，校对方向 |
| [[LB Set Rhino Sun]] | 把指定时刻的太阳写进 Rhino 太阳设置，配合阴影与渲染 |
| [[LB View From Sun]] | 从太阳方向开一个视口，直观检查遮挡 |
| [[LB Sky Mask]] | 把周边建筑投影到天空穹顶，看被挡掉多少天空 |
| [[LB Solar Envelope]] | 按日照要求算出允许的最大体量 |
| [[LB Magnetic to True North]] | 磁北换算真北，修正磁偏角 |
| [[LB Cumulative Sky Matrix]] | 由辐射数据生成天空矩阵，是穹顶与辐射分析的前置 |
| [[LB Sky Dome]] | 把天空矩阵画成彩色穹顶 |

## 操作步骤

1. `location` 接 [[LB SunPath]] 的 `_location`，`north_` 按模型实际朝向填写，`_scale` 先填 1（半径 100 米）。
2. 想只看几个代表日，就用 [[LB Analysis Period]] 或 [[LB Calculate HOY]] 生成 `hoys`，接 [[LB SunPath]] 的 `hoys_`；不接则默认全年。
3. 运行后画布上出现太阳轨迹弧线与 `compass`，用 [[LB Compass]] 的 `_north_` 填同一个角度画一个更大的指北针用于出图。
4. 把 `vectors` 接给 [[LB Direct Sun Hours]] 或 [[LB Solar Envelope]] 的 `_vectors`，这就是所有日照计算的输入。
5. 检查某天某时的阴影：[[LB Calculate HOY]] 算出 `hoy`，接 [[LB Set Rhino Sun]] 的 `hoys_`，`_location` 与 `north_` 保持一致，`_run` 设 True，再到 Rhino 显示面板打开太阳与阴影。
6. 想直接看「从太阳看过去」：`vectors` 里挑一个接 [[LB View From Sun]] 的 `_vector`，`_center_pt_` 指向模型中心，会新开一个视口。
7. 判断场地遮挡：把周边建筑接 [[LB Sky Mask]] 的 `context_`，`_center_` 放在关注点，`_density_` 用 1 或 2，输出 `sky_view` 就是可见天空比例。
8. 看辐射方向：[[LB Import EPW]] 的 `direct_normal_rad`、`diffuse_horizontal_rad` 与 `hoys` 一起接 [[LB Cumulative Sky Matrix]]，再把 `sky_mtx` 接 [[LB Sky Dome]]。
9. 磁北图纸：[[LB Magnetic to True North]] 的 `_location`、`_mag_north`、`_year_` 填齐，用输出的 `true_north` 作为所有 `north_` 的输入。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `north_` | 0 = 北朝 +Y；逆时针 90 = 西，270 = 东；北朝 -Y 填 180 |
| `hoys_` | 1–8760 的整数或列表；不接即全年逐时 |
| `_scale_`（SunPath / Sky Dome） | 1 对应半径 100 米 |
| `_scale_`（Compass） | 1 对应半径 10 米，通常是 SunPath 的 1/10 |
| `projection_` | 留空 = 三维穹顶；填 `Orthographic` 或 `Stereographic` 得二维投影图 |
| `_density_`（Sky Mask） | 1–3，越大越精细也越慢 |
| `solar_rights_` | True 算「不遮挡邻居」的限高，False 算「自己获得日照」的限高 |
| `_ground_ref_` | 地面反射率，默认 0.2，草地可用 0.2–0.25 |

## 常见坑

- `north_` 一栏空着，默认 0，于是把画在 -Y 方向的北当成 +Y，所有方位结论反了 180°。
- 太阳轨迹看不见，多半是 `_scale` 太小（模型几百米，轨迹半径只有 100 米），被模型盖住。
- [[LB Set Rhino Sun]] 的 `_run` 没设 True，Rhino 里太阳纹丝不动。
- Rhino 里没开阴影显示，改了太阳也看不到明暗。
- 传 `vectors` 时用了全年数据，但 [[LB Direct Sun Hours]] 的 `_timestep_` 填了 1，小时数整体偏大。
- [[LB Solar Envelope]] 的 `_obstacles` 要水平面或闭合曲线，随手丢了体块进去会算不出边界。

## 下一步

太阳矢量有了，就可以统计辐射、画图表：读 [06 · 数据分析与图表](06-data-analysis.md)。
