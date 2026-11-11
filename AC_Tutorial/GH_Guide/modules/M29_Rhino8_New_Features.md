# M29 Rhino 8 New Features (Component) 详解 / Rhino 8 新特性组件详解

## 功能介绍 / Function Description
本组件介绍 Rhino 8 中的新建模功能及其在 Grasshopper 中的应用，包括 SubD 曲面、Selhybrid 选择、PushPull 拉推、Clipping Plane 剪切平面、Display 模式等。

This component introduces new modeling features in Rhino 8 and their Grasshopper applications, including SubD surfaces, Selhybrid selection, PushPull, Clipping Plane, Display modes, etc.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **SubD Object** | SubD 曲面 | SubD 几何体 | 空 | 需要编辑的 SubD 曲面对象。 |
| **SubD Operation** | 选择列表 | `Insert Edge`, `Crease`, `Smooth`, `Deloft` | `Smooth` | SubD 编辑操作类型。 |
| **PushPull Distance** | 数值 | 任意数值 | 0 | 拉推操作的位移距离。 |
| **Clipping Plane** | 平面 | 剪切平面 | 空 | 用于剪切显示的平面。 |
| **Display Mode** | 选择列表 | `Shaded`, `Rendered`, `Technical`, `Artistic` | `Shaded` | 视口显示模式。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Edited SubD** | SubD 曲面 | 编辑后的 SubD 曲面。 |
| **Converted Mesh** | 网格 | 从 SubD 转换的网格。 |
| **Converted Nurbs** | 曲面 | 从 SubD 转换的 NURBS 曲面。 |
| **Section Curves** | 曲线列表 | 剪切平面截面曲线。 |
| **Bounding Box** | 盒子 | 对象的包围盒。 |

## 示例 / Example
1. **创建 SubD**：用 **SubD Primitive** 创建一个 SubD 球体。
2. **编辑 SubD**：用 **SubD Edit** 插入一条边，用 **Crease** 设置边的锐度。
3. **转换输出**：将 SubD 转换为 **Mesh** 用于渲染，或转换为 **Nurbs** 用于精确制造。
4. **剪切显示**：用 **Clipping Plane** 截断模型，查看内部结构。
5. **运行**：输出 **Edited SubD** 显示编辑后的曲面，**Converted Mesh** 可直接用于 Custom Preview 渲染。

## 使用说明 / Usage Notes
- **SubD 转换**：SubD 转 Nurbs 会生成多面体近似，转 Mesh 适合渲染和 3D 打印。
- **性能提示**：SubD 编辑实时反馈，复杂模型建议先简化控制点。
- **Rhino 8 专属**：SubD、PushPull 等功能仅在 Rhino 8 中可用，Rhino 7 不支持。

## 小结 / Summary
Rhino 8 新特性组件帮助用户快速掌握 SubD 自由曲面建模、Selhybrid 智能选择、PushPull 拉推编辑等新功能，并在 Grasshopper 中实现参数化自动化。

---

**下一章节**：M30 插件发布实战模块，介绍如何将开发好的 Grasshopper 插件完整打包并发布到 Food4Rhino 和 GitHub。

**Next Chapter**: M30 Plugin Publishing Practice, introducing how to package and publish developed Grasshopper plugins to Food4Rhino and GitHub.
