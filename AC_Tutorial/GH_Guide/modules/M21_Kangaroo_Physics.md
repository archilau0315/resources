# M21 Kangaroo Physics Simulation (Component) 详解 / 康格鲁物理模拟组件详解

## 功能介绍 / Function Description
本组件集成 Kangaroo 物理引擎，支持在 Grasshopper 中进行弹簧、重力、碰撞、折纸、气压等物理模拟，实现形态生成与结构优化。

This component integrates the Kangaroo physics engine, supporting spring, gravity, collision, origami, air pressure and other physics simulations in Grasshopper, enabling form-finding and structural optimization.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Geometry** | 几何体 | 点、线、曲面、网格 | 空 | 参与物理模拟的初始几何体。 |
| **Springs** | 列表 | 弹簧定义列表 | 空 | 定义弹簧连接的点对与刚度系数。 |
| **Gravity** | 布尔 | `True`/`False` | `True` | 是否启用重力加速度。 |
| **Gravity Strength** | 数值 | 0 - 50 | 9.81 | 重力强度，单位 m/s²。 |
| **Iterations** | 数值 | 1 - 1000 | 100 | 模拟迭代次数，越多越稳定但越慢。 |
| **Damping** | 数值 | 0 - 1 | 0.1 | 阻尼系数，用于防止震荡发散。 |
| **Anchor Points** | 点列表 | 锚点位置 | 空 | 固定不动的约束点。 |
| **Collision** | 布尔 | `True`/`False` | `False` | 是否启用碰撞检测。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Simulated Geometry** | 几何体 | 模拟后变形的几何体结果。 |
| **Forces** | 矢量列表 | 各作用点上的合力矢量。 |
| **Energy** | 数值 | 系统当前势能，用于判断是否收敛。 |
| **Converged** | 布尔 | `True` 表示模拟已收敛稳定。 |
| **Log** | 文字 | 模拟过程的详细日志。 |

## 示例 / Example
1. **创建几何体**：在画布中拖入 **Construct Point** 生成一组点，用 **Line** 连接形成网格。
2. **添加弹簧**：用 **Spring** 组件定义相邻点之间的弹簧连接，刚度设为 1.0。
3. **设置参数**：
   - **Geometry** = 网格点与线
   - **Gravity** = `True`
   - **Gravity Strength** = `9.81`
   - **Iterations** = `200`
   - **Damping** = `0.1`
   - **Anchor Points** = 四个角点（固定不变）
4. **运行**：输出的 **Simulated Geometry** 会显示在重力作用下下垂的网格形状，如悬索桥或帐篷结构。

## 使用说明 / Usage Notes
- **Kangaroo 插件**：需先安装 Kangaroo 插件（Food4Rhino 免费下载）。
- **收敛判断**：观察 **Energy** 输出，当数值不再显著下降时表示模拟已收敛。
- **锚点约束**：合理设置 **Anchor Points** 可防止整体漂移，保持结构稳定。
- **性能**：迭代次数越高计算越慢，实时预览建议控制在 100 次以内。

## 小结 / Summary
Kangaroo 物理模拟组件将物理引擎能力引入 Grasshopper，支持基于力学的形态生成与结构优化，适合膜结构、可弯曲构件、折纸建筑等设计场景。

---

**下一章节**：M22 C# 插件开发模板模块，介绍如何使用 Visual Studio 开发自定义 Grasshopper 插件。

**Next Chapter**: M22 C# Plugin Development Template, introducing how to develop custom Grasshopper plugins using Visual Studio.
