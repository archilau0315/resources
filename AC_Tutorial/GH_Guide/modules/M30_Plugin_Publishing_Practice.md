# M30 Plugin Publishing Practice (Component) 详解 / 插件发布实战组件详解

## 功能介绍 / Function Description
本组件介绍将开发好的 Grasshopper 插件完整打包并发布到 Food4Rhino、GitHub Release 或私有仓库的全流程，包括版本号管理、许可证选择、文档编写、安装测试与发布记录。

This component introduces the full process of packaging developed Grasshopper plugins and publishing to Food4Rhino, GitHub Release or private repositories, including version management, license selection, documentation writing, installation testing and release records.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Plugin File** | 文件 | .gha 文件路径 | 空 | 已编译的 Grasshopper 插件文件。 |
| **Source Files** | 文件列表 | 源代码、文档、图片 | 空 | 需要包含在发布包中的所有文件。 |
| **Package Name** | 文字 | 1-50 字符 | `MyPlugin` | 发布包名称。 |
| **Version** | 文字 | 语义化版本号 | `1.0.0` | 发布版本，格式如 1.0.0。 |
| **License** | 选择列表 | `MIT`, `GPL`, `Apache`, `Commercial`, `Custom` | `MIT` | 开源许可证类型。 |
| **Publish Target** | 选择列表 | `Food4Rhino`, `GitHub Release`, `Local ZIP`, `Private Server` | `Local ZIP` | 发布目标平台。 |
| **Repository URL** | 文字 | Git 仓库地址 | 空 | 发布到 GitHub 时的仓库地址。 |
| **Release Notes** | 文字 | 发布说明 | 空 | 本次发布的主要变更与新增内容。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Package File** | 文字 | 生成的发布包完整路径（如 .zip、.gha）。 |
| **Checksum** | 文字 | 发布包的 SHA256 校验和。 |
| **Release URL** | 文字 | 发布后的公开访问链接（如 GitHub Release 地址）。 |
| **Install Path** | 文字 | 建议的安装路径（%APPDATA%\Grasshopper\Plugins）。 |
| **Status** | 文字 | `Success`, `Failed`, `Invalid Path`, `Auth Required`。 |
| **Log** | 文字 | 发布过程的详细日志。 |

## 示例 / Example
1. **准备文件**：将 `MyPlugin.gha`、`README.md`、`LICENSE`、`preview.png` 放在同一文件夹。
2. **设置参数**：
   - **Plugin File** = `MyPlugin.gha`
   - **Package Name** = `MyPlugin`
   - **Version** = `1.0.0`
   - **License** = `MIT`
   - **Publish Target** = `Local ZIP`
3. **运行**：组件生成 `MyPlugin_1.0.0.zip`，**Status** 为 `Success`，**Checksum** 为 SHA256 值。
4. **发布到 Food4Rhino**：登录 Food4Rhino，上传 ZIP 包，填写描述、标签、兼容性（Rhino 7/8, Grasshopper 版本），提交审核。
5. **发布到 GitHub**：将 ZIP 包上传到 GitHub Release，关联版本标签 `v1.0.0`，填写 Release Notes。

## 使用说明 / Usage Notes
- **版本号**：遵循语义化版本（Major.Minor.Patch），破坏性变更升主版本，新功能升次版本，修复bug升修订版本。
- **许可证**：MIT 适合开源共享，Commercial 适合商业插件，Custom 可自定义条款。
- **文档**：务必包含安装说明、使用示例与系统要求，降低用户上手成本。
- **兼容性**：明确标注支持的 Rhino 与 Grasshopper 版本，避免用户安装后无法加载。
- **校验和**：发布后提供 SHA256 校验和，让用户验证下载文件的完整性。

## 小结 / Summary
插件发布实战组件提供了从开发完成到公开发布的完整流程，帮助用户将自己的 Grasshopper 插件分享到全球社区，获取反馈与建立影响力。

---

**下一章节**：本教程系列已完结，您可以返回课程地图复习任意模块，或开始自己的参数化设计实践。

**Next Chapter**: The tutorial series is complete. You can return to the Course Map to review any module, or start your own parametric design practice.
