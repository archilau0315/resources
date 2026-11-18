# A · 术语表

> 收录 Ladybug Tools 工作流中最常遇到的 120 个术语，中英对照。

| English | 中文 | 说明 |
|---|---|---|
| Ladybug | 瓢虫 | 气象与环境数据分析工具集，负责 EPW、太阳、舒适度与图表。 |
| Honeybee | 蜜蜂 | 建筑几何与围护结构建模工具集，衔接能量与采光模拟。 |
| Dragonfly | 蜻蜓 | 城市与街区尺度建模工具集，本项目不涉及。 |
| Pollination | 授粉平台 | 官方云平台与一键安装器，可托管模拟与结果。 |
| EPW | EnergyPlus 气象文件 | 8760 小时逐时气象数据，含温度、湿度、风速与太阳辐射。 |
| DDY | 设计日文件 | 供负荷计算使用的典型设计日参数。 |
| STAT | 统计文件 | epw 配套的统计摘要，含设计条件与极值温度。 |
| HOY | 全年小时序号 | 1–8760，用于按小时索引数据。 |
| MOY | 全年分钟序号 | 1–525600，用于亚小时级索引。 |
| Analysis Period | 分析时段 | 起止月份、日期与小时组成的时间过滤器。 |
| Data Collection | 数据集合 | 带单位与时间标签的数值序列。 |
| Header | 数据头 | 描述数据类型、单位与分析时段。 |
| Sky Matrix | 天空矩阵 | 按天空分块与时段统计的辐射矩阵。 |
| Sky Dome | 天空穹顶 | 半球网格，用于辐射与天空视野可视化。 |
| Sky Mask | 天空遮罩 | 遮挡物在天空穹顶上的投影。 |
| Sun Path | 太阳轨迹 | 全年太阳位置曲线与代表日时刻点。 |
| Solar Envelope | 太阳包络 | 满足日照要求所允许的最大体量。 |
| MRT | 平均辐射温度 | 人体周围表面的辐射换热等效温度。 |
| PMV | 预测平均投票 | ISO 7730 热舒适指标，-3 冷 到 +3 热。 |
| PPD | 预测不满意百分比 | 与 PMV 对应的不满意率。 |
| UTCI | 通用热气候指数 | 室外热环境评价指标，单位为等效温度。 |
| PET | 生理等效温度 | 室外热舒适的另一种等效温度指标。 |
| Adaptive Comfort | 自适应舒适 | ASHRAE 55 针对自然通风建筑的评价模型。 |
| Psychrometric Chart | 焓湿图 | 空气温湿度状态与舒适区的二维图。 |
| Degree Days | 度日数 | HDD/CDD，衡量采暖与制冷需求强度。 |
| Wind Rose | 风玫瑰图 | 按风向与风速统计的风频图。 |
| Radiation Rose | 辐射玫瑰图 | 按朝向统计的太阳辐射强度图。 |
| View Factor | 视角系数 | 表面看到另一表面的比例，辐射计算基础。 |
| Sky View Factor | 天空视野系数 | 测点可见天空的比例。 |
| Radiance | 辐射渲染引擎 | 采光与辐射模拟引擎，HB-Radiance 的底层。 |
| EnergyPlus | 能耗模拟引擎 | 美国能源部能耗模拟程序，HB-Energy 的底层。 |
| OpenStudio | OpenStudio 平台 | EnergyPlus 的建模与工作流封装。 |
| OSM | OpenStudio 模型 | OpenStudio 的原生模型文件。 |
| IDF | EnergyPlus 输入文件 | EnergyPlus 的原生输入文件。 |
| OSW | OpenStudio 工作流 | 描述一串 Measure 与模拟步骤的 JSON。 |
| Measure | 措施 | OpenStudio 中可复用的模型/参数修改脚本。 |
| Model | 模型 | Honeybee 的建筑总集合，导出与模拟的入口。 |
| Room | 房间 | 封闭体量，对应 EnergyPlus 的一个热区。 |
| Face | 面 | 房间的围护表面，分墙、屋面、楼板。 |
| Aperture | 窗洞 | 面上的透明开口，参与采光与得热。 |
| Door | 门洞 | 面上的门开口，可含玻璃。 |
| Subface | 子面 | 挂在宿主面上的窗、门或遮阳。 |
| Shade | 遮阳面 | 只参与遮挡与辐射、不做热工围护的几何。 |
| Zone | 热区 | 能量计算的控制单元，可含多个房间。 |
| Story | 楼层 | 房间的楼层归属，用于统计与分层显示。 |
| Multiplier | 重复倍数 | 用一个代表房间替代多个相同房间。 |
| Plenum | 吊顶腔 | 吊顶与楼板之间的回风空间。 |
| Adjacency | 相邻关系 | 两个房间共面时建立的内部边界。 |
| Boundary Condition | 边界条件 | 面的外侧环境：室外、地表、相邻、绝热。 |
| Construction | 构造 | 由材料层组成的墙体/屋面/楼板/窗做法。 |
| Construction Set | 构造集 | 整套建筑构造的打包。 |
| Material | 材料 | 构造的最小层，含热工与光学参数。 |
| U-Value | 传热系数 | 单位面积温差下的传热量，W/m²K。 |
| SHGC | 太阳得热系数 | 透过窗的太阳得热比例。 |
| VLT | 可见光透过率 | 玻璃透过可见光的比例。 |
| R-Value | 热阻 | 材料抵抗传热的能力，U 值的倒数。 |
| ProgramType | 房间用途模板 | 人员、照明、设备、新风等内扰的打包。 |
| Schedule | 运行计划 | 逐时数值时间表，如人员在室率。 |
| Setpoint | 温度设定点 | 空调采暖与制冷的控制温度。 |
| LPD | 照明功率密度 | 单位面积照明功率，W/m²。 |
| EPD | 设备功率密度 | 单位面积设备功率，W/m²。 |
| Infiltration | 渗透风 | 通过缝隙无组织进入的室外空气。 |
| Ventilation | 新风 | 有组织引入的室外空气。 |
| DOAS | 独立新风系统 | 只处理新风的系统，末端另设。 |
| VAV | 变风量系统 | 通过改变送风量调节负荷的全空气系统。 |
| Ideal Air Loads | 理想空调负荷 | 不建具体设备的负荷计算方法。 |
| HVAC | 暖通空调 | 供热、通风与空调系统总称。 |
| SHW | 生活热水 | Service Hot Water。 |
| EUI | 能耗强度 | 单位面积年能耗，kWh/m²。 |
| End Use | 终端用途 | 能耗按供暖、制冷、照明等分项。 |
| Peak Load | 峰值负荷 | 设计条件下的最大冷热负荷。 |
| Sizing | 设备选型 | 按设计日负荷确定设备容量。 |
| Thermal Load Balance | 热负荷平衡 | 负荷的分项来源拆解。 |
| Shadow Calculation | 阴影计算 | 太阳遮挡的计算频率与算法设置。 |
| Modifier | Radiance 材质 | 定义表面光学行为的材质。 |
| ModifierSet | 材质集 | 整套 Radiance 材质的打包。 |
| BSDF | 双向散射分布函数 | 描述复杂玻璃光学特性的数据。 |
| WEA | 天空文件 | Radiance 的逐时天空辐照度文件。 |
| CIE Sky | CIE 标准天空 | 晴天、阴天、中间天等标准亮度分布。 |
| Climate Based Sky | 气候天空 | 由气象数据生成的逐时天空。 |
| Sensor Grid | 传感器网格 | 采光计算的测点集合。 |
| View | 视图 | 相机位置与朝向，用于渲染与眩光。 |
| DF | 采光系数 | 室内照度与室外水平照度之比，%。 |
| sDA | 空间采光自主度 | 达到照度阈值的面积比例。 |
| ASE | 全年直射暴露 | 直射照度超阈值的累计小时数。 |
| UDI | 有用采光照度 | 处于有效照度区间的时长比例。 |
| DGP | 日光眩光概率 | 评价眩光风险的指标。 |
| HDR | 高动态范围图像 | Radiance 渲染结果的原始格式。 |
| Recipe | 模拟配方 | 把模型、材质、天空打包为一套模拟任务。 |
| HBJSON | Honeybee 模型文件 | Honeybee 的原生 JSON 序列化格式。 |
| gbXML | 建筑信息交换格式 | Green Building XML，跨软件交换几何。 |
| Grasshopper | 参数化平台 | Rhino 的可视化编程环境。 |
| UserObject | 用户组件文件 | .ghuser，单个 Grasshopper 自定义组件。 |
| Cluster | 组件簇 | 把一组组件打包为可复用单元。 |
| Flatten | 拍平 | 把数据树压成单层列表。 |
| Graft | 嫁接 | 把列表每项包成独立分支。 |
| Data Tree | 数据树 | GH 的层级数据结构。 |
| Brep | 多重曲面 | Rhino 的曲面/实体几何类型。 |
| Tolerance | 容差 | 几何运算的精度阈值，建模前需统一。 |
| True North | 真北 | 地理正北，区别于磁北。 |
| Azimuth | 方位角 | 相对正北的水平角度。 |
| Altitude | 高度角 | 太阳或物体高于水平面的角度。 |
| Azimuth Range | 方位角范围 | 分析覆盖的方向区间。 |
| Ground Reflectance | 地面反射率 | 地面反射太阳辐射的比例。 |
| Albedo | 反照率 | 表面反射辐射的比例。 |
| Dry Bulb Temperature | 干球温度 | 普通温度计测得的空气温度。 |
| Wet Bulb Temperature | 湿球温度 | 考虑蒸发冷却后的最低可达温度。 |
| Dew Point | 露点温度 | 空气达到饱和的温度。 |
| Relative Humidity | 相对湿度 | 当前水汽压与饱和水汽压之比。 |
| Enthalpy | 焓 | 空气总热量，含显热与潜热。 |
| DNI | 法向直射辐射 | 垂直于太阳光线的直射辐照度。 |
| DHI | 水平散射辐射 | 水平面接收的散射辐照度。 |
| GHI | 水平总辐射 | 水平面接收的直射与散射之和。 |
| Illuminance | 照度 | 单位面积光通量，lux。 |
| Irradiance | 辐照度 | 单位面积辐射功率，W/m²。 |
| Luminance | 亮度 | 单位面积发光强度，cd/m²。 |
| Glare | 眩光 | 过亮或亮度过大对比引起的不适。 |

## 下一步

回到速查站，用术语名搜索组件；或直接进入 [B · 组件全索引](b-index.md)。
