# M20 Monitoring & Observability (Component) 详解 / 监控与可观测性组件详解

## 功能介绍 / Function Description
本组件提供 Grasshopper 定义的运行时监控与可观测性能力，包括数据流追踪、执行耗时统计、内存占用监控、异常告警与仪表盘展示，帮助用户定位性能瓶颈与运行异常。

This component provides runtime monitoring and observability for Grasshopper definitions, including data flow tracing, execution time statistics, memory usage monitoring, exception alerting and dashboard display, helping users locate performance bottlenecks and runtime anomalies.

## 输入参数 / Input Parameters
| 参数 | 类型 | 范围 | 默认值 | 说明 |
|------|------|------|--------|------|
| **Target Definition** | 文字 | 有效的 .gh 文件路径 | 当前打开的定义 | 需要监控的 Grasshopper 定义文件路径。 |
| **Metric Types** | 选择列表 | `Performance`, `Memory`, `DataFlow`, `Errors`, `All` | `All` | 需要采集的指标类型，可多选。 |
| **Sample Interval (ms)** | 数值 | 100 - 60000 | 1000 | 指标采样间隔，毫秒。 |
| **Enable Alerts** | 布尔 | `True`/`False` | `True` | 是否启用异常告警。 |
| **Alert Threshold** | 数值 | 1 - 100 | 80 | 告警阈值（百分比），如 CPU 或内存占用超过此值触发告警。 |
| **Dashboard Port** | 数值 | 1000 - 65535 | 8080 | 本地仪表盘 Web 服务端口。 |

## 输出参数 / Output Parameters
| 参数 | 类型 | 说明 |
|------|------|------|
| **Dashboard URL** | 文字 | 本地监控仪表盘的访问地址，如 `http://localhost:8080`。 |
| **Metrics Report** | 结构体 | 包含各指标的当前值、历史趋势与统计摘要。 |
| **Alert List** | 文字列表 | 当前触发的告警列表，包含时间、类型与严重程度。 |
| **Pass Rate** | 数值 (0-1) | 健康检查通过率，1.0 表示全部正常。 |
| **Log** | 文字 | 详细的监控执行日志。 |

## 示例 / Example
1. **添加组件**：在画布中拖入 **Monitoring & Observability** 组件。
2. **设置参数**：
   - **Target Definition** = 当前 `.gh` 文件路径
   - **Metric Types** = `Performance`, `Memory`
   - **Sample Interval (ms)** = `500`
   - **Enable Alerts** = `True`
   - **Alert Threshold** = `80`
3. **运行**：触发组件后，打开输出的 **Dashboard URL**，即可在浏览器中查看实时仪表盘。
4. **查看结果**：仪表盘显示 CPU 占用、内存占用、各组件执行耗时、数据流量等指标；若任何指标超过阈值，会在 **Alert List** 中显示红色告警。

## 使用说明 / Usage Notes
- **指标类型**：`Performance` 关注组件执行时间，`Memory` 关注内存分配与释放，`DataFlow` 关注数据树传输量，`Errors` 关注运行异常。
- **采样间隔**：过短会增加监控本身的开销，建议生产环境下设置为 1000ms 以上。
- **仪表盘**：默认使用本地 Web 服务，无需联网，仅在当前计算机可访问。
- **告警**：触发告警后，建议结合 **M15 Testing & Validation** 进行针对性优化。

## 小结 / Summary
监控与可观测性组件为 Grasshopper 定义提供了运行时透明度，帮助用户从“黑盒执行”转向“可测量、可诊断”的开发模式，适合大型参数化模型与生产环境部署。

---

**下一章节**：M21 Kangaroo 物理模拟模块，介绍如何在 Grasshopper 中进行弹簧、重力、碰撞等物理模拟。

**Next Chapter**: M21 Kangaroo Physics Simulation, introducing spring, gravity, collision and other physics simulations in Grasshopper.
