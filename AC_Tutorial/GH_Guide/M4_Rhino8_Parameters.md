# Rhino 8 参数详解与示例 / Parameter Details and Examples

## 1. 常用参数类型 / Common Parameter Types
- **数值 (Number)**：浮点或整数，单位由组件决定（如长度 mm、角度 °）。  
- **布尔 (Boolean)**：True/False，常用于开关、过滤。  
- **对象 (Geometry)**：点、曲线、面、网格等几何实体。  
- **列表 (List)**：有序集合，可用于批量操作。  
- **字符串 (String)**：文本信息，常用于命名、路径。  

## 2. 参数默认值与单位 / Default Values and Units
| 参数 | 默认值 | 单位 | 说明 |
|------|--------|------|------|
| 长度 (Length) | 0.0 | mm | 用于尺寸、间距等计算。 |
| 角度 (Angle) | 0.0 | ° | 用于旋转、倾斜操作。 |
| 颜色 (Color) | 灰色 (Gray) | - | 可选颜色索引或 RGB。 |
| 计数 (Count) | 1 | - | 用于循环次数、实例数量。 |

## 3. 参数面板布局 / Parameter Panel Layout
- **双击**组件打开 **参数面板**（右侧弹窗）。  
- 参数按 **类型分组**：数值、布尔、对象、列表、字符串。  
- 每个参数拥有 **提示信息**（Tooltip），鼠标悬停可查看用法示例。  

## 4. 示例：创建平面矩形框 / Example: Create a Rectangle Frame
1. **组件**：`Rectangle`（Geometry → Base → Rectangle）  
   - **X 端点 (X Pt)**：数值输入，单位 mm。  
   - **Y 端点 (Y Pt)**：数值输入，单位 mm。  
   - **宽度 (Width)**：数值，默认 100 mm。  
   - **高度 (Height)**：数值，默认 200 mm。  
2. **连线**：将 **X Pt** 与 **Y Pt** 连接到 **Construct Point** 组件，形成起点与终点。  
3. **输出**：`Rectangle` 组件的 **Geometry** 输出连接至 **Custom Preview** 组件，实时在画布中显示矩形。  

## 5. 示例：参数化圆弧 / Example: Parametric Arc
- **组件**：`Arc`（Geometry → Base → Arc）  
  - **Start Point (S Pt)**：点向量。  
  - **End Point (E Pt)**：点向量。  
  - **Radius (R)**：数值，单位 mm，默认 50 mm。  
  - **Direction (Dir)**：向量，决定弧的弯曲方向。  
- **参数化**：使用 **Construct Point** 与 **Vector** 组件生成 **S Pt** 与 **E Pt**，再通过 **Vector XYZ** 设定 **Dir**，实现动态弧形。  

## 6. 调试技巧 / Debug Tips
- **预览关闭**：在调试复杂参数时，右键组件 → **Preview Off**，可防止画面闪烁。  
- **数据树**：查看组件右上角的 **Tree** 图标，确认数据流向是否符合预期。  
- **错误提示**：若出现红色警报，检查参数类型是否匹配（如将字符串输入至数值端口）。  

## 7. 小结 / Summary
- 本章节系统介绍了 Rhino 8 中常见参数的类型、默认值、单位以及典型示例。  
- 掌握这些基础后，可在 **M5 UI/UX 设计** 中更自信地进行参数化布局与美化。  

**下一章节**：M5 UI/UX 设计与美化。