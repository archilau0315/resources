# M27 Structural Analysis (Component) 详解 / 结构分析组件详解

## 功能介绍 / Function Description
本组件介绍在 Grasshopper 中进行基础结构受力分析，包括梁、板、桁架的应力、位移、变形计算，以及与 Karamba、Kangaroo 结构插件的对接方法。

This component introduces basic structural analysis in Grasshopper, including stress, displacement, and deformation calculation for beams, plates, and trusses, and integration with Karamba and Kangaroo structural plugins.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Structure Geometry** | 几何体 | 线、曲面、网格 | 空 | 需要分析的结构几何体（梁、板或桁架）。 |
| **Material** | 材质 | 弹性模量、泊松比 | 钢材 | 材料属性，包括弹性模量、密度、泊松比。 |
| **Load** | 力/荷载 | 点力、分布力、压力 | 0 | 作用于结构的外部荷载。 |
| **Support** | 支撑 | 固定、铰支、滚动支撑 | 空 | 结构的边界约束条件。 |
| **Analysis Type** | 选择列表 | `Linear`, `Nonlinear`, `Modal` | `Linear` | 分析类型：线性弹性、非线性、模态。 |
| **Mesh Density** | 整数 | 1 - 100 | 10 | 有限元网格密度，越高越精确但越慢。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Displacement** | 矢量列表 | 各节点的位移矢量。 |
| **Stress** | 数值列表 | 各单元的应力数值。 |
| **Strain** | 数值列表 | 各单元的应变数值。 |
| **Reaction Force** | 矢量列表 | 支撑反力。 |
| **Max Stress** | 数值 | 最大应力值及其位置。 |
| **Safety Factor** | 数值 | 安全系数（屈服强度 / 最大应力）。 |

## 示例 / Example
1. **创建结构**：用 **Line** 生成一根梁，用 **Divide Curve** 将其分割为若干段。
2. **添加组件**：在画布中拖入 **Structural Analysis** 组件。
3. **设置参数**：
   - **Structure Geometry** = 分割后的线段
   - **Material** = 钢材（弹性模量 200 GPa）
   - **Load** = 中心点向下 10 kN
   - **Support** = 两端固定
   - **Analysis Type** = `Linear`
4. **运行**：输出 **Max Stress** 显示最大应力，**Safety Factor** 显示安全系数。若安全系数 < 1.5，建议加粗梁体或更换材质。

## 使用说明 / Usage Notes
- **单位统一**：所有力、长度、应力单位需保持一致（建议 N、mm、MPa）。
- **插件依赖**：高级结构分析建议安装 Karamba3D 插件（Food4Rhino）。
- **简化模型**：初步设计阶段建议用梁单元简化，避免过细的实体网格。

## 小结 / Summary
结构分析组件为 Grasshopper 中的结构化设计提供基础受力计算能力，帮助在设计早期评估结构安全性，适合桁架、框架、膜结构等结构形式。

---

**下一章节**：M28 生成式设计模块，介绍如何使用进化算法和昆虫算法进行设计优化。

**Next Chapter**: M28 Generative Design, introducing design optimization using evolutionary algorithms and Galapagos.
