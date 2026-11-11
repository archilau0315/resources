# M26 Data Visualization (Component) 详解 / 数据可视化组件详解

## 功能介绍 / Function Description
本组件介绍在 Grasshopper 中进行数据可视化的方法，包括数值图表、颜色映射、高度场、热力图、并行坐标图等，帮助将抽象数据转化为直观图形。

This component introduces data visualization methods in Grasshopper, including value charts, color mapping, height fields, heatmaps, parallel coordinate plots, etc., helping transform abstract data into intuitive graphics.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Data Values** | 数值列表 | 任意数值列表 | 空 | 需要可视化的数据列表。 |
| **Value Domain** | 定义域 | 有效定义域 | 自动计算 | 数据的最小最大值范围，用于颜色映射归一化。 |
| **Color Gradient** | 颜色渐变 | 颜色列表 | 蓝-绿-红 | 用于数值到颜色映射的渐变色列表。 |
| **Geometry** | 几何体 | 点、曲面、网格 | 空 | 可视化数据附着的目标几何体。 |
| **Map Mode** | 选择列表 | `Color`, `Height`, `Size`, `Label` | `Color` | 可视化映射方式：颜色、高度、大小或标签。 |
| **Scale Factor** | 数值 | 0.1 - 10.0 | 1.0 | 可视化效果的缩放比例。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Visual Geometry** | 几何体 | 带有可视化属性的几何体（着色、抬高或缩放）。 |
| **Color List** | 颜色列表 | 每个数据对应的映射颜色。 |
| **Min Value** | 数值 | 数据列表中的最小值。 |
| **Max Value** | 数值 | 数据列表中的最大值。 |
| **Legend** | 文字 | 图例说明文本。 |

## 示例 / Example
1. **准备数据**：用 **Series** 生成 0-100 的数列，作为输入数据。
2. **添加组件**：在画布中拖入 **Data Visualization** 组件。
3. **设置参数**：
   - **Data Values** = Series 输出的数列
   - **Map Mode** = `Color`
   - **Color Gradient** = 蓝 → 绿 → 红
   - **Scale Factor** = `1.0`
4. **运行**：输出的 **Visual Geometry** 会根据数值大小显示不同颜色，数值越大颜色越红，越小越蓝。

## 使用说明 / Usage Notes
- **颜色映射**：数据会先归一化到 0-1 范围，再映射到渐变色上。
- **多模式叠加**：可将同一数据同时用于颜色、高度和大小，实现多维度可视化。
- **性能提示**：大数据量（>1 万点）时建议先简化数据树，避免画布卡顿。

## 小结 / Summary
数据可视化组件帮助将 Grasshopper 中的抽象数值数据转化为可直观观察的图形，适合分析仿真结果、展示参数分布和设计对比。

---

**下一章节**：M27 结构分析模块，介绍如何在 Grasshopper 中进行结构受力分析与优化。

**Next Chapter**: M27 Structural Analysis, introducing structural analysis and optimization in Grasshopper.
