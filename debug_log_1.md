# resources 仓库调试与变更日志 · Debug & Change Log

### 1. 新建顶层 README（GitHub 风格，中英双语）

- **时间**：2026-11-19
- **模块**：`readme.md`（仓库根，新建）
- **变更**：为 `resources` 多项目资源仓库新建顶层 README，统领 AC_Tutorial 下的 4 个子项目（Honeybee、Grasshopper 2、CI Tools、GDL 教程）。GitHub 风格：居中标题 + shields.io badge、2×2 项目卡片表、在线访问表、本地运行说明、仓库结构、技术栈、数据来源/致谢、许可、联系方式；全文中英双语同文件。
- **校验**：4 个在线链接（honeybee/gh_guide/ci_tools/GDL）经公网 HTTPS 验证均返回 200；总入口 `/resources/AC_Tutorial/` 因无 index 返回 403，故未列入。
- **备注**：本文件为顶层仓库首次建立 debug_log 惯例，后续顶层改动继续追加编号。
