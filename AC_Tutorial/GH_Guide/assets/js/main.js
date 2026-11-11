let autocompleteTimeout;

async function init() {
  await DataAPI.loadCurriculum();
  await DataAPI.loadCatalogComponents();

  const langBtn = document.getElementById("langSwitch");
  const searchInput = document.getElementById("searchInput");
  const autocomplete = document.getElementById("autocomplete");
  const searchResults = document.getElementById("searchResults");
  const courseGrid = document.getElementById("courseGrid");
  const catalogGrid = document.getElementById("catalogGrid");
  const navLinks = document.querySelectorAll(".nav-link");

  updatePageText();
  renderCourses();
  renderCatalogPreview();

  langBtn.addEventListener("click", () => {
    I18N_API.setLang(I18N_API.getLang() === "zh" ? "en" : "zh");
    langBtn.textContent = I18N_API.t("langLabel");
    updatePageText();
    renderCourses();
    renderCatalogPreview();
  });

  document.getElementById("btnStart").addEventListener("click", () => {
    location.hash = "#course";
    document.getElementById("course").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("btnCatalog").addEventListener("click", () => {
    location.hash = "#catalog";
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("href");
      document.querySelector(target).scrollIntoView({ behavior: "smooth" });
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(autocompleteTimeout);
    const q = searchInput.value.trim();
    autocompleteTimeout = setTimeout(() => {
      if (!q) {
        autocomplete.innerHTML = "";
        autocomplete.style.display = "none";
        searchResults.innerHTML = "";
        return;
      }
      const { modules, components } = DataAPI.searchAll(q);
      renderAutocomplete(modules, components, q);
      renderSearchResults(modules, components, q);
    }, 150);
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !autocomplete.contains(e.target)) {
      autocomplete.style.display = "none";
    }
  });

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
  }

  window.addEventListener("hashchange", () => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function updatePageText() {
  const t = I18N_API.t;
  document.getElementById("pageTitle").textContent = t("brand") + " | GH Guide";
  document.getElementById("brandLink").innerHTML = "GH <span>" + t("brand") + "</span>";
  document.getElementById("heroTitle").textContent = t("heroTitle");
  document.getElementById("heroSub").textContent = t("heroSub");
  document.getElementById("btnStart").textContent = t("startLearning");
  document.getElementById("btnCatalog").textContent = t("browseCatalog");
  document.getElementById("navCourse").textContent = t("navCourse");
  document.getElementById("navCatalog").textContent = t("navCatalog");
  document.getElementById("courseTitle").textContent = t("courseMap");
  document.getElementById("courseSub").textContent = t("courseMapSub");
  document.getElementById("catalogTitle").textContent = t("componentCatalog");
  document.getElementById("catalogSub").textContent = t("componentCatalogSub");
  document.getElementById("footerText").textContent = t("footer");
  searchInput.placeholder = t("searchPlaceholder");
}

function difficultyTag(lang, diff) {
  const map = { zh: { 初级: "tag-beginner", 中级: "tag-intermediate", 高级: "tag-advanced" }, en: { Beginner: "tag-beginner", Intermediate: "tag-intermediate", Advanced: "tag-advanced" } };
  return `<span class="course-tag ${map[lang][diff]}">${diff}</span>`;
}

function renderCourses() {
  const grid = document.getElementById("courseGrid");
  const lang = I18N_API.getLang();
  const modules = DataAPI.getModules();
  grid.innerHTML = modules.map(m => {
    const cat = DataAPI.getCategoryStyle(m.category);
    const title = m.title[lang];
    const desc = m.desc[lang];
    const tag = difficultyTag(lang, m.difficulty);
    return `
      <div class="course-card" onclick="location.href='pages/module.html?id=${m.id}&lang=${lang}'">
        <div class="course-header">
          <span class="course-emoji">${cat.emoji}</span>
          <span class="course-meta">${cat[lang]}</span>
        </div>
        <div class="course-title">${title}</div>
        <div class="course-desc">${desc}</div>
        <div class="course-footer">
          ${tag}
          <span class="course-time">${m.time} · ${m.prerequisites.length ? t("prerequisites") + ": " + m.prerequisites.join(", ") : t("prerequisites") + ": 无"}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderCatalogPreview() {
  const grid = document.getElementById("catalogGrid");
  const lang = I18N_API.getLang();
  const comps = DataAPI.CATALOG_COMPONENTS || [];
  const preview = comps.slice(0, 12);
  grid.innerHTML = preview.map(c => {
    const catZh = c.categoryZh || c.category || "";
    const catEn = c.category || "";
    return `
      <div class="catalog-card">
        <div class="catalog-name">${c.name}</div>
        <div class="catalog-desc">${c.desc || ""}</div>
        <div class="catalog-meta">
          <span>${catZh}</span>
          <span>${c.addonZh || c.addon || ""}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderAutocomplete(modules, components, q) {
  const wrap = document.getElementById("autocomplete");
  const lang = I18N_API.getLang();
  wrap.innerHTML = "";
  if (modules.length === 0 && components.length === 0) {
    wrap.style.display = "none";
    return;
  }
  let html = "";
  modules.slice(0, 5).forEach(m => {
    const cat = DataAPI.getCategoryStyle(m.category);
    html += `<div class="ac-item" onclick="location.href='pages/module.html?id=${m.id}&lang=${lang}'">
      <span class="ac-emoji">${cat.emoji}</span>
      <span class="ac-name">${highlight(m.title[lang], q)}</span>
      <span class="ac-meta">${m.title[lang === "zh" ? "en" : "zh"]}</span>
    </div>`;
  });
  components.slice(0, 5).forEach(c => {
    html += `<div class="ac-item" onclick="location.href='pages/catalog.html?name=${encodeURIComponent(c.name)}&lang=${lang}'">
      <span class="ac-emoji">🧩</span>
      <span class="ac-name">${highlight(c.name, q)}</span>
      <span class="ac-meta">${c.categoryZh || c.category}</span>
    </div>`;
  });
  wrap.innerHTML = html;
  wrap.style.display = "block";
}

function renderSearchResults(modules, components, q) {
  const box = document.getElementById("searchResults");
  const lang = I18N_API.getLang();
  const total = modules.length + components.length;
  if (total === 0) {
    box.innerHTML = `<div class="empty"><div class="emoji">🔍</div><p>${I18N_API.t("noResults")}</p></div>`;
    return;
  }
  let html = `<div style="font-size:13px;color:${'var(--muted)'};margin-bottom:8px;">${total} ${I18N_API.t("resultsCount")}</div>`;
  modules.slice(0, 8).forEach(m => {
    const cat = DataAPI.getCategoryStyle(m.category);
    html += `<a class="ac-item" style="display:block" href="pages/module.html?id=${m.id}&lang=${lang}">
      <span class="ac-emoji">${cat.emoji}</span>
      <span class="ac-name">${highlight(m.title[lang], q)}</span>
      <span class="ac-meta">${m.desc[lang].slice(0, 40)}...</span>
    </a>`;
  });
  components.slice(0, 8).forEach(c => {
    html += `<a class="ac-item" style="display:block" href="pages/catalog.html?name=${encodeURIComponent(c.name)}&lang=${lang}">
      <span class="ac-emoji">🧩</span>
      <span class="ac-name">${highlight(c.name, q)}</span>
      <span class="ac-meta">${c.categoryZh || c.category}</span>
    </a>`;
  });
  box.innerHTML = html;
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return text.replace(re, "<mark style='background:rgba(56,189,248,0.3);color:#38bdf8;padding:0 2px;border-radius:2px;'>$1</mark>");
}

document.addEventListener("DOMContentLoaded", init);
