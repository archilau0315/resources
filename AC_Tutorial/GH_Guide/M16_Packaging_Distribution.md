# Packaging & Distribution (Component) 详解 / Packaging & Distribution Documentation

## 功能介绍 / Function Description
本组件负责将整个 Grasshopper 教程、组件库以及相关资源打包为可安装的包或发布到私有/公共仓库。用户可以选择 **ZIP**、**TAR.GZ**、**NSIS Installer** 或 **GitHub Release** 等多种发布方式，实现教程与组件的便捷分发与版本管理。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Package Type** | 选择列表 | `ZIP`, `TAR.GZ`, `NSIS Installer`, `GitHub Release` | `ZIP` | 打包的输出格式。 |
| **Source Directory** | 文字 | 任意有效目录路径 | 当前项目根目录 | 需要打包的源码根目录（包含所有 *.md、*.mdx、组件文件夹等）。 |
| **Version** | 文字 | 语义化版本号（如 `1.0.0`） | 当前项目版本 | 打包后产生的版本标识，用于发布标识与回滚。 |
| **Include Docs** | 布尔 | `True`/`False` | `True` | 是否在包中包含完整的文档（Markdown、HTML）。 |
| **Include Assets** | 布尔 | `True`/`False` | `True` | 是否在包中包含资源文件（截图、示例项目、预设文件等）。 |
| **Compression Level** | 数值 | 1‑9（ZIP/TAR） | 6 | 压缩比强度，数值越大压缩率越高，文件体积越小。 |
| **Release Notes** | 文字 | 任意文本 | 空 | 发布说明，用于 GitHub Release 或安装包说明文档。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Package File** | 文字 | 生成的打包文件完整路径（含文件名）。 |
| **Status** | 文字 | `Success`, `Failed`, `Invalid Path`, `Missing Dependencies`。 |
| **Log** | 文字 | 详细的打包过程日志，包括文件收集、压缩、验证等步骤。 |
| **Package ID** | 文字 | 生成的包的唯一标识（如 `Package_20260920_1.0.0`）。 |

## 示例 / Example
1. **准备发布**：确保所有文件已提交到 Git，版本号为 `1.0.0`。<br>
   - **Package Type** = `ZIP`<br>
   - **Source Directory** = `E:\works\Aidev\Kbitai绝对安全\kbitai_com_cn\resources\AC_Tutorial`<br>
   - **Version** = `1.0.0`<br>
   - **Include Docs** = `True`<br>
   - **Include Assets** = `True`<br>
   - **Compression Level** = `6`<br>
   - **Release Notes** = `首次正式发布，包含完整教程与组件库。`<br>
2. **执行打包**：运行 **Packaging & Distribution** 组件，系统生成 `Package_20260920_1.0.0.zip`，状态为 `Success`，`Package ID` 为 `Package_20260920_1.0.0`，日志记录全部文件已成功压缩。  
3. **验证**：在文件资源管理器中打开生成的 ZIP 包，确认包含 `M1‑M15` 所有 Markdown 文件、示例项目、`debug_log` 系列文件以及 `README.md`。  

## 网页样式示例 / HTML Sample
```html
<div class="package-card">
  <h2>Packaging & Distribution (打包与分发)</h2>
  <p><strong>功能介绍:</strong> 将教程与组件打包为可安装或发布的包，支持多种格式与发布渠道。</p>
  <p><strong>Function Description:</strong> Packages the entire tutorial, component library, and assets into installable archives or release packages for easy distribution.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Package Type</strong> – ZIP / TAR.GZ / NSIS Installer / GitHub Release (default ZIP).</li>
    <li><strong>Source Directory</strong> – 待打包的根目录路径。</li>
    <li><strong>Version</strong> – 语义化版本号（如 1.0.0）。</li>
    <li><strong>Include Docs</strong> – 是否包含完整文档（默认 True）。</li>
    <li><strong>Include Assets</strong> – 是否包含资源文件（默认 True）。</li>
    <li><strong>Compression Level</strong> – 压缩比（1‑9，默认 6）。</li>
    <li><strong>Release Notes</strong> – 发布说明文本（可为空）。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Package File</strong> – 生成的打包文件完整路径。</li>
    <li><strong>Status</strong> – Success / Failed / Invalid Path / Missing Dependencies。</li>
    <li><strong>Log</strong> – 详细的打包过程日志。</li>
    <li><strong>Package ID</strong> – 唯一包标识（如 Package_20260920_1.0.0）。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-text"><br>
Package Type = ZIP<br>
Source Directory = E:\works\Aidev\Kbitai绝对安全\kbitai_com_cn\resources\AC_Tutorial<br>
Version = 1.0.0<br>
Include Docs = True<br>
Include Assets = True<br>
Compression Level = 6<br>
Release Notes = 首次正式发布，包含完整教程与组件库。<br>
</code></pre>

<h3>网页样式代码</h3>
<pre><code class="language-html"><div class="package-card">
  <h2>Packaging & Distribution (打包与分发)</h2>
  <p><strong>功能介绍:</strong> 将教程与组件打包为可安装或发布的包，支持多种格式与发布渠道。</p>
  <p><strong>Function Description:</strong> Packages the entire tutorial, component library, and assets into installable archives or release packages for easy distribution.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Package Type</strong> – ZIP / TAR.GZ / NSIS Installer / GitHub Release (default ZIP).</li>
    <li><strong>Source Directory</strong> – 待打包的根目录路径。</li>
    <li><strong>Version</strong> – 语义化版本号（如 1.0.0）。</li>
    <li><strong>Include Docs</strong> – 是否包含完整文档（默认 True）。</li>
    <li><strong>Include Assets</strong> – 是否包含资源文件（默认 True）。</li>
    <li><strong>Compression Level</strong> – 压缩比（1‑9，默认 6）。</li>
    <li><strong>Release Notes</strong> – 发布说明文本（可为空）。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Package File</strong> – 生成的打包文件完整路径。</li>
    <li><strong>Status</strong> – Success / Failed / Invalid Path / Missing Dependencies。</li>
    <li><strong>Log</strong> – 详细的打包过程日志。</li>
    <li><strong>Package ID</strong> – 唯一包标识（如 Package_20260920_1.0.0）。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-text"><br>
Package Type = ZIP<br>
Source Directory = E:\works\Aidev\Kbitai绝对安全\kbitai_com_cn\resources\AC_Tutorial<br>
Version = 1.0.0<br>
Include Docs = True<br>
Include Assets = True<br>
Compression Level = 6<br>
Release Notes = 首次正式发布，包含完整教程与组件库。<br>
</code></pre>
</div>
```

## 使用说明 / Usage Notes
- **Package Type**：选择合适的打包格式。`ZIP` 与 `TAR.GZ` 适合本地分发，`NSIS Installer` 适合 Windows 环境的一键安装，`GitHub Release` 适合直接在 GitHub 上发布。  
- **Source Directory** 必须是包含所有教程 Markdown、组件文件夹以及资源文件的根目录，否则会导致缺失文件。  
- **Version** 用于标识发布版本，建议使用语义化版本号（主版本.次版本.修订版本），便于后期回滚或热修复。  
- **Include Docs / Include Assets**：勾选后确保文档与资源一起打包，便于离线使用或离线教学。  
- **Compression Level**：数值越大压缩率越高，但解压速度可能稍慢；对于大型教程包建议使用 `6` 或 `7` 的平衡值。  
- **Release Notes**：若使用 `GitHub Release`，此字段会作为发布描述出现在发布页面，建议撰写简要的发布说明。  
- **Status** 为 `Success` 时，`Package File` 为生成的压缩包路径，可直接分享或上传至发布平台。  

## 小结 / Summary
Packaging & Distribution 为整个教程与组件提供了统一的打包与发布能力，支持多种常用格式与发布渠道，确保教程与组件能够以多种形式被团队成员、合作伙伴或更广泛的用户群体所获取与使用。

**下一章节**：M16 将介绍 **Version Control & Release Management**（版本控制与发布管理），提供 Git 与 GitHub Actions 的完整工作流，实现自动化 CI/CD 与版本发布流程。