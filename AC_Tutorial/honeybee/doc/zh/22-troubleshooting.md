# 22 · 排错手册与检查清单

> Ladybug Tools 的报错大多不在组件本身，而在上游：单位、几何、路径、引擎。这份手册按"先环境、再几何、后模拟"的顺序排了 29 条高频问题，每条给出现象、真实原因和可执行的排查动作；末尾是一张提交前必过的 12 项清单。

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [ladybug_honeybee 使用分享](https://www.bilibili.com/video/BV1dzgseUE9S/)
- [Fly!Ladybug&Honeybee 课程简介（合集总览）](https://www.bilibili.com/video/BV16Y411L7CM/)

## 怎么用这份手册

先看报错出现在哪一步，再看该步对应的表。组件面板上的 `report` 输出永远是第一现场——它比弹窗里的 `Solution exception` 详细得多，先读它，再动手。

排查顺序固定为：**单位 → 几何 → 属性 → 路径与引擎 → 模拟参数**。跳过前面直接改参数，十有八九白改。

## 报错信息怎么读

- 弹窗里的 `Solution exception`：只有最后一行，信息量最小，仅用于定位是哪个电池。
- 组件的 `report` 输出：带完整堆栈和文件名，永远是第一现场。
- 模拟目录下的 `.err` 与 `.html`：EnergyPlus 的 `Fatal` / `Severe` 全在这里，按行号往上找第一条。

## 一、安装与环境（6 条）

| 现象 | 可能原因 | 排查与解决 |
|---|---|---|
| 打开 GH 全是空电池或红色电池 | 插件未完整安装，或 user objects 未加载 | 重装 Pollination 版；用 [[HB Check Versions]] 看五项是否都有版本号 |
| 提示找不到 EnergyPlus | 引擎未安装，或安装目录被清理 | [[HB Config]] 查看 `ep_install`；用 [[LB Versioner]] 重装引擎 |
| 提示找不到 Radiance | Radiance 未安装，或路径含中文 | [[HB Config]] 查看 `rad_install`；改装到纯英文路径 |
| 首次运行卡十几分钟 | 首次调用会解压并编译引擎 | 属正常，看 `report` 是否有进度；不要反复点运行 |
| 四个标签页版本不一致 | 四个包分别升级过 | [[HB Check Versions]] 对照；用 [[LB Versioner]] 统一下载；重启 Rhino |
| 旧文件里的电池全部过时 | 0.x → 1.x 组件重命名 | [[LB Legacy Updater]] 升级；HBJSON 用 [[HB Update HBJSON]] |

## 二、几何与模型（8 条）

| 现象 | 可能原因 | 排查与解决 |
|---|---|---|
| 面积为 0 或负数 | 轮廓不闭合、面自交 | [[HB Validate Model]] 定位；[[HB Planarize Brep]] 平面化；重画轮廓 |
| 房间是"歪"的，模拟报非平面面 | Rhino 里是曲面或多段折面 | 只用平面面建模；必要时 [[HB Planarize Brep]] |
| 两个房间之间温度完全一样 | 共面未求解相邻，各自当成室外 | [[HB Solve Adjacency]]；漏面用 [[HB Patch Missing Adjacency]] |
| 室内温度几乎等于室外 | 外墙被设成绝热或相邻 | [[HB Visualize by BC]] 看边界条件；检查 `boundary_condition` |
| 窗开到了背面或室内侧 | 面法线方向反了 | [[HB Visualize Normals]] 检查；翻转几何后重建 Room |
| 窗面积为零或报越界 | 窗高 + 窗台高超过墙高 | 调小 `_win_height_` 或 `_ratio`；[[HB Validate Model]] 复核 |
| 房间数量比预期少一半 | 实体不闭合，转换时被丢弃 | 检查 Rhino 是否为封闭多重曲面；[[HB Intersect Solids]] 求交 |
| 楼层复制后 Z 轴错位 | 基准点或层高不一致 | [[HB Set Story]] 统一楼层；复制用同一基准点 |

## 三、能量模拟（8 条）

| 现象 | 可能原因 | 排查与解决 |
|---|---|---|
| 能耗大了一千倍 | 毫米与米混用，或 W 与 kW 混用 | Rhino 单位设米；数值统一用 [[LB To SI]] 或 [[LB To Unit]] 转换 |
| 结果 sql 是空的 | `run_` 为 False，或模拟中途失败 | 拨到 True；读 `report` 末尾的 fatal error |
| 模拟跑一半中断 | 内存不足、网格或时间步太密 | 减少输出项；放大时间步；分房间分批跑 |
| 冷负荷为 0 | 未设空调系统或设定点缺失 | [[HB IdealAir]] 打底；检查用途模板是否套上 |
| 新风量明显偏大 | 新风与渗透重复计入 | 检查 [[HB Apply Load Values]] 的 `vent_per_person_` 与 `infilt_per_exterior_` |
| 照明能耗与面积不成比例 | 运行计划未套用或全是 1 | 检查用途模板、`_schedule_`；[[HB Apply ProgramType]] 重套 |
| 结果每次完全一样 | 参数没真正变化，或读了旧 sql | 换输出目录；改参数后确认 `run_` 重新触发 |
| 设计日/峰值负荷为空 | 没提供 DDY 或 STAT | [[LB Import STAT]]；[[HB Peak Loads]] 需要 `_ddy_file` |

## 四、采光与结果（6 条）

| 现象 | 可能原因 | 排查与解决 |
|---|---|---|
| 采光结果全是 0 | 窗未赋材质，或法线反向 | [[HB Apply Window Modifier]] 补材质；[[HB Visualize Normals]] 查法线 |
| 材质全黑 | Radiance 材质缺失或反射率为 0 | [[HB Apply Face Modifier]]；检查 [[HB ModifierSet]] 的子集 |
| sDA 恒为 100% | 阈值或运行计划被设成 0 | 检查 [[HB Annual Daylight]] 的 `_thresholds` 与 `_schedule_` |
| ASE 全部超标 | 无遮阳，或阈值单位写错 | 加 [[HB Extruded Border Shades]]；确认 `_threshold_` 为 1000 lux |
| 采光模拟慢到不可用 | 网格太密、精度太高 | `_grid_size` 从 0.5 放到 1.0；[[HB Radiance Parameter]] 降档 |
| 结果方向镜像 | 北向未设置或磁北未校正 | [[HB Simulation Parameter]] 的 `_north_`；[[LB Magnetic to True North]] |
| 图出不来、图例是空的 | 数据未接到图例，或视图没开 | [[LB Create Legend]] 接 `_values`；检查 GH 预览开关 |

## 提交前 12 项自检清单

1. Rhino 单位为米，模型原点靠近建筑中心，真北角度已确认。
2. 每个房间都是闭合实体，所有面共面且无自交。
3. 法线一律朝外，[[HB Visualize Normals]] 无红蓝混杂。
4. 相邻关系已求解，没有该相邻却标成室外的面。
5. 每扇窗都在外墙上，面积大于 0，未跨越楼层线。
6. 构造集与气候区匹配，窗构造确实带了玻璃材料。
7. 用途模板与运行计划一致，人员密度、照明、设备量级合理。
8. 新风与渗透没有重复计入。
9. EPW 与 STAT 来自同一站点，路径全英文且文件完整。
10. [[HB Check Versions]] 五项齐全，版本与教程一致。
11. 采光网格高度 0.8 m、间距不小于 0.5 m，只铺在需要评价的房间。
12. 结果三件套齐全：`sql`、`report`、可视化图，且能互相印证。

## 一句话排错法

**结果离谱先查单位，结果为零先查法线，跑不起来先查引擎，跑得慢先查网格。** 四句话覆盖九成问题，剩下的交给 `report`。
