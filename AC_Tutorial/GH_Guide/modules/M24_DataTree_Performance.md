# M24 Advanced Data Trees & Performance Optimization (Component) 详解 / 数据树高级与性能优化组件详解

## 功能介绍 / Function Description
本组件深入讲解 Grasshopper 数据树结构，包括 Graft、Flatten、Simplify、TrimTree、Path Mapper 等树操作，以及组件级与定义级的性能优化技巧，帮助用户处理复杂的分层数据与大规模模型。

This component deeply explains Grasshopper data tree structures, including Graft, Flatten, Simplify, TrimTree, Path Mapper and other tree operations, as well as component-level and definition-level performance optimization techniques, helping users handle complex hierarchical data and large-scale models.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Data Tree** | 数据树 | 任意数据树结构 | 空 | 需要处理的源数据树。 |
| **Operation** | 选择列表 | `Graft`, `Flatten`, `Simplify`, `TrimTree`, `Path Mapper` | `Simplify` | 要执行的数据树操作类型。 |
| **Path Expression** | 文字 | 路径表达式语法 | 空 | Path Mapper 操作所需的路径映射表达式。 |
| **Trim Mode** | 选择列表 | `Start`, `End`, `Both` | `End` | TrimTree 的修剪位置。 |
| **Parallel Mode** | 布尔 | `True`/`False` | `False` | 是否启用并行计算模式。 |
| **Cache Results** | 布尔 | `True`/`False` | `True` | 是否缓存中间计算结果。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Processed Tree** | 数据树 | 操作后的数据树结果。 |
| **Path Count** | 整数 | 结果中的路径数量。 |
| **Item Count** | 整数 | 结果中的数据项总数。 |
| **Execution Time (ms)** | 数值 | 操作执行耗时，毫秒。 |
| **Memory (MB)** | 数值 | 操作期间的内存占用，MB。 |
| **Optimization Tips** | 文字列表 | 针对当前数据树的优化建议列表。 |

## 示例 / Example
1. **准备数据**：用 **Series** 生成 0-9 的数列，用 **Cross Reference** 将其转换为 2 维数据树（路径如 {0;0}, {0;1}, ..., {1;0}, {1;1}...）。
2. **设置参数**：
   - **Data Tree** = Cross Reference 输出的数据树
   - **Operation** = `Flatten`
   - **Parallel Mode** = `False`
3. **运行**：输出的 **Processed Tree** 为扁平化后的单路径数据树（所有数据在 {0} 路径下），**Path Count** = 1，**Item Count** = 100。
4. **进阶**：使用 **Path Mapper** 将路径从 `{A;B}` 重映射为 `{B;A}`，实现转置效果。

## 使用说明 / Usage Notes
- **Graft**：将每个数据项拆分为独立路径，适合需要逐项处理的场景。
- **Flatten**：将所有路径合并为单一路径，适合需要整体处理的场景。
- **Simplify**：移除冗余的路径层级，保持数据结构尽可能紧凑。
- **性能优化**：禁用不需要的预览（Preview Off）、减少不必要的数据树嵌套、使用缓存避免重复计算。
- **大规模模型**：超过 1 万个对象时，建议分批处理或使用并行模式。

## 小结 / Summary
数据树高级与性能优化组件帮助用户掌握 Grasshopper 的核心数据结构，通过合理的树操作与优化策略，显著提升复杂定义的执行效率与可维护性。

---

**下一章节**：M25 发布与社区分享模块，介绍如何将开发好的定义与插件发布到 Grasshopper 社区与食堂（Food4Rhino）。

**Next Chapter**: M25 Publishing & Community Sharing, introducing how to publish developed definitions and plugins to the Grasshopper community and Food4Rhino.
