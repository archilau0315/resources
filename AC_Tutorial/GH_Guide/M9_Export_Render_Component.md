# Export & Render Component (Component) 详解 / Export & Render Component Documentation

## 功能介绍 / Function Description
本组件用于将 Grasshopper 模型导出为常用图像或文档格式（PNG、SVG、PDF），并可选地使用 Rhino 内置渲染器或外部渲染器（如 V‑Ray）进行高质量渲染。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Export Type** | 选项 | `PNG`, `SVG`, `PDF`, `Render` | `PNG` | 导出的文件类型。 |
| **Resolution (DPI)** | 数值 | 50‑300 DPI | 150 DPI | 导出图像的分辨率，仅对 PNG 与 Render 有效。 |
| **File Path** | 文字 | 任意有效路径 | 当前文件夹下的 `export.png` | 导出文件的保存位置（含文件名）。 |
| **Render Settings** (仅 `Render` 模式) | 结构体 | 可选 `V-Ray`, `Cycles`, `Custom` | `Custom` | 选择渲染引擎或使用自定义设置。 |
| **Output Folder** | 文字 | 任意有效路径 | 当前项目文件夹 | 渲染结果保存的文件夹。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Exported File** | 文字 | 成功导出后生成的文件完整路径。 |
| **Render Image** (仅 `Render` 模式) | 文字 | 渲染完成后生成的图像文件路径。 |
| **Status** | 文字 | `Success`、`Failed`、`Cancelled`。 |

## 示例 / Example
1. **创建组件**：在画布中拖入 **Export & Render** 组件。  
2. **设置参数**：  
   - **Export Type** = `PNG`  
   - **Resolution** = `300` DPI  
   - **File Path** = `C:\ Projects\House\House.png`  
   - **Mode** = `Render`（若需渲染）  
   - **Render Settings** = `V-Ray`  
   - **Output Folder** = `C:\ Projects\House\Render`  
3. **连线**：将组件的 **Geometry** 输出连接到需要导出的模型（如 **Mesh** 或 **Brep**），或直接使用 **Preview** 组件的几何体。  
4. **运行**：触发组件，系统生成文件并显示 **Exported File** 与 **Status**。  

## 网页样式示例 / HTML Sample
```html
<div class="component-card">
  <h2>Export & Render Component (Component) 详解</h2>
  <p><strong>功能介绍:</strong> 将模型导出为 PNG、SVG、PDF 或使用渲染器生成高质量图像。</p>
  <p><strong>Function Description:</strong> Exports a Grasshopper model to PNG, SVG, PDF, or renders it with a chosen renderer.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Export Type</strong> – PNG, SVG, PDF, Render (default PNG).</li>
    <li><strong>Resolution (DPI)</strong> – 50‑300 DPI, default 150 DPI (PNG/Render only).</li>
    <li><strong>File Path</strong> – Destination file path (default export.png).</li>
    <li><strong>Render Settings</strong> – V‑Ray, Cycles, Custom (default Custom) – only for Render mode.</li>
    <li><strong>Output Folder</strong> – Destination folder for rendered images (default project folder).</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Exported File</strong> – Full path of the generated file.</li>
    <li><strong>Render Image</strong> – Path of the rendered image (Render mode only).</li>
    <li><strong>Status</strong> – Success, Failed, Cancelled.</li>
  </ul>

  <h3>示例</h3>
  <p>Export Type = PNG, Resolution = 300 DPI, File Path = C:\ Projects\House\House.png, Render Settings = V‑Ray, Output Folder = C:\ Projects\House\Render → 生成高分辨率 PNG 并渲染为 V‑Ray 图像。</p>

  <h3>网页样式代码</h3>
  <pre><code class="language-html"><div class="component-card">
  <h2>Export & Render Component (Component) 详解</h2>
  <p><strong>功能介绍:</strong> 将模型导出为 PNG、SVG、PDF 或使用渲染器生成高质量图像。</p>
  <p><strong>Function Description:</strong> Exports a Grasshopper model to PNG, SVG, PDF, or renders it with a chosen renderer.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Export Type</strong> – PNG, SVG, PDF, Render (default PNG).</li>
    <li><strong>Resolution (DPI)</strong> – 50‑300 DPI, default 150 DPI (PNG/Render only).</li>
    <li><strong>File Path</strong> – Destination file path (default export.png).</li>
    <li><strong>Render Settings</strong> – V‑Ray, Cycles, Custom (default Custom) – only for Render mode.</li>
    <li><strong>Output Folder</strong> – Destination folder for rendered images (default project folder).</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Exported File</strong> – Full path of the generated file.</li>
    <li><strong>Render Image</strong> – Path of the rendered image (Render mode only).</li>
    <li><strong>Status</strong> – Success, Failed, Cancelled.</li>
  </ul>

  <h3>示例</h3>
  <p>Export Type = PNG, Resolution = 300 DPI, File Path = C:\ Projects\House\House.png, Render Settings = V‑Ray, Output Folder = C:\ Projects\House\Render → 生成高分辨率 PNG 并渲染为 V‑Ray 图像。</p>
</code></pre>
</div>
```

## 使用说明 / Usage Notes
- **PNG / SVG / PDF**：直接导出几何体为常见图像格式，适合快速预览或文档嵌入。  
- **Render**：选择渲染模式后，组件会使用指定的渲染引擎对当前视图或选定几何体进行光照渲染，生成高质量图像。  
- **文件路径**：可以使用绝对路径或相对路径，系统会自动创建不存在的文件夹。  
- **错误处理**：若路径无效或渲染引擎未安装，Status 会返回 `Failed`，并在 **Status** 输出中给出错误信息。  

## 小结 / Summary
Export & Render 组件提供了从模型到高质量图像的完整工作流，兼容多种文件格式和渲染引擎，极大提升了设计呈现的效率。将其与 **M8 Power Component** 结合，可实现“电源驱动 → 渲染 → 导出”的完整流程。

**下一章节**：M10 导出与渲染模块（Export & Render）将在后续章节详细展开。