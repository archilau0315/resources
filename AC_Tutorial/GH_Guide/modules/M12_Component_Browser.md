# Component Browser (Component) 详解 / Component Browser Documentation

## 功能介绍 / Function Description
本组件提供一个可视化的组件浏览器，用户可以在面板中搜索、分类筛选、预览并直接将组件拖入画布。它基于 **Component Catalog** 目录，实现即点即用的组件导入功能，提升教程学习和实际项目搭建的效率。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Search Query** | 文字 | 任意文本 | 空 | 用于在组件目录中进行模糊搜索（支持组件名、参数名、文档关键字）。 |
| **Category Filter** | 选择列表 | `All`, `Data`, `Geometry`, `Utility`, `Analysis`, `Power`, `IO` | `All` | 按类别过滤组件列表，帮助快速定位相关组件。 |
| **Preview Size** | 数值 | 50‑300 | 150 | 预览缩略图的尺寸（像素），影响面板内展示的缩略图大小。 |
| **Auto‑Load** | 布尔 | `True`/`False` | `False` | 勾选后，选中组件后自动在画布中创建实例（等价于拖拽），否则仅提供链接。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Component Instance** | 文字（唯一 ID） | 当 **Auto‑Load** 为 **True** 时，返回组件在画布中的唯一实例 ID，可用于后续操作（如删除、重定位）。 |
| **Preview URL** | 文字 | 组件文档或预览图片的在线链接，便于在外部浏览器中查看完整文档。 |
| **Status** | 文字 | `Ready`, `Loading`, `Error`，表示浏览器是否已完成数据加载。 |

## 示例 / Example
1. **打开组件浏览器**：在画布右侧添加 **Component Browser** 组件。  
2. **设置搜索**：在 **Search Query** 输入 `电池`，Category Filter 保持 **All**。  
3. **预览**：选中 **Power Component (M8)**，Preview Size 自动调节为 150 px。  
4. **Auto‑Load**：勾选 **Auto‑Load**，随后点击列表中的 **Power Component**，组件实例会自动出现在画布左侧，随后可以直接与其他组件连线。  
5. **结果**：组件实例 ID 显示在 **Component Instance** 输出，Status 变为 **Ready**，Preview URL 指向 **M8_Power_Component.md** 文档。

## 网页样式示例 / HTML Sample
```html
<div class="browser-page">
  <h2>组件浏览器 - 啄之堂</h2>
  <input type="text" class="search-box" placeholder="🔍 搜索组件…" />
  <select class="category-select">
    <option value="All">全部</option>
    <option value="Data">数据</option>
    <option value="Geometry">几何</option>
    <option value="Utility">工具</option>
    <option value="Analysis">分析</option>
    <option value="Power">电源</option>
    <option value="IO">输入输出</option>
  </select>
  <div class="preview-area">
    <!-- 缩略图会动态生成 -->
  </div>
  <ul class="component-list">
    <!-- 列表项示例 -->
    <li class="component-item">
      <img class="thumb" src="https://example.com/thumbs/m8.png" alt="Power Component" />
      <span class="name">Power Component (M8)</span>
      <a href="M8_Power_Component.md" class="doc-link">文档</a>
    </li>
    <!-- 更多条目 -->
  </div>
  <footer class="footer">
    © 2026 啄之堂 | 组件浏览器 v1.0
  </footer>
</div>
```

## 使用说明 / Usage Notes
- **搜索**：在 **Search Query** 中输入关键字，列表会实时过滤。支持中文、英文以及组件内部参数名称。  
- **分类筛选**：通过 **Category Filter** 可以快速定位到特定功能类别（如 **Power** 只显示电源相关组件）。  
- **预览**：鼠标悬停在列表项上会弹出对应的 **Preview URL**，帮助快速确认组件功能。  
- **Auto‑Load**：勾选后，点击组件条目即在画布中创建实例，省去手动拖拽的步骤；否则仅提供链接，需要手动拖拽。  
- **错误处理**：若 **Status** 显示 **Error**，检查网络连接或 URL 是否有效，并在 **Debug Log** 中查看详细错误信息。

## 小结 / Summary
Component Browser 为用户提供了集搜索、分类、预览与一键导入于一体的组件管理界面，极大简化了教程学习与实际项目搭建的流程。它与 **M10 Component Catalog** 紧密集成，确保所有已实现组件均可通过统一入口访问。

**下一章节**：M13 将介绍 **Component Launcher**（组件启动器），实现对已加载组件的快速启动、参数预设与保存的功能。