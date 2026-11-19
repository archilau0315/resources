# 02 · 安装与自检

> 用 Pollination 一键装好，再用两个组件确认引擎齐全。

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [LBT 介绍及安装](https://www.bilibili.com/video/BV1jT4y1e7yA/)
- [如何安装 Ladybug tools](https://www.bilibili.com/video/BV1f94y1Y7dz/)

## 本章解决什么

装 Ladybug Tools 不只是装几个 Grasshopper 电池，还要装它背后调用的 Python 库、OpenStudio、EnergyPlus、Radiance。少装一样，组件能拖出来、能变绿，一运行就报错。本章给出顺序：先装、再看、最后用最小例子验一遍。

版本口径：组件 1.10.x（工具条里常见 1.10.0 / 1.10.1），支持 Rhino 7 和 Rhino 8，Windows 与 macOS 都可以。

两条安装路线：

| 路线 | 做法 | 适合谁 |
|---|---|---|
| Pollination 一键安装 | 下载官方安装器，一路下一步 | 绝大多数人，推荐 |
| 手动 pip 安装 | 在 Rhino 8 的 Python 里装 `lbt-grasshopper` 与四个组件包 | 需要锁定版本、离线部署的人 |

一键安装器会把组件、核心库、三个引擎和一批标准数据一起放到位；手动安装要自己管 Python 环境和引擎路径，出问题概率高得多。

![装好后的 Grasshopper：顶部出现 Ladybug、Honeybee、HB-Energy、HB-Radiance 四个标签页](../assets/shots/02-grasshopper.png)

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[HB Check Versions]] | 一次列出 lbt_gh、python、radiance、openstudio、energyplus 五个版本 |
| [[HB Config]] | 列出各项安装路径、标准库路径与默认模拟设置 |
| [[LB Versioner]] | 联网拉取并切换到指定版本的组件与核心库 |
| [[LB Sync Grasshopper File]] | 把画布里的旧组件替换成工具条里的当前版本 |
| [[LB Import EPW]] | 自检用：能读文件说明核心库正常 |
| [[LB SunPath]] | 自检用：能画出太阳轨迹说明 numpy 等依赖正常 |

## 操作步骤

1. 关掉 Rhino 和 Grasshopper，退出所有还在跑的模拟。
2. 去 pollination.cloud 下载 Pollination 安装器，运行，保持默认安装路径，装完重启电脑更保险。
3. 打开 Rhino，输入 `Grasshopper` 启动，确认顶部出现 Ladybug、Honeybee、HB-Energy、HB-Radiance 四个标签页。
4. 新建一个空白 GH 文件，拖出 [[HB Check Versions]]。五个输出应依次显示插件版本、Python 版本、Radiance 版本、OpenStudio 版本、EnergyPlus 版本，任何一个是空值即视为缺引擎。
5. 拖出 [[HB Config]]，逐个看 `python_exe`、`rad_install`、`os_install`、`ep_install` 四个路径是否存在；路径里出现中文或空格时，建议重装到纯英文路径。
6. 冒烟测试一：[[LB Import EPW]] 接一个 .epw，看 `location` 是否显示城市与经纬度。
7. 冒烟测试二：`location` 接 [[LB SunPath]] 的 `_location`，`_scale` 填 1，画布上应出现一圈太阳轨迹与指北针。
8. 需要更新或回滚时，[[LB Versioner]] 的 `_update` 设 True 即拉到最新；想锁定版本就把 `version_` 填成 `1.10.0` 这样的三段数字再运行。
9. 老文件里的组件显示为旧版时，用 [[LB Sync Grasshopper File]]，`_sync` 设 True，它会按工具条版本整片替换。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `_update`（LB Versioner） | True 才会执行更新；更新需要联网 |
| `version_`（LB Versioner） | 可选，如 `1.10.0`；不填则取最新开发版 |
| `_sync`（LB Sync Grasshopper File） | True，执行前先保存文件，替换不可撤销 |
| `_scale`（LB SunPath） | 1 对应半径 100 米，模型尺度大就调大 |
| `_epw_file` | 纯英文路径，例如 `D:\weather\Beijing.epw` |

## 常见坑

- 安装时 Rhino 没关干净，组件装进去但引擎没落地，[[HB Check Versions]] 里 `energyplus` 为空。
- 从压缩包解压出来的 `.ghuser`、`.dll` 被 Windows 标记为「来自其他计算机」而被拦截，右键属性里勾选「解除锁定」再重启 Rhino。
- 装了多个 Rhino 版本，插件只进了其中一个；在对应版本的 Grasshopper 里再查一次。
- 图省事把整个安装目录放在中文路径或带空格的目录下，OpenStudio 调用时直接失败。
- 组件全是橙色或提示 `OLD`，却去改参数，其实是版本不匹配，用 [[LB Versioner]] 或 [[LB Sync Grasshopper File]] 处理。
- 开了代理但没给 Python 进程走代理，[[LB Versioner]] 与天气下载都会超时。

## 下一步

环境确认无误后，先弄懂界面和数据的流向，否则后面只会照抄连线：读 [03 · 界面与数据流](03-interface.md)。
