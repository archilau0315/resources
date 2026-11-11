# M22 C# Plugin Development Template (Component) 详解 / C# 插件开发模板组件详解

## 功能介绍 / Function Description
本组件提供使用 C# 与 Visual Studio 开发自定义 Grasshopper 插件的完整模板，包括项目结构、GH_Component 继承、输入输出参数定义、SolveInstance 实现、GUID 注册与打包发布。

This component provides a complete C# and Visual Studio template for developing custom Grasshopper plugins, including project structure, GH_Component inheritance, input/output parameter definition, SolveInstance implementation, GUID registration and packaging deployment.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Project Name** | 文字 | 1-50 字符 | `MyGHComponent` | Visual Studio 项目名称。 |
| **Component Name** | 文字 | 1-50 字符 | `My Component` | Grasshopper 组件显示名称。 |
| **Component Nickname** | 文字 | 1-10 字符 | `MyComp` | 组件在画布上的简称。 |
| **Component Category** | 选择列表 | `Params`, `Geometry`, `Util`, `Display`, `Custom` | `Params` | 组件在组件面板中的顶级类别。 |
| **Sub Category** | 选择列表 | `Primitive`, `Analysis`, `Format`, `Custom` | `Custom` | 组件子类别。 |
| **Input Count** | 数值 | 0 - 10 | 2 | 组件输入端口数量。 |
| **Output Count** | 数值 | 0 - 10 | 1 | 组件输出端口数量。 |
| **GUID** | 文字 | 有效 GUID 格式 | 自动生成 | 组件唯一标识符，必须全局唯一。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Project Path** | 文字 | 生成的项目文件夹完整路径。 |
| **Template Files** | 文件列表 | 项目中包含的所有源文件列表（.cs, .csproj, .gha 等）。 |
| **Build Command** | 文字 | 用于命令行编译的 MSBuild 命令。 |
| **Install Path** | 文字 | 插件安装目录建议路径（%APPDATA%\Grasshopper\Plugins）。 |
| **Status** | 文字 | `Success`, `Invalid Input`, `Error`。 |

## 示例 / Example
1. **创建项目**：运行 **C# Plugin Development Template** 组件，设置：
   - **Project Name** = `MyFirstPlugin`
   - **Component Name** = `Hello GH`
   - **Component Category** = `Params`
   - **Input Count** = `1`
   - **Output Count** = `1`
2. **生成代码**：组件输出 **Project Path** 为 `C:\Projects\MyFirstPlugin`，并生成以下关键文件：
   - `MyFirstPlugin.csproj`：项目配置文件
   - `HelloGHComponent.cs`：主组件代码，继承 GH_Component
   - `PluginInfo.cs`：插件元数据与 GUID
3. **编写逻辑**：在 `SolveInstance` 方法中实现计算：
   ```csharp
   protected override void SolveInstance(IGH_DataAccess DA)
   {
       string input = null;
       if (!DA.GetData(0, ref input)) return;
       string result = "Hello: " + input;
       DA.SetData(0, result);
   }
   ```
4. **编译安装**：使用 `dotnet build` 或 Visual Studio 编译生成 `.gha` 文件，复制到 Grasshopper 插件文件夹，重启 Rhino 即可在组件面板中找到 `Hello GH`。

## 使用说明 / Usage Notes
- **开发环境**：需安装 Visual Studio 2022 与 .NET 6/7 SDK，以及 RhinoCommon 和 Grasshopper SDK 引用。
- **GUID 唯一性**：每个组件必须有唯一 GUID，重复会导致加载冲突。
- **参数访问模式**：输入参数支持 `GH_ParamAccess.item`（单项）、`list`（列表）、`tree`（数据树）。
- **调试**：可在 Visual Studio 中将 Rhino.exe 设置为启动项目进行调试。

## 小结 / Summary
C# 插件开发模板组件提供了从零开始创建自定义 Grasshopper 插件的标准化流程，涵盖项目创建、代码模板、参数定义、编译与安装，适合需要封装复杂算法或发布商业插件的开发者。

---

**下一章节**：M23 GhPython 脚本库模块，介绍如何使用 GhPython 编写轻量级 Grasshopper 脚本组件。

**Next Chapter**: M23 GhPython Script Library, introducing how to write lightweight Grasshopper script components using GhPython.
