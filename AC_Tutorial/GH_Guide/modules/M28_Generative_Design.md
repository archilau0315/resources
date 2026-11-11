# M28 Generative Design (Component) 详解 / 生成式设计组件详解

## 功能介绍 / Function Description
本组件介绍在 Grasshopper 中进行生成式设计，包括参数空间定义、目标函数构建、进化优化（Galapagos）、昆虫算法（Human/UI）及结果筛选，帮助在海量设计方案中寻找最优解。

This component introduces generative design in Grasshopper, including parameter space definition, objective function construction, evolutionary optimization (Galapagos), insect algorithms (Human/UI), and result filtering, helping find optimal solutions from massive design alternatives.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Design Variables** | 数值列表 | 设计变量范围 | 空 | 可调节的设计参数（如长度、宽度、高度、角度）。 |
| **Objective Function** | 公式 | 数学表达式 | 空 | 需要优化的目标函数（如面积最小、强度最大）。 |
| **Constraints** | 布尔列表 | 约束条件 | 空 | 设计必须满足的约束（如体积上限、应力限制）。 |
| **Population Size** | 整数 | 10 - 500 | 50 | 进化算法的种群大小。 |
| **Generations** | 整数 | 10 - 1000 | 100 | 进化代数，越多越接近最优但越慢。 |
| **Mutation Rate** | 数值 | 0 - 1 | 0.1 | 变异概率，用于跳出局部最优。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Best Design** | 设计参数 | 最优设计的参数值集合。 |
| **Best Fitness** | 数值 | 最优适应度值。 |
| **Pareto Front** | 数值列表 | 多目标优化的帕累托前沿解集。 |
| **Convergence Curve** | 数值列表 | 各代最优适应度变化曲线。 |
| **All Designs** | 表格 | 所有迭代设计方案及其适应度。 |

## 示例 / Example
1. **定义变量**：用 **Number Slider** 创建 3 个设计变量（长度 500-2000 mm、宽度 300-1000 mm、高度 200-800 mm）。
2. **定义目标**：用 **Expression** 构建目标函数（如体积最小化：`x*y*z`）。
3. **添加约束**：用 **Gate And** 组合多个约束条件（如应力 < 允许应力）。
4. **运行优化**：在 Galapagos 编辑器中连接目标函数和变量，点击 **Solver** 开始进化。
5. **查看结果**：输出 **Best Design** 为最优尺寸，**Convergence Curve** 显示优化收敛过程。

## 使用说明 / Usage Notes
- **单目标 vs 多目标**：单目标优化适合明确目标（如成本最低），多目标适合权衡（如强度 vs 重量）。
- **收敛判断**：观察 **Convergence Curve**，当曲线趋于平缓时表示已收敛。
- **变异概率**：过高会导致不收敛，过低容易陷入局部最优，建议 0.05-0.15。

## 小结 / Summary
生成式设计组件将进化算法引入 Grasshopper，支持在复杂参数空间中自动搜索最优设计方案，适合拓扑优化、布局优化、形态生成等场景。

---

**下一章节**：M29 Rhino 8 新特性模块，介绍 Rhino 8 中 SubD、Selhybrid、PushPull 等新功能及其在 Grasshopper 中的应用。

**Next Chapter**: M29 Rhino 8 New Features, introducing SubD, Selhybrid, PushPull and other new features in Rhino 8 and their Grasshopper applications.
