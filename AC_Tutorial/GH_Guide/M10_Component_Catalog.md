# Component Catalog (Component) 目录 / Component Catalog Documentation

## 功能介绍 / Function Description
本组件提供了一个可搜索的组件目录，列出所有已实现的组件（如电池、电源、导出与渲染等），并支持通过关键字进行智能检索与自动补全，帮助用户快速定位所需组件及其文档链接。

## 组件列表 / Component List
| 编号 | 组件名称 | 文档链接 |
|------|----------|----------|
| **M7** | 电池组件 (Battery Component) | [M7_Battery_Component.md](M7_Battery_Component.md) |
| **M8** | 电源组件 (Power Component) | [M8_Power_Component.md](M8_Power_Component.md) |
| **M9** | 导出与渲染组件 (Export & Render Component) | [M9_Export_Render_Component.md](M9_Export_Render_Component.md) |
| **M1** | Rhino 8 环境准备 | [M1_Rhino8_Environment.md](M1_Rhino8_Environment.md) |
| **M2** | 基础操作与画布布局 | [M2_Rhino8_BasicOps.md](M2_Rhino8_BasicOps.md) |
| **M3** | 组件搜索与自动补全 | [M3_Rhino8_Search.md](M3_Rhino8_Search.md) |
| **M4** | 参数详解与示例 | [M4_Rhino8_Parameters.md](M4_Rhino8_Parameters.md) |
| **M5** | UI/UX 设计与美化 | [M5_Rhino8_UI_Design.md](M5_Rhino8_UI_Design.md) |
| **M6** | 完整教程与示例项目 | [M6_Rhino8_Tutorial_Project.md](M6_Rhino8_Tutorial_Project.md) |

> **注**：每个编号对应一个独立的 Markdown 文件，文档已全部提交至 Git 仓库，可通过相对路径访问。

## 智能搜索与自动补全 / Smart Search & Auto‑Complete
- **输入框**：位于组件目录面板的顶部，支持即时模糊匹配。  
- **匹配范围**：组件名称、文档标题、关键字均可被检索。  
- **自动补全**：输入前三个字符即弹出匹配列表，点击可直接跳转至对应文档或在画布中定位组件。  
- **快捷键**：`Esc` 关闭下拉列表，`Enter` 在当前画布中定位对应组件。

## 使用示例 / Example Usage
1. 在 **Component Catalog** 面板的搜索框中输入 `电源`。  
2. 列表即时过滤，显示 **Power Component (M8)** 与相关文档链接。  
3. 点击 **Power Component** 链接，自动打开 **M8_Power_Component.md** 文档，或在画布中定位该组件。  

## 网页样式示例 / HTML Sample
```html
<div class="catalog-page">
  <h1 class="bilingual">
    <span class="zh">Component Catalog (组件目录)</span>
    <span class="en">Component Catalog</span>
  </h1>

  <input type="text" class="search-box" placeholder="🔍 搜索组件…" />

  <div class="catalog-list">
    <!-- 示例条目 -->
    <div class="catalog-item">
      <h3>M7 – 电池组件 (Battery Component)</h3>
      <p><a href="M7_Battery_Component.md">查看文档</a></p>
    </div>

    <div class="catalog-item">
      <h3>M8 – 电源组件 (Power Component)</h3>
      <p><a href="M8_Power_Component.md">查看文档</a></p>
    </div>

    <!-- 其余组件略 -->
  </div>

  <footer class="footer">
    <p>© 2026 组件目录 | 由 <strong>啄之堂</strong> 提供</p>
  </footer>
</div>
```

## 使用说明 / Usage Notes
- **搜索**：在搜索框中输入关键字，列表会实时过滤。  
- **跳转**：点击列表中的链接可直接打开对应文档，或在画布中高亮对应组件（若组件已在画布中）。  
- **扩展**：若新增组件，只需在本文件中添加新条目并提交 Git，即可自动更新目录。

## 小结 / Summary
Component Catalog 为用户提供了统一、可搜索的组件目录入口，帮助快速定位并获取每个组件的详细文档链接。配合 **M3** 组件搜索与自动补全，可实现从查找到使用的无缝衔接。

**下一章节**：M10 将介绍 **Web Integration**（网页集成）模块，实现将 HTML 文档直接嵌入 Grasshopper 界面的功能。