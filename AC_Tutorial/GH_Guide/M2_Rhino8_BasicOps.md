# Rhino 8 基础操作与画布布局 / Basic Operations and Canvas Layout

## 1. 左右布局原则 / Left‑to‑Right Layout Principle
- **输入**放在画布左侧，**输出**放在右侧。  
- 连线尽量保持直线，便于阅读数据流向。

## 2. 拖拽组件 / Drag‑and‑Drop Components
- 从工具箱（Params、Geometry、Util）拖动组件到画布。  
- 双击组件打开参数面板进行调节。

## 3. 连线操作 / Wiring
- 左键拖动输出端到输入端，或右键 → **Connect** 选项。  
- 连线颜色代表数据类型（灰色＝数值，蓝色＝布尔，红色＝对象）。

## 4. 预览控制 / Preview Control
- 右键组件 → **Preview On/Off** 关闭不需要的预览，提升性能。  
- 画布右上角的 **Preview** 开关可全局开关预览。

## 5. 分组与标记 / Grouping and Labeling
- 选中多个组件 → **Ctrl+G**（Windows）或 **Cmd+G**（macOS）进行分组。  
- 使用 **[Scribble]** 组件或 **Text** 组件添加组名，便于后期识别。

## 5. 画布导航快捷键 / Canvas Navigation Shortcuts
| 操作 | 快捷键 |
|------|--------|
| 选取 | 左键点击 |
| 框选 | 左键并拖动（左→右全选，右→左部分选） |
| 重复上一动作 | 右键点击 |
| 旋转视图 | 按住右键并拖动 |
| 平移视图 | 右键 + Shift + 拖动 |
| 缩放视图 | 滚轮或 Pinch 手势 |
| 打开/关闭组件预览 | 右键 → **Preview On/Off** |

## 6. 小结 / Summary
- 完成以上基础操作后，您可以自如地在 Rhino 8 画布上构建、调试 Grasshopper 定义。  
- 接下来进入 **M3 组件搜索与自动补全** 章节，学习如何快速定位和使用组件。