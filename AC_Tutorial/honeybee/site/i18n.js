// i18n.js — 界面文案字典（默认中文，英文同步完整）
(function () {
  'use strict';

  var zh = {
    brandTitle: 'Honeybee 速查与教程',
    brandSub: 'Ladybug Tools 1.10 · 429 组件 · 中英对照',
    navRef: '组件速查', navDoc: '系统教程', navTerms: '术语表',
    searchPh: '搜索组件名、昵称、端口、说明...',
    searchPhEn: 'Search name, nickname, port, description...',
    theme: '切换主题', lang: '语言',
    sidebarRef: '插件标签页', sidebarDoc: '教程目录', sidebarTerms: '术语表',
    countComp: '{n} 组件', countChapter: '{n} 篇', countTerm: '{n} 条',
    allComponents: '全部组件', docOverview: '教程总览', allTerms: '全部术语',
    contentCount: '共 {n} 个', noMatch: '没找到匹配内容',
    loadingText: '加载组件数据...',
    loadError: '数据加载失败', loadHint: '请通过本地 HTTP 服务打开，例如：',
    secDesc: '功能说明', secDescEn: '官方说明', secPorts: '端口',
    inputs: '输入', outputs: '输出', required: '必填',
    relatedChapter: '相关章节', chapterUnit: '第 {n} 章',
    officialPrimer: '官方 Primer',
    copyright: '图标与英文说明 © Ladybug Tools（AGPL-3.0），仅用于组件功能说明。',
    noteDefault: '默认 {v}', noteUnit: '单位 {v}', noteRange: '取值 {v}', noteSame: '同 {v}',
    backToToc: '← 返回目录', docMissing: '该章节尚未编写。',
    tutorialTitle: '系统教程',
    thEn: '英文', thZh: '中文', thNote: '说明',
    close: '关闭', footer: '图标与英文说明 © Ladybug Tools · AGPL-3.0 ｜ 中文整理与站点 CC BY-NC 4.0 ｜ KBIT AI',
    enOriginal: 'English original', zhOriginal: '中文原名',
    portDetail: '详细说明（中文 + 英文原文）', zhNotes: '中文说明：'
  };

  var en = {
    brandTitle: 'Honeybee Reference & Tutorial',
    brandSub: 'Ladybug Tools 1.10 · 429 components · ZH / EN',
    navRef: 'Components', navDoc: 'Tutorials', navTerms: 'Glossary',
    searchPh: 'Search name, nickname, port, description...',
    searchPhEn: 'Search name, nickname, port, description...',
    theme: 'Toggle theme', lang: 'Language',
    sidebarRef: 'Plugin Tabs', sidebarDoc: 'Contents', sidebarTerms: 'Glossary',
    countComp: '{n} components', countChapter: '{n} chapters', countTerm: '{n} terms',
    allComponents: 'All Components', docOverview: 'Tutorial Overview', allTerms: 'All Terms',
    contentCount: '{n} items', noMatch: 'No matching content',
    loadingText: 'Loading component data...',
    loadError: 'Failed to load data', loadHint: 'Please serve the folder over HTTP, e.g.',
    secDesc: 'Description', secDescEn: 'Official Description', secPorts: 'Ports',
    inputs: 'Inputs', outputs: 'Outputs', required: 'Required',
    relatedChapter: 'Related chapter', chapterUnit: 'Ch. {n}',
    officialPrimer: 'Official Primer',
    copyright: 'Icons and English descriptions © Ladybug Tools (AGPL-3.0), for reference only.',
    noteDefault: 'Default {v}', noteUnit: 'Unit {v}', noteRange: 'Range {v}', noteSame: 'Same as {v}',
    backToToc: '← Back to contents', docMissing: 'English version is being prepared.',
    tutorialTitle: 'Tutorials',
    thEn: 'English', thZh: 'Chinese', thNote: 'Note (Chinese)',
    close: 'Close', footer: 'Icons and English descriptions © Ladybug Tools · AGPL-3.0 ｜ Chinese notes and site CC BY-NC 4.0 ｜ KBIT AI',
    enOriginal: 'English original', zhOriginal: 'Chinese original',
    portDetail: 'Details · 中文说明', zhNotes: 'Chinese notes: '
  };

  // 端口类型：数据里是中文，英文模式映射回英文
  var typeEn = { '数值': 'Number', '文本': 'Text', '列表': 'List', '布尔': 'Boolean', '整数': 'Integer' };

  window.HB_I18N = { zh: zh, en: en, typeEn: typeEn };

  window.HB_T = function (lang, key, params) {
    var dict = window.HB_I18N[lang] || zh;
    var s = dict[key] != null ? dict[key] : (zh[key] != null ? zh[key] : key);
    if (params) {
      Object.keys(params).forEach(function (k) {
        s = s.replace('{' + k + '}', params[k]);
      });
    }
    return s;
  };
})();
