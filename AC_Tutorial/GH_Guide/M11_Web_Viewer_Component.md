# Web Viewer Component (Component) 详解 / Web Viewer Component Documentation

## 功能介绍 / Function Description
本组件用于加载并显示 HTML 页面（本地文件或远程 URL），在 Grasshopper 中以面板形式呈现，实现类 Web 浏览器的交互体验，便于查看文档、演示或自定义网页内容。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **URL** | 文字 | 任意有效 URL 或本地文件路径 | `file:///C:/Temp/default.html` | 要加载的 HTML 页面地址。 |
| **Width (px)** | 数值 | 100‑2000 | 800 | 面板的宽度（像素）。 |
| **Height (px)** | 数值 | 100‑2000 | 600 | 面板的高度（像素）。 |
| **Refresh** | 布尔 | `True`/`False` | `False` | 当页面内容变化时是否自动刷新。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **HTML Content** | 文字 | 加载后的完整 HTML 内容（可用于后续文本处理）。 |
| **Panel Handle** | 文字 | 面板的唯一标识 ID，后续可用于关闭、刷新或重定位。 |

## 示例 / Example
1. **创建组件**：在画布中拖入 **Web Viewer** 组件。  
2. **设置参数**：  
   - **URL** = `file:///C:/Projects/Catalog.html`（本地目录下的目录页）  
   - **Width** = `800`  
   - **Height** = `600`  
   - **Refresh** = `True`（每次参数变更时刷新页面）  
3. **连线**：将 **HTML Content** 输出连接到 **Panel** 组件，即可在画布右侧实时显示 HTML 内容。  
4. **运行**：调整 **URL** 或 **Refresh** 参数后，面板会即时更新为新的 HTML 内容。  

## 网页样式示例 / HTML Sample
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>组件目录 - 啄之堂</title>
  <style>
    body {font-family: Arial, sans-serif; margin: 20px; background:#f5f5f5;}
    h1 {color:#0078D7;}
    .catalog {border-collapse: collapse; width: 100%;}
    .catalog th, .catalog td {border: 1px solid #ddd; padding: 8px;}
    .catalog th {background:#0078D7; color:#fff;}
  </style>
</head>
<body>
  <h1>组件目录 - 啄之堂</h1>
  <p>使用搜索框快速定位组件文档。</p>
  <input type="text" id="search" placeholder="🔍 搜索组件…" />
  <table class="catalog">
    <tr><th>编号</th><th>组件名称</th><th>文档链接</th></tr>
    <tr><td>M7</td><td>电池组件 (Battery)</td><td><a href="M7_Battery_Component.md">查看</a></td></tr>
    <tr><td>M8</td><td>电源组件 (Power)</td><td><a href="M8_Power_Component.md">查看</a></tr>
    <tr><td>M8</td><td>导出与渲染 (Export & Render)</td><td><a href="M9_Export_Render_Component.md">查看</a></td>
  </table>
</body>
</html>
```

## 使用说明 / Usage Notes
- **本地文件**：`file:///C:/Path/Page.html` 形式的路径可直接访问本地 HTML 文件。  
- **远程 URL**：`https://example.com/page.html` 可加载网络资源，前提是网络可达。  
- **刷新**：勾选 **Refresh** 选项后，每次调整 **URL**、**宽度**、**高度** 参数时面板会自动重新加载。  
- **调试**：若页面未显示，检查 **HTML Content** 输出是否为空，或确认 URL 是否可达。  

## 小结 / Summary
Web Viewer 组件为 Grasshopper 提供了内置的网页浏览器面板，使得文档、演示或自定义网页能够直接在 Grasshopper 环境中查看与交互，极大提升了信息呈现的便利性与可视化效果。

**下一章节**：M11 将介绍 **Component Browser**（组件浏览器），实现从目录到组件的完整导航与交互体验。