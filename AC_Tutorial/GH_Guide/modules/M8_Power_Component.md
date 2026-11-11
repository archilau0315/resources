# Power Component (Component) 详解 / Power Component Documentation

## 功能介绍 / Function Description
本组件用于模拟电源输出，可设定电压、电流限制以及工作模式（恒压、恒流或关闭），模拟实际电源的输出行为。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Voltage (V)** | 数值 | 1.0‑48.0 V | 12.0 V | 输出电压的目标值。 |
| **Current Limit (A)** | 数值 | 0.1‑20.0 A | 5.0 A | 最大输出电流限制，超过此值时电流被限制。 |
| **Mode** | 选项 | `Constant Voltage`、`Constant Current`、`Off` | `Constant Voltage` | 工作模式：<br>• `Constant Voltage` – 保持电压恒定，电流随负载变化。<br>• `Constant Current` – 保持电流恒定，电压随负载变化。<br>• `Off` – 关闭输出。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Voltage Output (V)** | 数值 | 实际输出电压，受电流限制影响。 |
| **Current Output (A)** | 数值 | 实际输出电流，受电压和模式限制。 |
| **Status** | 文字 | `On` 表示正在供电，`Off` 表示关闭。 |

## 示例 / Example
1. **创建组件**：在画布中拖入 **Power Component**（或 Power Supply）组件。  
2. **设置参数**：双击组件，输入 **Voltage = 24 V**，**Current Limit = 10 A**，选择 **Mode = Constant Voltage**。  
3. **连线**：将 **Voltage Output** 连接到 **Panel** 或 **Custom Preview**，观察电压保持不变。  
4. **切换模式**：将 **Mode** 改为 **Constant Current**，电压会随负载变化，电流保持 10 A 不变。  

## 网页样式示例 / HTML Sample
```html
<div class="component-card">
  <h2>Power Component (Component) 详解</h2>
  <p><strong>功能介绍:</strong> 模拟电源输出，可设定电压、电流限制及工作模式。</p>
  <p><strong>Function Description:</strong> Simulates a power supply that provides voltage and current, with selectable operation modes.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Voltage (V)</strong> – 1.0‑48.0 V, default 12.0 V.</li>
    <li><strong>Current Limit (A)</strong> – 0.1‑20.0 A, default 5.0 A.</li>
    <li><strong>Mode</strong> – Constant Voltage / Constant Current / Off (default Constant Voltage).</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Voltage Output (V)</strong> – Actual voltage after current limiting.</li>
    <li><strong>Current Output (A)</strong> – Actual current, limited by the set current limit.</li>
    <li><strong>Status</strong> – “On” when supplying power, “Off” when off.</li>
  </ul>

  <h3>示例</h3>
  <p>电压 24 V，电流限制 10 A，模式 Constant Voltage → 输出电压保持 24 V，电流随负载变化。</p>

  <h3>网页样式代码</h3>
  <pre><code class="language-html"><div class="component-card">
  <h2>Power Component (Component) 详解</h2>
  <p><strong>功能介绍:</strong> 模拟电源输出，可设定电压、电流限制及工作模式。</p>
  <p><strong>Function Description:</strong> Simulates a power supply that provides voltage and current, with selectable operation modes.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Voltage (V)</strong> – 1.0‑48.0 V, default 12.0 V.</li>
    <li><strong>Current Limit (A)</strong> – 0.1‑20.0 A, default 5.0 A.</li>
    <li><strong>Mode</strong> – Constant Voltage / Constant Current / Off (default Constant Voltage).</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Voltage Output (V)</strong> – Actual voltage after current limiting.</li>
    <li><strong>Current Output (A)</strong> – Actual output current, limited by the set current limit.</li>
    <li><strong>Status</strong> – “On” when supplying power, “Off” when off.</li>
  </ul>

  <h3>示例</h3>
  <p>电压 24 V，电流限制 10 A，模式 Constant Voltage → 输出电压保持 24 V，电流随负载变化。</p>
</div></code></pre>
</div>
```

## 使用说明 / Usage Notes
- **恒压模式**：电压保持恒定，电流随负载变化，适用于需要恒定电压的场景。  
- **恒流模式**：电流保持恒定，电压随负载变化，适用于需要恒定电流的场景。  
- **关闭模式**：组件不输出电压或电流，适用于暂停或关闭供电的情况。  

## 小结 / Summary
本组件提供了完整的电源模拟能力，帮助在 Grasshopper 中快速实现电压/电流受控的参数化设计。通过合理设置 **Voltage**、**Current Limit** 与 **Mode**，可以模拟各类电源行为，为后续的电气、能源仿真提供便利。

**下一步**：将此组件与 **M9 导出/渲染** 模块结合，实现模型的可视化输出。  

**下一章节**：M9 导出与渲染模块（Export & Render）。