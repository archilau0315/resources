# M25 Publishing & Community Sharing (Component) 详解 / 发布与社区分享组件详解

## 功能介绍 / Function Description
本组件介绍如何将开发好的 Grasshopper 定义、自定义组件与插件发布到 Grasshopper 社区、Food4Rhino、GitHub 或私有仓库，包括打包、版本管理、文档编写与许可证选择。

This component introduces how to publish developed Grasshopper definitions, custom components and plugins to the Grasshopper community, Food4Rhino, GitHub or private repositories, including packaging, version management, documentation writing and license selection.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Source Files** | 文件列表 | 要发布的 .gh、.gha、.py 文件 | 空 | 需要打包发布的源文件列表。 |
| **Package Name** | 文字 | 1-50 字符 | `MyPlugin` | 发布包的名称。 |
| **Version** | 文字 | 语义化版本号 | `1.0.0` | 发布版本，格式如 1.0.0。 |
| **License** | 选择列表 | `MIT`, `GPL`, `Apache`, `Commercial`, `Custom` | `MIT` | 开源许可证类型。 |
| **Documentation** | 文字 | Markdown 文件路径 | 空 | 用户指南与 API 文档路径。 |
| **Preview Images** | 图片列表 | 预览截图文件路径 | 空 | 用于展示效果的图片文件。 |
| **Publish Target** | 选择列表 | `Food4Rhino`, `GitHub Release`, `Local ZIP`, `Private Server` | `Local ZIP` | 发布目标平台。 |
| **Repository URL** | 文字 | Git 仓库地址 | 空 | 发布到 GitHub 时的仓库地址。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Package File** | 文字 | 生成的发布包完整路径（如 .zip、.gha）。 |
| **Release URL** | 文字 | 发布后的公开访问链接（如 GitHub Release 地址）。 |
| **Checksum** | 文字 | 发布包的 SHA256 校验和，用于完整性验证。 |
| **Status** | 文字 | `Success`, `Failed`, `Invalid Path`, `Auth Required`。 |
| **Log** | 文字 | 发布过程的详细日志。 |

## 示例 / Example
1. **准备文件**：将开发好的 `MyComponent.gha`、`README.md`、预览图 `preview.png` 放在同一文件夹。
2. **设置参数**：
   - **Source Files** = 选择上述所有文件
   - **Package Name** = `MyComponent`
   - **Version** = `1.0.0`
   - **License** = `MIT`
   - **Documentation** = `README.md` 路径
   - **Publish Target** = `Local ZIP`
3. **运行**：组件生成 `MyComponent_1.0.0.zip`，**Status** 为 `Success`，**Checksum** 为文件的 SHA256 值。
4. **发布到 Food4Rhino**：将 ZIP 包上传至 Food4Rhino，填写描述、标签与兼容性信息（Rhino 7/8, Grasshopper 版本），等待审核后公开发布。

## 使用说明 / Usage Notes
- **版本号**：遵循语义化版本（Major.Minor.Patch），破坏性变更升主版本，新功能升次版本，修复bug升修订版本。
- **许可证**：MIT 适合开源共享，Commercial 适合商业插件，Custom 可自定义条款。
- **文档**：务必包含安装说明、使用示例与系统要求，降低用户上手成本。
- **兼容性**：明确标注支持的 Rhino 与 Grasshopper 版本，避免用户安装后无法加载。
- **校验和**：发布后提供 SHA256 校验和，让用户验证下载文件的完整性。

## 小结 / Summary
发布与社区分享组件提供了从开发完成到公开发布的完整流程，帮助用户将自己的 Grasshopper 定义与插件分享到全球社区，获取反馈与建立影响力。

---

**下一章节**：本教程系列已完结，您可以返回课程地图复习任意模块，或开始自己的参数化设计实践。

**Next Chapter**: The tutorial series is complete. You can return to the Course Map to review any module, or start your own parametric design practice.
