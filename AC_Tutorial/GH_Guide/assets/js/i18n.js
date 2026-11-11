const I18N = {
  zh: {
    brand: "GH 指南",
    brandSub: "Rhino 8 / Grasshopper 用户手册与组件速查",
    langLabel: "EN",
    navHome: "首页",
    navCourse: "课程地图",
    navCatalog: "组件目录",
    searchPlaceholder: "搜索课程、组件或关键词...",
    searchBtn: "搜索",
    heroTitle: "系统学习 Grasshopper，从环境到 CI/CD",
    heroSub: "19+ 个学习模块 · 817 个原生组件目录 · 中英双语 · 图文并茂",
    startLearning: "开始学习",
    browseCatalog: "浏览组件",
    courseMap: "课程地图",
    courseMapSub: "按学习路径顺序浏览所有模块",
    componentCatalog: "组件目录",
    componentCatalogSub: "817 个 Rhino 8 原生组件，智能搜索与自动补全",
    allModules: "全部模块",
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
    minutes: "分钟",
    prerequisites: "前置模块",
    keyComponents: "关键组件",
    readModule: "阅读模块",
    backToHome: "返回首页",
    moduleNotFound: "模块未找到",
    componentNotFound: "组件未找到",
    noResults: "未找到匹配项",
    resultsCount: "个结果",
    readMore: "阅读完整文档",
    footer: "© 2026 Kbitai GH Guide · 中英双语",
    category: "分类",
    difficulty: "难度",
    duration: "时长"
  },
  en: {
    brand: "GH Guide",
    brandSub: "Rhino 8 / Grasshopper User Manual & Component Reference",
    langLabel: "中文",
    navHome: "Home",
    navCourse: "Course Map",
    navCatalog: "Component Catalog",
    searchPlaceholder: "Search courses, components or keywords...",
    searchBtn: "Search",
    heroTitle: "Learn Grasshopper systematically, from environment to CI/CD",
    heroSub: "19+ learning modules · 817 native component catalog · Bilingual CN/EN · Illustrated",
    startLearning: "Start Learning",
    browseCatalog: "Browse Components",
    courseMap: "Course Map",
    courseMapSub: "Browse all modules in learning path order",
    componentCatalog: "Component Catalog",
    componentCatalogSub: "817 Rhino 8 native components with smart search and autocomplete",
    allModules: "All Modules",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    minutes: "min",
    prerequisites: "Prerequisites",
    keyComponents: "Key Components",
    readModule: "Read Module",
    backToHome: "Back to Home",
    moduleNotFound: "Module not found",
    componentNotFound: "Component not found",
    noResults: "No matches found",
    resultsCount: "results",
    readMore: "Read full documentation",
    footer: "© 2026 Kbitai GH Guide · Chinese & English Bilingual",
    category: "Category",
    difficulty: "Difficulty",
    duration: "Duration"
  }
};

let currentLang = "zh";

function t(key) {
  return I18N[currentLang][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = t("brand") + " | GH Guide";
  const btn = document.getElementById("langSwitch");
  if (btn) btn.textContent = t("langLabel");
  if (window.renderUI) window.renderUI();
}

function getLang() { return currentLang; }

window.I18N_API = { t, setLang, getLang };
