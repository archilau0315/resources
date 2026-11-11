# Parameter Preset Manager (Component) 详解 / Parameter Preset Manager Documentation

## 功能介绍 / Function Description
本组件提供对组件参数预设（Preset）的保存、加载、版本管理以及批量应用功能。用户可以为常用参数组合创建多个预设文件，在需要时通过文件路径或 ID 直接加载，实现参数配置的重复使用与快速切换。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Preset Name** | 文字 | 1‑50 字符，仅限字母数字与下划线 | 空 | 当前预设的名称，用于识别和管理。 |
| **Preset File** | 文字 | 有效文件路径（绝对或相对） | 空 | 保存或加载的 JSON 文件路径，文件内容为对应组件的参数键值对。 |
| **Component ID** | 文字 | 对应组件的唯一标识（如 `M8`） | 空 | 该预设适用的组件，确保加载后参数匹配正确的组件。 |
| **Version** | 文字 | 1.0‑9.9（语义化版本） | `1.0` | 预设的版本号，便于后期升级或回滚。 |
| **Save Mode** | 选择列表 | `Add`, `Update`, `Overwrite`, `Append` | `Add` | 保存操作的模式：<br>• `Add` – 新增独立预设<br>• `Update` – 更新已有预设（保持 ID 不变）<br>• `Overwrite` – 完全覆盖现有预设<br>• `Append` – 在现有预设末尾追加新键值对（适用于增量调整）。 |
| **Load Mode** | 选择列表 | `Replace`, `Merge`, `Append` | `Replace` | 加载时的行为：<br>• `Replace` – 完全用加载文件覆盖当前参数<br>• `Merge` – 仅更新已存在的键，保留其余不变<br>• `Append` – 在当前参数基础上追加新键值对（适用于增量调整） |
| **Confirm** | 布尔 | `True`/`False` | `False` | 在执行 **Save** 或 **Load** 前弹出确认对话框（适用于 UI 交互）。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Preset ID** | 文字 | 系统生成的唯一预设 ID（GUID），用于后续引用。 |
| **Status** | 文字 | `Success`, `Exists`, `Invalid Path`, `Corrupt`, `Error`，表示操作结果。 |
| **Log** | 文字 | 详细的执行日志，包含文件读取、写入、校验等步骤。 |

## 示例 / Example
1. **创建新预设**：在画布中添加 **Parameter Preset Manager** 组件。<br>
   - **Preset Name** = `Power_10A`<br>
   - **Component ID** = `M8`<br>
   - **Save Mode** = `Add`<br>
   - **Confirm** = `True`（弹出确认）<br>
   - **Manual Parameters**：<br>
     ```json
     {
       "Voltage": 24,
       "CurrentLimit": 10,
       "Mode": "Constant Voltage"
     }
     ```
   - 确认后系统生成 **Preset ID**，状态为 `Success`，日志记录文件路径（如 `C:\Presets\Power_10A.json`）。

2. **加载已有预设**：<br>
   - **Component ID** = `M8`<br>
   - **Preset File** = `C:\Presets\Power_10A.json`<br>
   - **Load Mode** = `Replace`<br>
   - **Confirm** = `True`<br>
   - 执行后 **Status** 为 `Success`，组件参数即时更新为预设值，`Preset ID` 为对应的 GUID。

3. **版本升级**：<br>
   - 修改 **Preset Name** 为 `Power_10A_v2`，**Version** = `2.0`，使用 `Update` 模式保存新参数（如增加 `PowerFactor` 为 `0.95`），随后使用 `Load Mode = Merge` 可在不覆盖原有键的前提下加入新参数。

## 网页样式示例 / HTML Sample
```html
<div class="preset-manager-card">
  <h2>Parameter Preset Manager (组件参数预设管理器)</h2>
  <p><strong>功能介绍:</strong> 保存、加载、版本管理组件参数预设，实现一键调用。</p>
  <p><strong>Function Description:</strong> Manages reusable parameter presets for components, supporting save, load, versioning, and batch operations.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Preset Name</strong> – 1‑50 字符的唯一名称。</li>
    <li><strong>Preset File</strong> – 对应 JSON 文件的完整路径。</li>
    <li><strong>Component ID</strong> – 适用的组件唯一标识。</li>
    <li><strong>Version</strong> – 语义化版本号（默认 1.0）。</li>
    <li><strong>Save Mode</strong> – Add / Update / Overwrite / Append。</li>
    <li><strong>Load Mode</strong> – Replace / Merge / Append。</li>
    <li><strong>Confirm</strong> – 操作前的确认弹窗。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Preset ID</strong> – 唯一 GUID 标识。</li>
    <li><strong>Status</strong> – Success / Exists / Invalid Path / Corrupt / Error。</li>
    <li><strong>Log</strong> – 详细的执行日志。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-json"><br{
  "Preset Name": "Power_10A",
  "Component ID": "M8",
  "Version": "1.0",
  "Save Mode": "Add",
  "Confirm": true
}</code></pre>

<h3>网页样式代码</h3>
<pre><code class="language-html"><div class="preset-manager-card">
  <h2>Parameter Preset Manager (组件参数预设管理器)</h2>
  <p><strong>功能介绍:</strong> 保存、加载、版本管理组件参数预设，实现一键调用。</p>
  <!-- 其余内容省略 -->
</div></code></pre>
</div>
```

## 使用说明 / Usage Notes
- **保存**：在 **Save Mode** 为 `Add` 时，系统会生成唯一的 **Preset ID** 并创建新 JSON 文件；若使用 `Update` 或 `Overwrite`，则会修改已有文件并保持同一 **Preset ID**。  
- **加载**：在 **Load Mode** 为 `Replace` 时，加载的参数会完全覆盖当前组件的所有参数；`Merge` 则仅更新已存在的键，保留其余不变；`Append` 在现有参数基础上追加新键值对，适合增量调优。  
- **版本管理**：通过 **Version** 字段可以在同一 **Preset Name** 下维护多个版本，后期需要回滚时只需加载指定版本的 **Preset File** 即可。  
- **批量操作**：通过批量导入/导出 JSON 文件，可一次性管理多个预设，适合团队协作或大型项目的参数统一管理。  
- **错误处理**：若 **Preset File** 不存在或 JSON 格式错误，状态会返回 `Invalid Path` 或 `Corrupt`，并在 **Log** 中给出具体错误信息，便于快速定位问题。  

## 小结 / Summary
Parameter Preset Manager 为组件参数的复用提供了结构化、版本化的解决方案，使得在不同项目或不同阶段之间切换配置变得轻松可靠。它与 **M13 Component Launcher** 紧密配合，实现“保存‑加载‑启动”全链路的参数管理工作流。

**下一章节**：M15 将介绍 **Testing & Validation**（测试与验证），提供自动化单元测试、参数校验以及性能基准的框架，确保各组件在实际使用中表现可靠。