# 调试日志 26 | Debug Log 26

| 时间 | 模块名 | 变更简述 | 备注 |
|------|--------|----------|------|
| 2026-11-11 | assets/js/main.js | 新增搜索历史记录功能（localStorage持久化，最多8条，自动去重置顶） | 首页渲染"最近搜索"标签，点击可快速填入搜索框 |
| 2026-11-11 | index.html | 在搜索区域下方新增 #recentSearches 展示容器 | 与 main.js renderHistory() 联动 |
| 2026-11-11 | assets/css/style.css | 新增 .search-history、.history-title、.history-tags、.history-tag 样式 | 暗色主题标签样式，悬停高亮 |
| Time | Module | Change Summary | Notes |
| 2026-11-11 | All | v2.4.0: Search history with localStorage, recent searches display on home page |
