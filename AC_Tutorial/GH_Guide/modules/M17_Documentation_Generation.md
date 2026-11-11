# Documentation Generation (Component) 详解 / Documentation Generation Documentation

## 功能介绍 / Function Description
本组件用于将 Markdown 文档转换为 PDF、HTML 或其他格式的文档，实现自动化文档生成，方便用户查阅、打印或在线发布。它支持批量转换、模板定制以及交互式预览。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Source Files** | 文字列表 | 任意 Markdown 文件路径列表 | 空 | 需要转换的 Markdown 文件路径，支持通配符通配（如 `*.md`）。 |
| **Output Format** | 选择列表 | `PDF`, `HTML`, `PDF/HTML`（组合） | `PDF` | 生成的文档格式，可选单格式或组合格式。 |
| **Template** | 文字 | 自定义 HTML 模板路径 | 空 | 使用自定义 HTML 模板进行渲染，默认使用内置模板。 |
| **Output Directory** | 文字 | 有效目录路径 | 当前工作目录 | 生成文档的目标目录，若不存在会自动创建。 |
| **Template Variables** | 文字 | JSON 格式的键值对 | 空 | 用于在模板中动态替换变量（如版本号、作者信息）。 |
| **Verbose** | 布尔 | `True`/`False` | `False` | 开启详细日志输出，便于调试。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Output File** | 文字 | 生成的文档文件完整路径。 |
| **Status** | 文字 | `Success`, `Failed`, `Invalid Input`, `Missing Dependency`。 |
| **Log** | 文字 | 详细的转换过程日志，包括文件读取、格式转换、渲染步骤等。 |
| **Output File List** | 文字列表 | 生成的所有文档文件的路径列表。 |

## 示例 / Example
1. **准备 Markdown 文件**：在 `docs/` 目录下创建 `intro.md`，内容如下：<br>
   ```markdown<br>
   # 欢迎使用 Rhino 8 教程<br>
   这是一份关于 Rhino 8 及 Grasshopper 的入门指南。<br>
   <br>
   ## 1. 安装 Rhino 8<br>
   ...<br>
   ```
2. **运行组件**：在画面中拖入 **Documentation Generation** 组件。<br>
   - **Source Files** = `docs/*.md`<br>
   - **Output Format** = `PDF`<br>
   - **Output Directory** = `C:/Docs/Output`<br>
   - **Verbose** = `True`<br>
   - **Template** = 空（使用内置模板）<br>
3. **执行**：触发组件，系统生成 `C:/Docs/Output/intro.pdf`，并在日志中显示 `Status: Success`。<br>
4. **查看结果**：打开生成的 PDF 文件，查看文档是否完整、格式正确。  

## 网页样式示例 / HTML Sample
```html
<div class="doc-gen-card">
  <h2>Documentation Generation (文档生成)</h2>
  <p><strong>功能介绍:</strong> 将 Markdown 文档转换为 PDF、HTML 或两者结合的格式，实现自动化文档生成。</p>
  <p><strong>Function Description:</strong> Converts Markdown files to PDF/HTML formats with customizable templates and output options.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Source Files</strong> – Markdown 文件路径列表（支持通配符）。</li>
    <li><strong>Output Format</strong> – PDF / HTML / PDF+HTML（组合）。</li>
    <li><strong>Template</strong> – 自定义 HTML 模板路径（可选）。</li>
    <li><strong>Output Directory</strong> – 生成文档的保存目录。</li>
    <li><strong>Template Variables</strong> – JSON 格式的键值对，用于模板替换。</li>
    <li><strong>Verbose</strong> – 开启详细日志输出。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Output File</strong> – 生成文档的完整路径。</li>
    <li><strong>Status</strong> – Success / Failed / Invalid Input / Missing Dependency。</li>
    <li><strong>Log</strong> – 详细的转换过程日志。</li>
    <li><strong>Output File List</strong> – 生成文件的路径列表。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-html"><div class="doc-gen-card">
    <h2>Documentation Generation (文档生成)</h2>
    <p><strong>功能介绍:</strong> 将 Markdown 文档转换为 PDF、HTML 或两者结合的格式，实现自动化文档生成。</p>
    <p><strong>Function Description:</strong> Converts Markdown files to PDF/HTML formats with customizable templates and output options.</p>

    <h3>输入参数</h3>
    <ul>
      <li><strong>Source Files</strong> – Markdown 文件路径列表（支持通配符）。</li>
      <li><strong>Output Format</strong> – PDF / HTML / PDF+HTML（组合）。</li>
      <li><strong>Template</strong> – 自定义 HTML 模板路径（可选）。</li>
      <li><strong>Output Directory</strong> – 生成文档的保存目录。</li>
      <li><strong>Template Variables</strong> – JSON 格式的键值对，用于模板替换。</li>
      <li><strong>Verbose</strong> – 开启详细日志输出。</li>
    </ul>

    <h3>输出参数</h3>
    <ul>
      <li><strong>Output File</strong> – 生成文档的完整路径。</li>
      <li><strong>Status</strong> – Success / Failed / Invalid Input / Missing Dependency。</li>
      <li><strong>Log</strong> – 详细的转换过程日志。</li>
      <li><strong>Output File List</strong> – 生成文件的路径列表。</li>
    </ul>
</div></code></pre>
```

## 使用说明 / Usage Notes
- **Source Files**：支持通配符（如 `docs/*.md`），可一次性转换多个文件。  
- **Output Format**：选择 `PDF` 生成 PDF 文档，`HTML` 生成网页，`PDF+HTML` 生成两者。  
- **Template**：若提供自定义模板，系统会使用该模板渲染；否则使用内置简洁模板。  
- **Template Variables**：通过 JSON 键值对可以在模板中动态替换文字（如版本号、作者名）。  
- **Verbose**：打开后会在日志中显示每一步的详细操作，便于调试。  
- **Output Directory**：若不存在会自动创建，确保有写入权限。  

## 小结 / Summary
Documentation Generation 组件实现了 Markdown 到 PDF/HTML 的自动化转换，支持批量处理、模板定制和详细日志，极大提升了文档制作的效率与一致性，适用于教程、手册、技术文档的批量生成与发布。

**下一章节**：M17 将介绍 **Deployment Automation**（部署自动化），提供将文档与组件打包、发布到私有/公共仓库的自动化流程。