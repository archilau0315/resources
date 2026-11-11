# Component Launcher (Component) 详解 / Component Launcher Documentation

## 功能介绍 / Function Description
本组件用于根据预设参数快速创建、加载并运行已在 **Component Browser** 中浏览的组件。用户可以选择已保存的配置文件或实时输入参数，组件会自动在画布中创建实例并连接至当前数据流，实现“一键启动、参数即用”的工作流。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Component ID** | 文字 | 任何有效的组件唯一 ID（如 `M8`、`M8_1`） | 空 | 目标组件的唯一标识，必须对应 **Component Browser** 中已注册的组件。 |
| **Preset File** | 文字 | 本地文件路径或相对路径 | 空 | 可选的配置文件（JSON），包含组件的全部参数预设；若为空则使用 **Manual Parameters** 手动输入。 |
| **Manual Parameters** | 结构体 | 视组件而定 | 空 | 手动输入的参数键值对，仅在 **Preset File** 为空时生效。 |
| **Launch Mode** | 选择列表 | `Add`, `Replace`, `Append` | `Add` | 控制组件实例在画布中的放置方式：<br>• `Add` – 在当前画布末尾添加新实例<br>• `Replace` – 替换已有同名实例（若存在）<br>• `Append` – 在当前实例后追加新实例（用于序列化操作） |
| **Auto‑Connect** | 布尔 | `True`/`False` | `False` | 勾选后，组件实例会自动连接到画布中最近的输入/输出端口，简化常用工作流。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Component Instance ID** | 文字 | 实际创建的组件实例在画布中的唯一标识，后续可用于删除、重定位或参数修改。 |
| **Status** | 文字 | `Success`, `Not Found`, `Invalid Parameter`, `Loading`, `Error`，表示操作结果状态。 |
| **Launch Log** | 文字 | 详细的执行日志，便于调试和审计。 |

## 示例 / Example
1. **准备配置文件**（可选）：在 `C:\Projects\Presets\Power_10A.json` 中保存如下内容：<br>
```json
{
  "Voltage": 24,
  "CurrentLimit": 10,
  "Mode": "Constant Voltage"
}
```
2. **在画布中添加 Component Launcher**：拖入 **Component Launcher** 组件。  
3. **设置参数**：  
   - **Component ID** = `M8`（对应 Power Component）  
   - **Preset File** = `C:\Projects\Presets\Power_10A.json`  
   - **Launch Mode** = `Add`  
   - **Auto‑Connect** = `True`  
4. **执行**：触发组件，日志显示 `Success`，画布中会出现一个 **Power Component** 实例，电压 24 V、电流限制 10 A，自动连接至最近的输入/输出端口。  
5. **结果**：`Component Instance ID` 输出为唯一 GUID，`Status` 为 `Success`，`Launch Log` 记录完整的加载过程。

## 网页样式示例 / HTML Sample
```html
<div class="launcher-card">
  <h2>Component Launcher (组件启动器)</h2>
  <p><strong>功能介绍:</strong> 根据预设或手动参数快速创建并运行组件实例。</p>
  <p><strong>Function Description:</strong> Instantiates a component from the catalog using a preset file or manual parameters, optionally auto‑connecting to the canvas.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Component ID</strong> – 目标组件的唯一标识（如 M8）。</li>
    <li><strong>Preset File</strong> – 可选的 JSON 配置文件路径。</li>
    <li><strong>Manual Parameters</strong> – 手动输入的键值对。</li>
    <li><strong>Launch Mode</strong> – Add / Replace / Append。</li>
    <li><strong>Auto‑Connect</strong> – 是否自动连接至最近端口。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Component Instance ID</strong> – 实例唯一标识。</li>
    <li><strong>Status</strong> – Success / Not Found / Invalid Parameter / Loading / Error。</li>
    <li><strong>Launch Log</strong> – 详细执行日志。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-json"><br{
  "Component ID": "M8",
  "Preset File": "C:/Presets/Power_10A.json",
  "Launch Mode": "Add",
  "Auto-Connect": true
}</code></pre>

<h3>网页样式代码</h3>
<pre><code class="language-html"><div class="launcher-card">
  <h2>Component Launcher (组件启动器)</h2>
  <p><strong>功能介绍:</strong> 根据预设或手动参数快速创建并运行组件实例。</p>
  <p><strong>Function Description:</strong> Instantiates a component from the catalog using a preset file or manual parameters, optionally auto‑connecting to the canvas.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Component ID</strong> – 目标组件的唯一标识（如 M8）。</li>
    <li><strong>Preset File</strong> – 可选的配置文件路径。</li>
    <li><strong>Manual Parameters</strong> – 手动输入的参数键值对。</li>
    <li><strong>Launch Mode</strong> – Add / Replace / Append。</li>
    <li><strong>Auto‑Connect</strong> – 是否自动连接至最近端口。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Component Instance ID</strong> – 实例唯一标识。</li>
    <li><strong>Status</strong> – Success / Not Found / Invalid Parameter / Loading / Error。</li>
    <li><strong>Launch Log</strong> – 详细执行日志。</li>
  </ul>

  <h3>示例</h3>
  <p>Component ID = M8，Preset File = C:/Presets/Power_10A.json，Launch Mode = Add，Auto‑Connect = true → 实例化 Power Component，电压 24 V、电流限制 10 A，自动连接。</p>
</div></code></pre>
</div>
```

## 使用说明 / Usage Notes
- **Component ID 必须与 Component Browser 中的条目完全匹配**，否则会返回 `Not Found` 状态。  
- **Preset File** 必须是有效的 JSON 文件，键名必须对应组件的输入参数名称（如 `Voltage`, `CurrentLimit` 等）。  
- **Manual Parameters** 与 **Preset File** 只能二选一；若两者同时提供，以 **Preset File** 为准，手动参数会被忽略。  
- **Launch Mode** 决定实例在画布中的放置方式，建议在教程演示中使用 `Add`，以保持每次运行都产生全新实例，便于观察参数变化。  
- **Auto‑Connect** 为 `True` 时，组件会尝试自动连接到画布中最近的输入/输出端口，适合快速演示；若需手动连接，请保持 `False`。  
- **状态异常处理**：若返回 `Not Found`，请检查 **Component ID** 是否拼写正确或在 **Component Browser** 中是否已注册；`Invalid Parameter` 则检查 **Preset File** 或 **Manual Parameters** 的键名与类型是否匹配。

## 小结 / Summary
Component Launcher 通过集成 **Component Browser** 与预设配置，实现了“一键启动、参数即用”的组件实例化流程，极大提升了教程演示与实际项目搭建的效率。它与 **M12 Component Browser** 紧密配合，形成完整的组件发现‑选择‑启动闭环。

**下一章节**：M14 将介绍 **Parameter Preset Manager**，实现对常用配置的保存、加载与版本管理，进一步简化重复性参数设置的工作流。