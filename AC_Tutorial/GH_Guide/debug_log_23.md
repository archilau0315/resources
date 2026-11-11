# 调试日志 23 | Debug Log 23

| 时间 | 模块名 | 变更简述 | 备注 |
|------|--------|----------|------|
| 2026-11-11 | assets/css/style.css | 新增进度跟踪样式（进度条、状态按钮、完成/收藏状态） | 支持 localStorage 持久化 |
| 2026-11-11 | assets/js/main.js | 新增 localStorage 进度跟踪逻辑（已完成/收藏、进度条显示、状态按钮） | 课程卡片显示完成/收藏状态 |
| 2026-11-11 | index.html | 新增进度条区域、离线运行说明 | 进度条显示已完成/总模块数 |
| 2026-11-11 | pages/module.html | 新增导出 PDF 按钮（window.print）、完成/收藏状态按钮 | 可导出模块文档为 PDF |
| 2026-11-11 | pages/catalog.html | 组件详解扩充至 60 个核心组件 | 从 20 个增加到 60 个，每个包含 inputs/outputs 详细参数 |
| 2026-11-11 | grasshopper-catalog.html | 60 个组件添加 detail: true 和 inputs/outputs 数据 | 覆盖点、曲线、曲面、变换、分析、集合、数据树、矢量、网格等类别 |
| 2026-11-11 | GH_CSharp_Plugin_Template/ | 新建 C# Grasshopper 插件模板项目（独立 git 仓库） | 包含 MyFirstComponent.cs、PluginInfo.cs、csproj、build.bat、readme.md |
| 2026-11-11 | GH_GhPython_Scripts/ | 新建 GhPython 脚本库项目（独立 git 仓库） | 包含 hello_gh.py、parametric_box.py、curve_analysis.py、requirements.txt |
| Time | Module | Change Summary | Notes |
| 2026-11-11 | All | v2.2.0: progress tracking, PDF export, 60 component details, two new plugin/script projects |
