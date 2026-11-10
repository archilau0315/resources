# 电池组件 (Battery Component) 详解

## 功能介绍
本组件用于模拟电池供电，可设定电压、电流限制以及充放电模式，模拟实际电池的输出行为。

## 输入参数
- **电压 (V)** (输入): 电池额定电压，数值范围 1.0‑48.0 V，默认 12.0 V。
- **电流限制 (A)** (输入): 最大输出电流，范围 0.1‑20.0 A，默认 5.0 A。
- **模式 (Mode)** (输入): 可选 `Charge`、`Discharge`、`Idle`，默认 `Idle`。

## 输出参数
- **电压输出 (V)** (输出): 实际输出电压，受电流限制影响，范围与输入电压相同。
- **电流输出 (A)** (输出): 实际输出电流，根据负载自动调节，最大不超过电流限制。
- **状态 (Status)** (输出): `On` 表示正在供电，`Off` 表示关闭。

## 示例
1. 拖入 **Battery** 组件到画布。  
2. 双击打开参数面板，设置电压 12 V，电流限制 5 A，模式 `Discharge`。  
3. 将组件的 **Output Voltage** 与 **Output Current** 连接到 **Panel** 或 **Custom Preview**，观察电压随负载变化。

## 网页样式示例
下面是一段 HTML 示例，展示本组件的使用说明（中英双语）：

```html
<div class="battery-card">
  <h2>电池组件 (Battery Component)</h2>
  <p><strong>功能介绍:</strong> 模拟电池供电，可设定电压、电流和模式。</p>
  <p><strong>Function Description:</strong> Simulates battery power supply, allowing voltage, current, and mode settings.</p>
  <!-- 其他内容省略 -->
</div>
```

> **注意**: 在实际 Grasshopper 中，组件名称为 **Battery**，输入端口为 **Voltage**，输出端口为 **Voltage Out**, **Current Out**, **Status**。
```