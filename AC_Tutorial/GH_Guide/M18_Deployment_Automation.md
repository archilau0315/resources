# Deployment Automation (Component) 详解 / Deployment Automation Documentation

## 功能介绍 / Function Description
本组件提供自动化部署与发布功能，用于将教程、组件库以及相关资源打包、发布到私有或公共仓库（如 GitHub、GitLab），实现 CI/CD（持续集成/持续部署）工作流，实现“一键发布”与自动化发布。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Deploy Type** | 选择列表 | `Local Package`, `GitHub Release`, `GitLab Release`, `Zip Archive` | `ZIP` | 部署的目标类型，决定后续的打包与发布方式。 |
| **Source Directory** | 文字 | 有效的项目根目录路径 | 当前项目根目录 | 需要打包的源码根目录，必须包含所有文档、组件、脚本等资源。 |
| **Version** | 文字 | 语义化版本号（如 `1.0.0`） | 当前项目版本 | 发布时使用的版本号，用于生成版本标识与 changelog。 |
| **Git Repository** | 文字 | 有效的 Git 仓库地址（HTTPS、SSH 或本地路径） | 空 | 若选择 GitHub/GitLab 发布，需提供对应的仓库地址。 |
| **Branch Name** | 文字 | 符合 Git 命名规则的分支名称 | `develop` | 用于创建或切换的发布分支，建议使用 `release/*` 或 `main`。 |
| **CI/CD Trigger** | 选择列表 | `Push`, `Pull Request`, `Schedule`, `Manual` | `Push` | CI/CD 流程触发的事件类型。 |
| **CI Pipeline** | 文字 | 有效的 CI 工作流文件路径（如 `.github/workflows/ci.yml`） | 空 | 需要执行的 CI 工作流文件路径，若为空则使用默认工作流。 |
| **Artifact Path** | 文字 | 生成的打包文件相对或绝对路径 | 空 | CI 工作流中生成的可发布文件（如打包的 ZIP、安装包）的路径。 |
| **Release Notes** | 文字 | 任意文本 | 空 | 发布说明文本，用于生成 Release 页面或发布说明文件。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Package File** | 文字 | 生成的打包文件完整路径（如 `Package_20260920_1.0.0.zip`）。 |
| **Status** | 文字 | `Success`, `Failed`, `Invalid Path`, `Missing Dependencies`。 |
| **Log** | 文字 | 详细的部署过程日志，包括文件收集、打包、提交、发布等步骤。 |
| **Release URL** | 文字 | 成功发布后生成的发布链接（如 GitHub Release URL）。 |
| **Package ID** | 文字 | 生成的包的唯一标识（如 `Package_20260920_1.0.0`）。 |

## 示例 / Example
1. **准备发布**：确保所有文件已提交到 Git，版本号为 `1.0.0`。<br>
   - **Deploy Type** = `GitHub Release`<br>
   - **Source Directory** = `E:\works\Aidev\Kbitai绝对安全\kbitai_com_cn\resources\AC_Tutorial`<br>
   - **Version** = `1.0.0`<br>
   - **Git Repository** = `https://github.com/yourorg/grasshopper-tutorial.git`<br>
   - **Branch Name** = `release/1.0.0`<br>
   - **CI/CD Trigger** = `Push`<br>
   - **CI Pipeline** = `.github/workflows/ci.yml`<br>
   - **Artifact Path** = `./dist/Grasshopper_Tutorial_1.0.0.zip`<br>
   - **Release Notes** = `首次正式发布，包含完整教程与组件库。`<br>
2. **执行**：运行 **Deployment Automation** 组件，系统会自动执行以下步骤：<br>
   - 检查 Git 仓库是否可写入<br>
   - 创建或切换到指定的发布分支<br>
   - 运行 CI 工作流（包括单元测试、参数校验、打包）<br>
   - 生成打包文件（ZIP）并上传至 GitHub Release<br>
   - 生成 **Package ID** 与 **Release URL**，并在日志中记录完整过程。 |
3. **结果**：生成的 **Package File** 为 `Package_20260920_1.0.0.zip`，`Status` 为 `Success`，`Release URL` 为 `https://github.com/yourorg/grasshopper-tutorial/releases/tag/1.0.0`，日志记录完整的部署过程。 |

## 网页样式示例 / HTML Sample
```html
<div class="deployment-card">
  <h2>Deployment Automation (部署自动化)</h2>
  <p><strong>功能介绍:</strong> 自动化打包与发布教程与组件，支持多种发布方式与 CI/CD 流程。</p>
  <p><strong>Function Description:</strong> Automates packaging and publishing of the tutorial and components, supporting multiple deployment targets and CI/CD workflows.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Deploy Type</strong> – `ZIP`, `GitHub Release`, `GitLab Release`, `Package`（默认 ZIP）。</li>
    <li><strong>Source Directory</strong> – 需要打包的根目录路径。</li>
    <li><strong>Version</strong> – 语义化版本号（如 `1.0.0`）。</li>
    <li><strong>Git Repository</strong> – 目标 Git 仓库地址（GitHub、GitLab 或本地）。</li>
    <li><strong>Branch Name</strong> – 发布分支名称（如 `release/1.0.0`）。</li>
    <li><strong>CI/CD Trigger</strong> – CI 触发事件（`Push`, `Pull Request`, `Schedule`, `Manual`）。</li>
    <li><strong>CI Pipeline</strong> – CI 工作流文件路径（如 `.github/workflows/ci.yml`）。</li>
    <li><strong>Artifact Path</strong> – 生成的打包文件路径。</li>
    <li><strong>Release Notes</strong> – 发布说明文本。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Package File</strong> – 生成的打包文件完整路径。</li>
    <li><strong>Status</strong> – `Success` / `Failed` / `Invalid Path` / `Missing Dependencies`。</li>
    <li><strong>Log</strong> – 详细的部署过程日志。</li>
    <li><strong>Release URL</strong> – 成功发布后生成的发布链接（如 GitHub Release URL）。</li>
    <li><strong>Package ID</strong> – 包的唯一标识（如 `Package_20260920_1.0.0`）。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-shell"><br>
# 设置参数<br>
<VersionControl> \\\n  --deploy-type GitHub Release \\\n  --source-dir E:\\works\\Aidev\\Kbitai绝对安全\\kbitai_com_cn\\resources\\AC_Tutorial \\\n  --version 1.0.0 \\\n  --git-repo https://github.com/yourorg/grasshopper-tutorial.git \\\n  --branch release/1.0.0 \\\n  --trigger push \\\n  --pipeline .github/workflows/ci.yml \\\n  --artifact ./dist/Grasshopper_Tutorial_1.0.0.zip \\\n  --notes \"首次正式发布，包含完整教程与组件库\" \\\n</code></pre>
```

## 使用说明 / Usage Notes
- **Deploy Type**：选择合适的发布方式。`ZIP` 适合本地分发，`GitHub Release` 与 `GitLab Release` 适合公开发布，`Package` 适合自定义安装包。  
- **Source Directory** 必须是包含所有教程文件、组件库、资源文件的根目录，确保不遗漏任何必要文件。  
- **Version** 使用语义化版本号（主版本.次版本.修订版本），便于后期回滚或热修复。  
- **Git Repository** 与 **Branch Name** 必须对应，确保发布分支存在且有写权限。  
- **CI/CD Trigger** 决定 CI 工作流何时自动执行；`Push` 适合代码提交后自动运行，`Schedule` 适合定期检查，`Manual` 适合人工触发发布。  
- **CI Pipeline** 必须指向有效的工作流文件，确保包含测试、参数校验、打包等步骤。  
- **Artifact Path** 必须指向已经生成的打包文件（如 ZIP、安装包），CI 工作流会在打包完成后上传该文件作为 Release 资产。  
- **Release Notes** 用于生成发布说明，建议简要说明本次发布的主要变更与新增内容。  
- **Status** 为 `Success` 时，`Package File` 为生成的打包文件路径，`Release URL` 为发布后可直接访问的链接。  

## 小结 / Summary
Deployment Automation 为整个教程与组件提供了一键式打包与发布能力，支持多种发布方式与 CI/CD 流程，确保教程与组件能够以多种形式被团队成员、合作伙伴或更广泛的用户群体所获取与使用。

**下一章节**：M18 将介绍 **Continuous Integration & Continuous Deployment (CI/CD) Automation**，提供更细粒度的 CI/CD 工作流配置与自动化发布流程。