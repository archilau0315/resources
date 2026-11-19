# 04 · 天气数据与站点

> 找到离项目最近的站点，拿到 epw、stat、ddy 三个文件。
![风垂直剖面与 EPW 数据：从气象文件导入到风速高度分布的工作流](../assets/shots/04-weather-epw.png)

## 📺 配套教学视频

> 视频来自 B 站 UP 主「孤岛Studio」的《Fly!Ladybug&Honeybee 建筑性能分析教程》合集，国内可直接打开，无需翻墙。点击链接在新标签页打开 B 站。

- [气象数据来源与内容](https://www.bilibili.com/video/BV1Km4y1d7b8/)
- [绿建气候信息一键生成获取（EPW 国内镜像）](https://www.bilibili.com/video/BV1KQ4y1u77S/)
- [气象数据与被动策略在线可视化 V2.0](https://www.bilibili.com/video/BV1Ra4y1o7q5/)
- [Ladybug Tools 的本土化数据库分享](https://www.bilibili.com/video/BV1sX4y1e7Qi/)

## 本章解决什么

所有 Ladybug 分析都从一份气象文件开始。EPW（EnergyPlus Weather）是逐时气象数据，一年 8760 行，含干球温度、相对湿度、风速风向、太阳直射与散射辐射、气压。它通常取「典型气象年（TMY）」，即用多年观测拼出的一个代表性年份，不代表某一年的真实天气。

一个站点一般配三个文件：

| 文件 | 内容 | 用在哪 |
|---|---|---|
| .epw | 8760 小时逐时气象 | 太阳、辐射、采光、能耗模拟 |
| .stat | 统计摘要：气候分区、设计条件、极值周 | 被动式策略、暖通设计条件 |
| .ddy | 设计日（Design Day）参数 | 冷热负荷与设备选型 |

有两条路拿数据：没有文件时用 [[LB EPWmap]] 找到站点链接，再交给 [[LB Download Weather]] 下载；已经有文件时直接 [[LB Import EPW]] 读本地路径。

## 需要的组件

| 组件 | 作用 |
|---|---|
| [[LB EPWmap]] | 打开在线气象地图，按地图选站点、复制下载链接 |
| [[LB Download Weather]] | 按 URL 下载并解压，一次输出 epw、stat、ddy |
| [[LB Import EPW]] | 读 epw，输出 Location 与全部逐时数据集合 |
| [[LB Import Location]] | 只取站点经纬度、时区、海拔 |
| [[LB Construct Location]] | 手工输入经纬度造一个 Location |
| [[LB Deconstruct Location]] | 把 Location 拆成经纬度等数值，用于核对 |
| [[LB Import STAT]] | 读 stat，取气候分区与设计条件 |
| [[LB Import DDY]] | 读 ddy，输出可直接用的设计日 |
| [[LB EPW to DDY]] | 只有 epw 时，自动生成 ddy |

## 操作步骤

1. 拖出 [[LB EPWmap]]，`_epw_map` 设 True，浏览器会打开气象地图；在地图上放大到项目所在城市。
2. 点站点图标，页面会给出一串下载地址，复制其中 epw 的链接。
3. 把链接粘到 [[LB Download Weather]] 的 `_weather_URL`，`_folder_` 可留空（默认存到 Ladybug 天气目录），运行后得到 `epw_file`、`stat_file`、`ddy_file` 三个路径。
4. 把 `epw_file` 接给 [[LB Import EPW]] 的 `_epw_file`，`location` 接 Panel，核对城市名、经纬度、时区、海拔。
5. 把 `stat_file` 接给 [[LB Import STAT]] 的 `_stat_file`，看 `ashrae_zone` 与 `koppen_zone` 两个气候分区是否符合预期。
6. 把 `ddy_file` 接给 [[LB Import DDY]] 的 `_ddy_file`，`design_days` 输出供后面的负荷组件使用。
7. 若站点只给了 epw，用 [[LB EPW to DDY]] 补设计日：`_weather_file` 接 epw，`_percentile_` 填 0.4，`_write` 设 True。
8. 想核对坐标，用 [[LB Deconstruct Location]] 把 `location` 拆开；没有气象文件但只想看太阳轨迹时，用 [[LB Construct Location]] 手填。
9. 全部接好后接一个 Panel 收尾，把 `location` 留一条线到画布边缘，后面每一章都会用到它。

## 参数怎么填

| 参数 | 填什么 |
|---|---|
| `_epw_file` | .epw 完整路径，英文目录，例如 `D:\weather\Beijing.epw` |
| `_weather_URL` | EPWmap 页面上复制的下载链接，通常指向 .zip |
| `_folder_` | 下载目录，留空则进默认天气文件夹 |
| `_percentile_` | 设计日百分位，常用 0.4 或 1.0，越大越保守 |
| `monthly_cool_` | True 会额外生成 12 个逐月制冷设计日，仅供特殊研究 |
| `_write`（EPW to DDY） | True 才真的写出 .ddy |
| `_latitude_` / `_longitude_` | 北纬为正，东经为正；北京约 39.9 / 116.4 |
| `_time_zone_` | 中国填 8，填 0 太阳位置会整体偏 8 小时 |
| `_elevation_` | 海拔，米；影响气压与干球温度修正 |

## 常见坑

- 只下 epw 就去做负荷，结果没有设计日，`HB Peak Loads` 一类组件直接报缺 ddy。
- epw 与 stat 文件名不一致或不在同一目录，[[LB Import STAT]] 读不到配套统计。
- 在 EPWmap 里随手选了邻近国家的站点，纬度差几度，太阳高度角和辐射全变。
- 用内陆站点代替沿海项目，风速偏小，自然通风结论过于乐观。
- 手工构造 Location 时把时区填成 0，太阳轨迹会整体平移 8 小时。
- 把天气文件放在中文路径下，Python 读取时编码报错。

## 下一步

有了站点和逐时数据，就可以画太阳轨迹、算遮挡了：读 [05 · 太阳、天空与阴影](05-sun-sky.md)。
