# Version Control & Release Management (Component) 详解 / Version Control & Release Management Documentation

## 功能介绍 / Function Description
本组件提供对 Git 版本控制流程的完整支持，包括分支管理、pull request（PR）工作流、自动化 CI/CD（Continuous Integration / Continuous Deployment）以及版本发布（Release）流程的实现。用户可以通过本组件配置 CI/CD 触发器、自动化测试、版本打包以及发布到 GitHub、GitLab 或其他 Git 主机。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Git Repository** | 文字 | 有效的 Git 仓库地址（HTTPS、SSH 或本地路径） | 空 | 需要管理的 Git 仓库地址，必须已经创建并可写入。 |
| **Branch Name** | 文字 | 符合 Git 命名规则的分支名称 | `develop` | 用于创建或切换的分支名称，建议使用 `develop`、`release/*`、`feature/*` 等命名规范。 |
| **Branch Protection** | 选择列表 | `Enabled`, `Disabled` | `Enabled` | 是否对指定分支开启保护规则（如要求 PR 审查、状态检查通过等）。 |
| **CI/CD Trigger** | 选择列表 | `Push`, `Pull Request`, `Schedule`, `Manual` | `Push` | 触发 CI/CD 流程的事件类型。 |
| **CI Pipeline** | 文字 | 有效的 CI 工作流文件路径（如 `.github/workflows/test.yml`） | 空 | 需要执行的 CI 工作流文件路径，若为空则使用默认工作流。 |
| **Release Type** | 选择列表 | `Patch`, `Minor`, `Major` | `Patch` | 发布时的版本增量类型，决定自动递增哪一段版本号。 |
| **Release Notes** | 文字 | 任意文本 | 空 | 发布说明文本，用于生成 Release 页面或发布说明文件。 |
| **Artifact Path** | 文字 | 打包文件生成的相对或绝对路径 | 空 | CI 工作流中生成的可发布文件（如打包的 ZIP、安装包）的路径。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Commit SHA** | 文字 | 本次提交的唯一 SHA1/ SHA256 标识。 |
| **Branch** | 文字 | 当前所在的分支名称。 |
| **Status** | 文字 | `Success`, `Failed`, `Skipped`, `Error`，表示操作结果。 |
| **Log** | 文字 | 详细的执行日志，包括 Git 操作、CI 触发、测试结果、发布步骤等。 |
| **Release URL** | 文字 | 成功发布后生成的发布链接（如 GitHub Release URL）。 |

## 示例 / Example
1. **初始化仓库**：在本地创建项目目录，执行 `git init` 并提交初始文件，随后运行 **Version Control & Release Management** 组件，设置 **Git Repository** 为 `https://github.com/yourorg/grasshopper-tutorial.git`，**Branch Name** 为 `develop`，**Branch Protection** 为 `Enabled`。<br>
2. **配置 CI/CD**：设置 **CI/CD Trigger** 为 `Push`，**CI Pipeline** 为 `.github/workflows/ci.yml`，确保每次 `Push` 都会自动执行单元测试、参数校验与打包。<br>
3. **创建新功能分支**：在 **Branch Name** 中输入 `feature/kangaroo-support`，组件自动创建并检出该分支，`Branch Protection` 保持 `Enabled` 确保后续 PR 必须通过测试与代码审查。<br>
4. **发布新版本**：当功能完成并合并到 `develop`，设置 **Release Type** 为 `Minor`，填写 **Release Notes**，并在 **CI/CD Trigger** 中选择 `Schedule`（每日自动检查），确保每次发布前自动运行完整测试与打包。<br>
5. **发布**：提交 **Release Type** 为 `Minor`，填写 **Release Notes**，组件自动创建 GitHub Release，生成 `Release URL`，并在 **Artifact Path** 中生成 `Grasshopper_Tutorial_1.0.0.zip`，状态为 `Success`。  

## 网页样式示例 / HTML Sample
```html
<div class="release-card">
  <h2>Version Control & Release Management (版本控制与发布管理)</h2>
  <p><strong>功能介绍:</strong> 提供 Git 分支管理、CI/CD 流程、自动化测试与版本发布的一站式解决方案。</p>
  <p><strong>Function Description:</strong> Implements a complete Git workflow with branch protection, CI/CD triggers, automated testing, and release automation for reliable version management.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Git Repository</strong> – 目标 Git 仓库的 HTTPS、SSH 或本地路径。</li>
    <li><strong>Branch Name</strong> – 用于创建或切换的分支名称（推荐使用 develop、release/*、feature/*）。</li>
    <li><strong>Branch Protection</strong> – 是否对分支启用保护规则（如 PR 审查、CI 检查通过）。</li>
    <li><strong>CI/CD Trigger</strong> – 控制 CI/CD 流程触发的事件（Push、Pull Request、Schedule、Manual）。</li>
    <li><strong>CI Pipeline</strong> – 要执行的 CI 工作流文件路径（如 .github/workflows/ci.yml）。</li>
    <li><strong>Release Type</strong> – 版本增量类型（Patch, Minor, Major）。</li>
    <li><strong>Release Notes</strong> – 发布说明文本，用于生成 Release 页面或发布说明。</li>
    <li><strong>Artifact Path</strong> – CI 工作流中生成的可发布文件路径（如打包的 ZIP）。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Commit SHA</strong> – 本次提交的唯一标识。</li>
    <li><strong>Branch</strong> – 当前所在的分支名称。</li>
    <li><strong>Status</strong> – Success / Failed / Skipped / Error。</li>
    <li><strong>Log</strong> – 详细的执行日志，包含 Git、CI、测试、发布步骤等。</li>
    <li><strong>Release URL</strong> – 成功发布后生成的发布链接（如 GitHub Release URL）。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-shell"><br>
# 初始化仓库并提交初始文件<br>
git init<br>
git add .<br>
git commit -m "Initial commit"<br>
<br>
# 配置版本控制组件<br>
<VersionControl> \\\n  --git-repo https://github.com/yourorg/grasshopper-tutorial.git \\\n  --branch develop \\\n  --protect-branch \\\n  --trigger push<br>
<br>
# 创建新功能分支<br>
<VersionControl> \\\n  --branch feature/kangaroo-support<br>
<br>
# 发布新版本<br>
<VersionControl> \\\n  --release-type Minor \\\n  --release-notes \"Add Kangaroo support component\" \\\n  --artifact-path ./dist/Grasshopper_Tutorial_1.0.0.zip<br>
</code></pre>

<h3>网页样式代码</h3>
<pre><code class="language-html"><div class="release-card">...（省略）...</div></pre>
</code></pre>
```

## 使用说明 / Usage Notes
- **Git Repository**：必须是一个已初始化的 Git 仓库，且用户拥有写入权限。若使用私有仓库，请确保已配置 SSH Key 或 Personal Access Token（PAT）。  
- **Branch Protection**：建议在 `develop`、`release/*`、`feature/*` 分支上启用保护，以强制 PR 审查、CI 检查通过后才能合并，避免直接提交到主分支。  
- **CI/CD Trigger**：常用的触发事件包括 `Push`（代码推送）和 `Pull Request`（PR 创建/更新），也可以使用 `Schedule`（定时）或 `Manual`（手动触发）进行定期检查或手动发布。  
- **CI Pipeline**：若未指定 **CI Pipeline**，组件默认使用项目根目录下的 `.github/workflows/ci.yml`（若存在）或内置的最小化测试脚本。建议自行编写完整的 CI 工作流，包括单元测试、参数校验、打包验证等步骤。  
- **Release Type**：决定了版本号的递增方式，`Patch` 递增最后一位（如 1.0.0 → 1.0.1），`Minor` 递增次位（1.0.0 → 1.1.0），`Major` 递增主位（1.0.0 → 2.0.0），并在 `Release Notes` 中记录主要变更。  
- **Artifact Path**：在 CI 工作流中生成的打包文件路径，可用于后续的发布步骤（如 GitHub Release 上传资产）。  
- **Status**：`Success` 表示全部步骤（提交、测试、打包、发布）均完成；`Failed` 表示在任何一步出现错误，请查看 `Log` 以定位具体错误。  

## 小结 / Summary
Version Control & Release Management 为整个教程与组件提供了完整的 Git 版本控制、自动化测试与发布流程，确保代码、文档与组件在不同团队成员之间保持一致、可追溯并可安全发布。它与 **M15 Testing & Validation** 紧密配合，实现从测试到发布的全链路自动化。

**下一章节**：M17 将介绍 **Documentation Generation**（文档生成），提供自动化生成 PDF、HTML 文档以及在线文档站点的功能，帮助用户快速获得可打印或在线阅读的完整教程与组件手册。