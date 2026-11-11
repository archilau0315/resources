# M23 GhPython Script Library (Component) 详解 / GhPython 脚本库组件详解

## 功能介绍 / Function Description
本组件提供 GhPython 脚本开发指南与常用脚本库，包括 Python 脚本组件基础、RhinoCommon API 调用、数据树操作、自定义类封装与多脚本模块化管理。

This component provides GhPython script development guidelines and a common script library, including Python script component basics, RhinoCommon API calls, data tree operations, custom class encapsulation and multi-script modular management.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Script Code** | 文字 | 有效的 Python 代码 | 空 | 要执行的 GhPython 脚本代码。 |
| **Inputs** | 结构体 | 键值对映射 | 空 | 传递给脚本的输入变量名与值。 |
| **Library Path** | 文字 | 有效的文件夹路径 | 空 | 自定义 Python 模块库搜索路径。 |
| **Reload** | 布尔 | `True`/`False` | `False` | 是否强制重新加载已导入的模块。 |
| **Debug Mode** | 布尔 | `True`/`False` | `False` | 是否启用详细错误跟踪与调试输出。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Result** | 任意 | 脚本执行的返回结果（可为数值、几何体、列表等）。 |
| **Outputs** | 结构体 | 脚本中定义的输出变量键值对。 |
| **Error** | 文字 | 执行错误信息，成功时为空。 |
| **Log** | 文字 | 脚本执行的详细日志与 print 输出。 |
| **Status** | 文字 | `Success`, `Error`, `Timeout`。 |

## 示例 / Example
1. **添加组件**：在画布中拖入 **GhPython Script Library** 组件。
2. **编写脚本**：在 **Script Code** 中输入：
   ```python
   import rhinoscriptsyntax as rs
   import GhPython
   
   # 获取输入
   x = Inputs.get("x", 0)
   y = Inputs.get("y", 0)
   
   # 创建点
   pt = rs.AddPoint(x, y, 0)
   
   # 输出结果
   Outputs["point"] = pt
   Outputs["message"] = "Point created at ({}, {}, 0)".format(x, y)
   
   # 返回主结果
   result = pt
   ```
3. **设置输入**：
   - **x** = `10`
   - **y** = `20`
4. **运行**：输出的 **Result** 为创建的点对象，**Outputs** 包含 `point` 与 `message`，**Log** 显示执行信息。

## 使用说明 / Usage Notes
- **RhinoCommon API**：可直接导入 `rhinoscriptsyntax`、`Rhino.Geometry` 等命名空间调用 Rhino 功能。
- **数据树**：输入输出默认展开为单项，如需处理数据树需在脚本中使用 `ghpythonlib.treehelpers`。
- **模块化**：将常用代码保存为 `.py` 文件放在 **Library Path** 目录，通过 `import` 引用。
- **性能**：Python 脚本适合快速原型开发，高频计算建议改用 C# 插件。

## 小结 / Summary
GhPython 脚本库组件提供了轻量级的 Python 脚本开发能力，适合快速原型、自动化任务与简单算法实现，无需编译即可在 Grasshopper 中运行。

---

**下一章节**：M24 数据树高级与性能优化模块，介绍数据树结构、Graft、Flatten、Simplify 及性能优化技巧。

**Next Chapter**: M24 Advanced Data Trees & Performance Optimization, introducing data tree structures, Graft, Flatten, Simplify and performance optimization techniques.
