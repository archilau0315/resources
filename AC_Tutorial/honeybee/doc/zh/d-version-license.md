# D · 版本对照与许可

> 本教程以 Ladybug Tools 1.10.x 为准。四个 Grasshopper 包各自独立发版，面板上显示的数字又与包版本不同——这一页把三套编号对齐，并说明图标与正文的使用许可。

## 包版本对照

| 包（PyPI 名） | 本教程版本 | 组件数 | 负责范围 |
|---|---:|---:|---|
| `ladybug-grasshopper` | 随 1.10.58 发布 | 122 | 气象、太阳、数据分析、图表、舒适度 |
| `honeybee-grasshopper-core` | 随 1.10.58 发布 | 70 | 建模、显示、整理、序列化 |
| `honeybee-grasshopper-energy` | 随 1.10.58 发布 | 143 | 构造、运行计划、负荷、HVAC、模拟、结果 |
| `honeybee-grasshopper-radiance` | 随 1.10.58 发布 | 94 | Radiance 材质、天空、网格、采光配方 |
| `lbt-grasshopper` | 1.10.58 | — | 元包：统一依赖、引擎安装与版本管理 |

四个包合计 429 个组件，与本项目的组件库一一对应。四个标签页包的具体版本号由元包锁定，用 [[HB Check Versions]] 可读出实际值。

## 组件面板上的数字

电池标题栏的 `Message` 显示的是**核心库版本**，不是包版本。本机实测：绝大多数为 `1.10.0`；少数组件为 `1.10.1` 到 `1.10.4`（如 [[HB Room]]、[[HB Model to OSM]]、[[LB SunPath]]）。

三套编号的关系：

- **1.10.58**（lbt-grasshopper）＝ 你安装的那一整套；
- **四个标签页包各自的版本** ＝ 由元包锁定，互不同步；
- **1.10.0** ＝ 组件调用的 honeybee / ladybug 核心库版本。

看到三个不同的数字不必惊慌，用 [[HB Check Versions]] 确认五项齐全即可。

## Rhino 兼容

| 环境 | 状态 | 说明 |
|---|---|---|
| Rhino 7 | 支持 | 1.10.x 可正常运行，界面略旧 |
| Rhino 8 | 推荐 | 本教程的基准环境；首次运行会解压引擎，稍慢 |
| Rhino 9 | 需自测 | 开发版，需配最新 lbt-grasshopper；升级前先备份工程 |

同一台机器可以并存多个 Rhino 版本，但**插件目录只有一份**。在 Rhino 8 里点过 [[LB Versioner]] 更新后，Rhino 7 打开会提示版本变化，这是正常现象。

## 许可

### 图标：AGPL-3.0

四个 Grasshopper 包及其图标版权归 Ladybug Tools 所有，采用 **GNU AGPL-3.0**。本项目对图标的使用方式：

1. 仅用于说明对应组件的功能，属文档性引用；
2. 图标来自已安装插件的 `.ghuser` 文件，未做二次创作；
3. 不单独打包分发图标资源，不用于商业再销售；
4. 页面与条目显著标注 `Icon © Ladybug Tools, AGPL-3.0` 并链接源仓库。

### 正文：CC BY-NC 4.0

本教程的中文译名、正文、图表与站点代码采用 **CC BY-NC 4.0**：

- 可自由复制、改编、非商业传播；
- 必须署名并注明来源链接；
- 不得用于商业目的；
- 改编作品需沿用同一许可。

商业使用（培训、咨询交付、内部平台）请先联系授权。

## 致谢

- **Ladybug Tools**：Mostapha Roudsari、Chris Mackey 及全体贡献者，四个开源包与 Primer 文档是本教程的唯一事实来源。
- **EnergyPlus**：美国能源部（DOE）、NREL、Big Ladder Software。
- **OpenStudio**：Alliance for Sustainable Energy / NREL。
- **Radiance**：劳伦斯伯克利国家实验室（LBNL）。
- **社区**：Discourse 论坛上所有回答过"为什么我的模型不收敛"的人。

## 常用链接

| 用途 | 地址 |
|---|---|
| 官网与文档 | https://www.ladybug.tools/ · https://docs.ladybug.tools/ |
| 主仓库 | https://github.com/ladybug-tools/lbt-grasshopper |
| 论坛 | https://discourse.ladybug.tools/ |
| 安装与兼容矩阵 | https://github.com/ladybug-tools/lbt-grasshopper/wiki |
| AGPL-3.0 全文 | https://www.gnu.org/licenses/agpl-3.0.html |
| CC BY-NC 4.0 全文 | https://creativecommons.org/licenses/by-nc/4.0/ |

> 版本会变，方法不变。升级后先跑 [[HB Check Versions]]，再打开任意一章的复现步骤，从"模型校验"一路走到"结果对照"——能走通，就说明这一版没白升。
