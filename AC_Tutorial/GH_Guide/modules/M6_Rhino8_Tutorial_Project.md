# Rhino 8 完整教程与示例项目 / Complete Tutorial and Example Project

## 1. 项目概述 / Project Overview
- **目标**：让用户能够从零开始，使用 Grasshopper 完成一个可参数化的住宅模型（基础框架 + 可调节屋顶与窗户）。  
- **适用人群**：初学者到中级建筑师，希望系统学习参数化建模与调参技巧。  
- **输出**：完成后可保存为 `.gh` 文件，导出 PNG 渲染图，或直接在 Rhino 中可视化。  

## 2. 环境准备 / Prerequisites
1. 安装 **Rhino 8**（参考 M1 模块的安装步骤）。  
2. 确认 **Grasshopper** 插件已启用（M1 中已说明）。  
3. 下载本教程的示例文件夹（后续会在项目根目录 `Example_Project` 中提供）。  

## 3. 项目结构 / Project Structure
```
Example_Project/
│
├─ 00_ReadMe.md                 # 本教程说明（本文件）
├─ 01_Setup/
│   └─ Install_Guide.pdf        # Rhino 8 安装与 Grasshopper 启动指南
├─ 02_Components/
│   ├─ Search_Guide.md          # 组件搜索与自动补全使用说明（M3）
│   └─ Parameter_Guide.md       # 参数详解（M4）
├─ 03_Tutorial/
│   ├─ 01_Basic_Operations.md   # 画布布局与基本操作（M2）
│   ├─ 02_Component_Search.md   # 组件搜索与自动补全（M3）
│   ├─ 03_Parameter_Details.md  # 参数详解与示例（M4）
│   ├─ 04_UI_Design.md          # UI/UX 设计规范（M5）
│   └─ 04_House_Build.md        # 本项目完整建模步骤（本文件）
├─ 04_Resources/
│   ├─ Screenshot_House.png     # 关键步骤截图（占位，后期替换）
│   └─ Sample_House.gh          # 完整示例文件（供参考）
└─ 05_Debug_Logs/
    ├─ debug_log_1.md
    ├─ debug_log_2.md
    ├─ debug_log_3.md
    ├─ debug_log_3.md
    └─ debug_log_5.md
```

## 4. 步骤概览 / Step‑by‑Step Overview
| 步骤 | 内容 | 关键组件 | 参数要点 |
|------|------|----------|----------|
| **4.1** | **创建画布并开启预览** | `Canvas`、`Preview` | 设置分辨率为 **OpenGL**，关闭不需要的预览以提升性能。 |
| **4.2** | **绘制地基平面** | `Rectangle`、`Construct Point`、`Move` | X/Y 端点分别设为 **0,0** 与 **1000,0** mm，宽度 **1000 mm**，高度 **500 mm**。 |
| **4.2** | **生成四根墙体** | `Extrude`（Geometry → Edit → Extrude） | 选取地基多边形，Extrude 高度 **3000 mm**，方向法向 **Z**。 |
| **4.3** | **创建屋顶框架** | `Polygon`、`Rotate`、`Scale` | 以地基中心为原点，生成 4 条边的多边形，使用 **Rotate** 使其倾斜 30°，`Scale` 控制屋顶坡度。 |
| **4.4** | **添加窗户** | `Window`（自定义组件）或 `Rectangle` + `Extrude` | 窗户尺寸 **800 × 1200 mm**，位置通过 **Shift** 参数控制，可在画面左侧或右侧。 |
| **4.5** | **参数化调节** | `Number Slider`、`Panel` | - **屋顶坡度**：`Slider` 5°‑45°，步长 1°。<br>- **窗户数量**：`Panel` 1‑4，步长 1。 |
| **4.6** | **预览与调试** | `Preview`, `Data Tree` | 随时打开/关闭预览，检查数据树是否为单根结构，确保参数变化同步更新。 |
| **4.7** | **导出与渲染** | `Export`、`Render` | 保存为 `House_Parametric.gh`，使用 Rhino 内置渲染器或 **V-Ray** 导出高分辨率 PNG。 |

## 5. 详细步骤（每一步配图与说明）  

### 5.1 创建画布并开启预览
1. 打开 Rhino 8，选择 **Tools > Grasshopper**。  
2. 在画布右上角点击 **Preview** 开关，确保组件预览可见。  
3. 如需更大的工作空间，可在 **View > Properties** 中调整 **Display** 为 **OpenGL**。  

> **[Screenshot: 打开 Grasshopper 界面]**  

### 5.2 绘制地基平面
1. 拖入 **`Rectangle`** 组件（Geometry → Base → Rectangle）。  
2. 双击组件，在 **`X Pt`** 输入 **`0`**，**`Y Pt`** 输入 **`0`**，**`Xr`** 输入 **`1000`**，**`Yr`** 输入 **`500`**（单位 mm）。  
3. 将 **`Rectangle`** 的 **`Geometry`** 输出连接至 **`Construct Point`**（若需要点化），再使用 **`Move`** 将平面平移至所需位置。  

> **[Screenshot: Rectangle 参数设置]**  

### 5.3 生成四根墙体
1. 选取地基平面的四条边（使用 **`Explode`** 或 **`Boundary`** 组件），得到四条线。  
2. 拖入 **`Extrude`** 组件（Geometry → Edit → Extrude），把每条线的 **`Geometry`** 输入到 **`Extrude`**，**`Direction`** 设为 **`Z`**，**`Distance`** 设为 **`3000`** mm。  
3. 重复四次，得到四根垂直于地基的墙体。  

> **[Screenshot: Extrude 参数面板]**  

### 5.3 创建屋顶框架
1. 在画布中心放置 **`Polygon`** 组件（Geometry → Base → Polygon），设 **`Count`** 为 **`4`**，**`Radius`** 为 **`500`** mm。  
2. 使用 **`Rotate`** 组件，输入 **`30`**°，将多边形倾斜形成坡度。  
3. 用 **`Scale`** 组件调节 **`Scale`** 参数，控制屋顶的长宽比例。  

> **[Screenshot: Polygon + Rotate 参数]**  

### 5.4 添加窗户
1. 创建一个自定义窗户组件（或直接使用 **`Rectangle`** + **`Extrude`**），设 **`Width`** 为 **`800`** mm，**`Height`** 为 **`1200`** mm。  
2. 在墙体上放置窗口，使用 **`Shift`** 参数控制水平位置，`Y` 参数控制垂直位置。  
3. 若需要多个窗户，使用 **`Series`** 组件生成列表，再用 **`Merge`** 将其合并到墙体。  

> **[Screenshot: Window 参数面板]**  

### 5.5 参数化调节
- **屋顶坡度**：在 **`Scale`** 组件的 **`X`** 端口放置 **`Number Slider`**，范围 **5°‑45°**，步长 **1°**。  
- **窗户数量**：在 **`Panel`** 组件中输入 **`2`**，连接到窗户组件的 **`Count`** 输入，实现可调节窗户数量。  

> **[Screenshot: Slider 与 Panel 的交互]**  

### 5.6 预览与调试
- 当参数变化时，画面会实时更新。若出现异常（如墙体交叉），检查 **`Data Tree`** 图标，确保所有组件共享同一根数据树。  
- 右键组件 → **`Preview Off`** 可临时关闭渲染，加速编辑速度。  

> **[Screenshot: 数据树检查]**  

### 5.7 导出与渲染
1. 完成模型后，点击 **`File > Save As`**，保存为 **`House_Parametric.gh`**。  
2. 在 Rhino 中，选择 **`Render`** → **`OpenGL`**，调节 **`Quality`** 为 **`High`**，设定 **`Resolution`** 为 **`1920×1080`**。  
3. 导出 PNG：`File > Export > Image`，勾选 **`Transparent Background`** 如需透明。  

> **[Screenshot: Export 对话框]**  

## 6. 常见错误与调试技巧 / Common Errors & Debug Tips
- **错误 1**：组件未连线 → 检查所有输出端是否已连至对应输入端。  
- **错误 2**：参数类型不匹配 → 确认数值端口只接受数值，布尔端口只接受 true/false。  
- **错误 3**：数据树结构混乱 → 右键组件查看 **`Tree`** 图标，确保所有数据来自同一源。  

> **调试小技巧**：使用 **`Pause`** 组件暂停画面更新，逐步观察每一步的变化，便于定位问题。  

## 7. 小结 / Summary
- 本教程通过 **一步步的实战案例**，系统展示了 Rhino 8 与 Grasshopper 的完整工作流程：从画布布局、组件搜索、参数调节到最终渲染。  
- 通过 **M1‑M5** 系列模块的学习，您已掌握了搜索、参数、UI 设计等核心技能，现在只需把它们组合应用于实际项目即可。  
- 完成本项目后，您可以自行创建其他参数化模型（如桥梁、体块、景观），并在此基础上开发插件或发布至 **Grasshopper Community**。  

**祝您教学顺利、设计愉快！**  

---  
*本教程所有截图请自行替换为真实截图，确保文档与实际操作完全同步。*