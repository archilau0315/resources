let CURRICULUM = null;
let CATALOG_COMPONENTS = null;

async function loadCurriculum() {
  if (CURRICULUM) return CURRICULUM;
  const res = await fetch("assets/data/curriculum.json");
  CURRICULUM = await res.json();
  return CURRICULUM;
}

function getModules() {
  return CURRICULUM ? CURRICULUM.modules : [];
}
function getCategories() {
  return CURRICULUM ? CURRICULUM.categories : [];
}
function findModule(id) {
  return getModules().find(m => m.id === id);
}
function getCategoryStyle(catId) {
  const cat = getCategories().find(c => c.id === catId);
  return cat ? { color: cat.color, emoji: cat.emoji, zh: cat.zh, en: cat.en } : { color: "#64748b", emoji: "⚪", zh: catId, en: catId };
}

async function loadCatalogComponents() {
  if (CATALOG_COMPONENTS) return CATALOG_COMPONENTS;
  try {
    const res = await fetch("grasshopper-catalog.html");
    const text = await res.text();
    const match = text.match(/const COMPONENTS = (\[.*\]);/s);
    if (match) {
      CATALOG_COMPONENTS = JSON.parse(match[1]);
    } else {
      CATALOG_COMPONENTS = [];
    }
  } catch (e) {
    CATALOG_COMPONENTS = [];
  }
  return CATALOG_COMPONENTS;
}

function scoreMatch(text, query) {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.includes(q)) return 50;
  let score = 0, idx = 0;
  for (const ch of q) {
    const pos = t.indexOf(ch, idx);
    if (pos === -1) return 0;
    score += (pos === idx ? 2 : 1);
    idx = pos + 1;
  }
  return score;
}

function searchAll(query) {
  if (!query) return { modules: [], components: [] };
  const q = query.trim();
  const modules = getModules().map(m => {
    const hay = m.title.zh + " " + m.title.en + " " + m.desc.zh + " " + m.desc.en + " " + m.keyComponents.join(" ");
    const s = scoreMatch(hay, q);
    return s > 0 ? { type: "module", item: m, score: s } : null;
  }).filter(Boolean);

  let components = [];
  CATALOG_COMPONENTS = CATALOG_COMPONENTS || [];
  CATALOG_COMPONENTS.forEach(c => {
    const hay = c.name + " " + (c.nick || "") + " " + (c.desc || "") + " " + (c.categoryZh || "") + " " + (c.category || "");
    const s = scoreMatch(hay, q);
    if (s > 0) components.push({ type: "component", item: c, score: s });
  });

  modules.sort((a, b) => b.score - a.score);
  components.sort((a, b) => b.score - a.score);
  return { modules: modules.map(r => r.item), components: components.map(r => r.item) };
}

window.DataAPI = { loadCurriculum, getModules, getCategories, findModule, getCategoryStyle, loadCatalogComponents, searchAll };
