# Testing & Validation (Component) 详解 / Testing & Validation Documentation

## 功能介绍 / Function Description
本组件提供对组件的自动化测试、参数校验以及性能基准评估功能。用户可以编写测试用例、运行批量检查、获取通过率与性能指标，确保组件在不同环境下的可靠性与效率。

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Test Suite** | 文字 | 任意文件路径或文件夹 | 空 | 待执行的测试脚本集合（支持 *.js、*.py、*.bat 等脚本）。 |
| **Component ID** | 文字 | 对应组件的唯一标识（如 `M8`） | 空 | 被测试的组件标识，确保测试脚本针对正确的组件。 |
| **Parameter Set** | 结构体 | 与组件对应的参数键值对 | 空 | 可选的参数集合，用于在测试过程中对组件进行特定参数设置。 |
| **Run Mode** | 选择列表 | `Unit`, `Integration`, `Performance` | `Unit` | 测试范围：<br>• `Unit` – 针对单个组件的功能级测试；<br>• `Integration` – 多组件交互测试；<br>• `Performance` – 性能基准与资源占用测试。 |
| **Timeout (s)** | 数值 | 1‑3600 | 60 | 超时时间，超过该时间测试实例会自动标记为 `Timeout` 并记录在日志。 |
| **Output Report** | 文字 | 输出文件路径（可为相对路径） | 空 | 测试结果的汇总报告文件路径，默认在当前工作目录生成 `test_report_<timestamp>.json`。 |
| **Verbose** | 布尔 | `True`/`False` | `False` | 开启详细日志输出，便于调试。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Test Result** | 结构体 | 包含每个测试用例的通过/失败状态、耗时、错误信息。 |
| **Pass Rate** | 数值 (0‑1) | 通过的测试用例占比，用于快速评估整体质量。 |
| **Performance Metrics** | 结构体 | 包含 CPU 使用率、内存占用、I/O 读写速度等性能指标。 |
| **Log** | 文字 | 详细的测试执行日志，包括每一步的开始、结束、异常信息。 |
| **Status** | 文字 | `Success`, `Failed`, `Timeout`, `Skipped`, `Not Tested`，表示整体测试状态。 |

## 示例 / Example
1. **准备测试脚本**：在 `C:\Tests\Component_M8_Test.js` 中编写一个简单的单元测试，验证 `M8` 组件在 `Voltage = 12`、`CurrentLimit = 5` 时返回预期值。<br>
   ```javascript<br>
   // Component_M8_Test.js<br>
   const { execSync } = require('child_process');<br>
   const result = execSync('hermes-test --suite C:\\Tests\\Component_M8_Test.js --component M8 --mode Unit --timeout 30');<br>
   console.log(result.toString());<br>
   ```
2. **运行测试**：在画面中拖入 **Testing & Validation** 组件，设置参数：<br>
   - **Test Suite** = `C:\\Tests\\Component_M8_Test.js`<br>
   - **Component ID** = `M8`<br>
   - **Run Mode** = `Unit`<br>
   - **Timeout** = `30`<br>
   - **Verbose** = `True`<br>
   - **Output Report** = `C:\\Tests\\report_M8_20260920.json`<br>
3. **执行**：触发组件，控制台输出日志，最终生成测试报告文件，`Test Result` 结构体显示所有用例均 `Pass`，`Pass Rate` 为 `1.0`，`Performance Metrics` 显示 CPU 使用率 12%，内存 45 MB，I/O 读取 12 MB/s。  
4. **结果解读**：`Status` 为 `Success`，`Pass Rate` 为 `1.0`，说明该组件在单元测试中表现完美。

## 网页样式示例 / HTML Sample
```html
<div class="test-card">
  <h2>Testing & Validation (测试与验证)</h2>
  <p><strong>功能介绍:</strong> 对组件进行自动化测试、参数校验与性能基准评估。</p>
  <p><strong>Function Description:</strong> Executes predefined test scripts, validates component parameters, and measures performance metrics to ensure reliability and efficiency.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Test Suite</strong> – 待执行的测试脚本路径或文件夹。</li>
    <li><strong>Component ID</strong> – 被测试组件的唯一标识。</li>
    <li><strong>Parameter Set</strong> – 可选的参数集合，用于在测试中固定参数。</li>
    <li><strong>Run Mode</strong> – Unit / Integration / Performance。</li>
    <li><strong>Timeout (s)</strong> – 最大学习超时时间，默认 60 秒。</li>
    <li><strong>Output Report</strong> – 测试结果汇总文件路径。</li>
    <li><strong>Verbose</strong> – 开启详细日志输出。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Test Result</strong> – 每个测试用例的通过/失败状态及耗时。</li>
    <li><strong>Pass Rate</strong> – 通过用例占比，0‑1 数值。</li>
    <li><strong>Performance Metrics</strong> – CPU、内存、I/O 等性能指标。</li>
    <li><strong>Log</strong> – 详细的测试日志。</li>
    <li><strong>Status</strong> – Success / Failed / Timeout / Skipped / Not Tested。</li>
  </ul>

  <h3>示例</h3>
  <pre><code class="language-javascript"><br>
// Test script: C:\Tests\Component_M8_Test.js<br>
const { execSync } = require('child_process');<br>
const result = execSync('hermes-test --suite C:\\Tests\\Component_M8_Test.js --component M8 --mode Unit --timeout 30');<br>
console.log(result.toString());<br>
</code></pre>

<h3>网页样式代码</h3>
<pre><code class="language-html"><div class="test-card">
  <h2>Testing & Validation (测试与验证)</h2>
  <p><strong>功能介绍:</strong> 对组件进行自动化测试、参数校验与性能基准评估。</p>
  <p><strong>Function Description:</strong> Executes predefined test scripts, validates component parameters, and measures performance metrics to ensure reliability and efficiency.</p>

  <h3>输入参数</h3>
  <ul>
    <li><strong>Test Suite</strong> – 待执行的测试脚本路径或文件夹。</li>
    <li><strong>Component ID</strong> – 被测试组件的唯一标识。</li>
    <li><strong>Parameter Set</strong> – 可选的参数集合，用于在测试中固定参数。</li>
    <li><strong>Run Mode</strong> – Unit / Integration / Performance。</li>
    <li><strong>Timeout (s)</strong> – 最大学习超时时间，默认 60 秒。</li>
    <li><strong>Output Report</strong> – 测试结果汇总文件路径。</li>
    <li><strong>Verbose</strong> – 开启详细日志输出。</li>
  </ul>

  <h3>输出参数</h3>
  <ul>
    <li><strong>Test Result</strong> – 每个测试用例的通过/失败状态及耗时。</li>
    <li><strong>Pass Rate</strong> – 通过用例占比，0‑1 数值。</li>
    <li><strong>Performance Metrics</strong> – CPU、内存、I/O 等性能指标。</li>
    <li><strong>Log</strong> – 详细的测试日志。</li>
    <li><strong>Status</strong> – Success / Failed / Timeout / Skipped / Not Tested。</li>
  </ul>
</div>
```

## 使用说明 / Usage Notes
- **测试脚本**：必须能够在独立环境中运行，并返回适当的退出码（0 表示成功，非 0 表示失败）。建议在脚本中捕获异常并输出结构化日志。  
- **Component ID 必须与 Component Browser 中的条目完全匹配**，否则测试脚本会找不到对应组件而报错。  
- **Parameter Set** 可用于在不同参数组合下重复运行同一测试脚本，以验证参数鲁棒性。  
- **Run Mode**：<br>• `Unit` – 适合快速验证单个组件的核心功能。<br>• `Integration` – 适合测试多组件交互、数据流以及端到端工作流。<br>• `Performance` – 适合测量 CPU、内存、I/O 等资源占用，适用于性能瓶颈定位。  
- **超时处理**：若测试用例在 **Timeout** 时间内未完成，系统会自动标记为 `Timeout` 并记录在 `Log` 中，`Status` 为 `Timeout`。  
- **报告解读**：`Test Result` 结构体提供了每个用例的详细状态，`Pass Rate` 为整体通过率，`Performance Metrics` 可用于评估组件在不同硬件环境下的表现。  
- **报告解读**：`Status` 为 `Success` 时，`Test Result` 中的每个用例均为 `Pass`；`Failed` 或 `Timeout` 时需检查对应的 `Test Result` 与 `Log` 以定位问题。

## 小结 / Summary
Testing & Validation 组件为组件的可靠性与性能提供了系统化的检验手段，通过自动化测试、参数校验和性能基准，帮助开发者在开发与部署阶段快速发现缺陷、优化性能，确保组件在实际项目中可靠运行。

**下一章节**：M16 将介绍 **Packaging & Distribution**（打包与分发），提供将完整的教程与组件打包为可安装包或发布到私有仓库的流程，便于团队共享与版本管理。