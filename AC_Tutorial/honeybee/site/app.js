// app.js — Honeybee 组件速查与教程（中英双语）
(function () {
  'use strict';

  var DATA = '../data/';
  var esc = window.HBU.esc;
  var T = function (k, p) { return window.HB_T(state.lang, k, p); };
  var ICON = window.HBU.iconSrc;

  var state = {
    view: 'ref', tab: null, sub: null, query: '', lang: 'zh',
    comps: [], cats: [], chapters: [], terms: [], portZh: {},
    docSlug: null, docLang: 'zh', detailId: null, docCache: {}
  };

  var $ = function (id) { return document.getElementById(id); };

  // ====== 启动 ======
  function init() {
    var urlLang = new URLSearchParams(location.search).get('lang');
    state.lang = urlLang === 'en' ? 'en' : (localStorage.getItem('hb-lang') === 'en' ? 'en' : 'zh');
    Promise.all([
      fetchJson(DATA + 'components.json'),
      fetchJson(DATA + 'categories.json'),
      fetchJson(DATA + 'chapters.json'),
      fetchJson(DATA + 'terms.json'),
      fetchJson(DATA + 'port_i18n.json').catch(function () { return {}; })
    ]).then(function (res) {
      state.comps = res[0]; state.cats = res[1];
      state.chapters = res[2]; state.terms = res[3]; state.portZh = res[4] || {};
      bindEvents();
      loadTheme();
      applyLangChrome();
      render();
      $('loading').hidden = true;
    }).catch(function (err) {
      $('loading').innerHTML = '<div style="color:#ff6b6b;padding:24px;text-align:center;line-height:1.8">' +
        esc(T('loadError')) + '：' + esc(err.message) + '<br>' + esc(T('loadHint')) + '<br>' +
        '<code>python -m http.server 8080</code></div>';
    });
  }

  function fetchJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  // ====== 语言 ======
  function setUiLang(lang) {
    state.lang = lang;
    localStorage.setItem('hb-lang', lang);
    if (state.view === 'doc' && state.docSlug) state.docLang = lang;
    applyLangChrome();
    render();
    if (state.detailId) openDetail(state.detailId);
  }

  function applyLangChrome() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.lang = state.lang;
    document.title = T('brandTitle') + ' · Ladybug Tools 1.10';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = T(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = T(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = T(el.dataset.i18nTitle);
    });
    document.querySelectorAll('#lang-switch button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === state.lang);
    });
  }

  // ====== 事件 ======
  function bindEvents() {
    $('search').addEventListener('input', function (e) {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== $('search')) {
        e.preventDefault(); $('search').focus();
      } else if (e.key === 'Escape') {
        if (!$('modal').hidden) closeModal();
        else if (state.query) { $('search').value = ''; state.query = ''; render(); }
      }
    });
    $('theme-toggle').addEventListener('click', toggleTheme);
    $('modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    $('view-nav').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-view]');
      if (!btn) return;
      go(btn.dataset.view);
    });
    $('lang-switch').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (btn) setUiLang(btn.dataset.lang);
    });
  }

  function go(view) {
    state.view = view;
    state.docSlug = null;
    state.docLang = state.lang;
    $('search').value = ''; state.query = '';
    render();
  }

  // ====== 渲染入口 ======
  function render() {
    document.querySelectorAll('#view-nav button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.view === state.view);
    });
    var isRef = state.view === 'ref';
    $('grid').hidden = !isRef || !!state.docSlug;
    $('doc-view').hidden = state.view !== 'doc';
    $('terms-view').hidden = state.view !== 'terms';
    $('empty').hidden = true;

    renderSidebar();
    if (state.view === 'ref') renderGrid();
    else if (state.view === 'doc') renderDoc();
    else renderTerms();
  }

  // ====== 侧边栏 ======
  function renderSidebar() {
    var nav = $('category-nav');
    var count = $('sidebar-count');
    if (state.view === 'ref') {
      $('sidebar-title').textContent = T('sidebarRef');
      count.textContent = T('countComp', { n: state.comps.length });
      nav.innerHTML = refTreeHtml();
    } else if (state.view === 'doc') {
      $('sidebar-title').textContent = T('sidebarDoc');
      count.textContent = T('countChapter', { n: countChapters() });
      nav.innerHTML = docTreeHtml();
    } else {
      $('sidebar-title').textContent = T('sidebarTerms');
      count.textContent = T('countTerm', { n: state.terms.length });
      nav.innerHTML = '<div class="cat-main active">' + esc(T('allTerms')) + '</div>';
    }
  }

  function refTreeHtml() {
    var html = '<div class="cat-group">' +
      '<div class="cat-main ' + (!state.tab ? 'active' : '') + '" onclick="window._hb.pickTab(null)">' +
      '<span class="cat-chevron">▸</span>' + esc(T('allComponents')) +
      '<span class="cat-count">' + state.comps.length + '</span></div></div>';
    state.cats.forEach(function (cat) {
      var open = state.tab === cat.tab;
      html += '<div class="cat-group ' + (open ? 'open' : '') + '">' +
        '<div class="cat-main ' + (open && !state.sub ? 'active' : '') + '" onclick="window._hb.pickTab(\'' + esc(cat.tab) + '\')">' +
        '<span class="cat-chevron">▸</span>' + esc(cat.tab) + '<span class="cat-count">' + cat.count + '</span></div>' +
        '<div class="cat-subs">';
      cat.subs.forEach(function (sub) {
        var active = open && state.sub === sub.key;
        html += '<div class="cat-sub ' + (active ? 'active' : '') + '" onclick="event.stopPropagation();window._hb.pickSub(\'' +
          esc(cat.tab) + '\',\'' + esc(sub.key) + '\')">' + esc(subLabel(sub)) +
          '<span class="cat-count">' + sub.count + '</span></div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function docTreeHtml() {
    var html = '<div class="cat-group open"><div class="cat-main ' + (!state.docSlug ? 'active' : '') +
      '" onclick="window._hb.openDoc(null)"><span class="cat-chevron">▸</span>' + esc(T('docOverview')) + '</div></div>';
    state.chapters.forEach(function (part) {
      html += '<div class="cat-group open"><div class="cat-main" style="cursor:default">' +
        '<span class="cat-chevron">▸</span>' + esc(partLabel(part)) + '</div><div class="cat-subs">';
      part.items.forEach(function (item) {
        html += '<div class="cat-sub ' + (state.docSlug === item.slug ? 'active' : '') +
          '" onclick="window._hb.openDoc(\'' + esc(item.slug) + '\')">' + esc(itemLabel(item)) + '</div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function subLabel(sub) { return state.lang === 'zh' ? sub.zh : sub.key; }
  function partLabel(part) { return state.lang === 'zh' ? part.part : (part.partEn || part.part); }
  function itemLabel(item) { return state.lang === 'zh' ? item.zh : item.en; }

  function countChapters() {
    return state.chapters.reduce(function (n, p) { return n + p.items.length; }, 0);
  }

  function pickTab(tab) {
    state.tab = tab; state.sub = null;
    render();
  }

  function pickSub(tab, sub) {
    state.tab = tab; state.sub = sub;
    render();
  }

  // ====== 组件网格 ======
  function filtered() {
    var pool = state.comps;
    if (state.tab) pool = pool.filter(function (c) { return c.tab === state.tab; });
    if (state.sub) pool = pool.filter(function (c) { return c.sub === state.sub; });
    if (state.query) {
      var q = state.query;
      pool = pool.filter(function (c) { return haystack(c).indexOf(q) >= 0; });
    }
    return pool;
  }

  function haystack(c) {
    var ports = c.in.concat(c.out).map(function (p) {
      return p.n + ' ' + p.d + ' ' + (state.portZh[p.n] || '');
    }).join(' ');
    return (c.name + ' ' + c.zh + ' ' + c.nick + ' ' + c.tab + ' ' + c.sub + ' ' +
      c.subZh + ' ' + c.desc + ' ' + c.descEn + ' ' + ports).toLowerCase();
  }

  function subZh(tab, sub) {
    var found = sub;
    state.cats.forEach(function (cat) {
      if (cat.tab !== tab) return;
      cat.subs.forEach(function (s) { if (s.key === sub) found = s.zh; });
    });
    return found;
  }

  function subText(c) { return state.lang === 'zh' ? c.subZh : c.sub; }

  function renderGrid() {
    var list = filtered();
    $('content-title').textContent = state.sub
      ? state.tab + ' › ' + subText({ subZh: subZh(state.tab, state.sub), sub: state.sub })
      : (state.tab || T('allComponents'));
    $('content-count').textContent = T('contentCount', { n: list.length });
    $('search-count').textContent = state.query ? list.length : '';

    if (!list.length) {
      $('grid').innerHTML = '';
      $('empty').hidden = false;
      return;
    }
    $('empty').hidden = true;
    var BATCH = 80, shown = Math.min(BATCH, list.length);
    $('grid').innerHTML = list.slice(0, shown).map(cardHtml).join('');
    if (list.length > shown) {
      var sentinel = document.createElement('div');
      sentinel.style.height = '1px';
      $('grid').appendChild(sentinel);
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        var next = list.slice(shown, shown + BATCH);
        shown += next.length;
        next.forEach(function (c) {
          sentinel.insertAdjacentHTML('beforebegin', cardHtml(c));
        });
        if (shown >= list.length) { io.disconnect(); sentinel.remove(); }
      });
      io.observe(sentinel);
    }
  }

  function cardHtml(c) {
    var main = state.lang === 'zh' ? (c.zh || c.name) : c.name;
    var small = state.lang === 'zh' ? c.name : (c.zh || '');
    return '<div class="card" onclick="window._hb.openDetail(\'' + esc(c.id) + '\')">' +
      '<div class="card-icon">' + iconImg(c, '48') + '</div>' +
      '<div class="card-name">' + esc(main) +
      (small ? '<small>' + esc(small) + '</small>' : '') + '</div>' +
      '<div class="card-cat">' + esc(c.tab) + ' · ' + esc(subText(c)) + '</div></div>';
  }

  // 矢量图标 + PNG 回退
  function iconImg(c, folder) {
    return '<img loading="lazy" src="' + ICON(c.id) + '" alt="' + esc(c.name) +
      '" onerror="this.onerror=null;this.src=\'' + window.HBU.iconFallback(c.id, folder) + '\'">';
  }

  // ====== 详情 ======
  function openDetail(id) {
    var c = state.comps.find(function (x) { return x.id === id; });
    if (!c) return;
    state.detailId = id;
    var zh = state.lang === 'zh';
    var title = zh ? (c.zh || c.name) : c.name;
    var subtitle = zh ? c.name : (c.zh || '');
    var body = $('modal-body');
    body.innerHTML = '<div class="modal-header">' +
      '<div class="modal-icon">' + iconImg(c, '96') + '</div>' +
      '<div class="modal-title-block">' +
      '<h2>' + esc(title) + (subtitle ? ' <small>(' + esc(subtitle) + ')</small>' : '') + '</h2>' +
      '<div class="modal-breadcrumb">' + esc(c.tab) + ' › ' + esc(subText(c)) +
      (c.ver ? ' · v' + esc(c.ver) : '') + ' · ' + esc(c.nick || '') + '</div>' +
      '<div class="modal-links">' +
      (c.chapter ? '<a href="#" onclick="window._hb.openDocByNum(' + c.chapter + ');return false;">' +
        esc(T('relatedChapter')) + ' ' + esc(T('chapterUnit', { n: c.chapter })) + ' ↗</a>' : '') +
      '<a href="https://docs.ladybug.tools/honeybee-primer/" target="_blank">' + esc(T('officialPrimer')) + ' ↗</a>' +
      '</div></div></div>' +
      descHtml(c, zh) + portsHtml(c) +
      '<div class="modal-section" style="font-size:11px;color:var(--text-mute)">' + esc(T('copyright')) + '</div>';
    $('modal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function descHtml(c, zh) {
    var out = '';
    if (zh) {
      if (c.desc) out += section(T('secDesc') + ' · 中文', '<div class="desc">' + esc(c.desc) + '</div>');
      if (c.descEn) out += section(T('secDescEn') + ' · English', '<div class="desc-en">' + esc(c.descEn) + '</div>');
    } else {
      if (c.descEn) out += section(T('secDescEn'), '<div class="desc-en">' + esc(c.descEn) + '</div>');
      if (c.desc) out += section(T('secDesc') + ' · 中文', '<div class="desc">' + esc(c.desc) + '</div>');
    }
    return out;
  }

  function section(title, inner) {
    return '<div class="modal-section"><h3>' + esc(title) + '</h3>' + inner + '</div>';
  }

  function portsHtml(c) {
    if (!c.in.length && !c.out.length) return '';
    return section(T('secPorts'), '<div class="ports-grid">' +
      (c.in.length ? '<div class="ports-col"><h4>' + esc(T('inputs')) + ' (' + c.in.length + ')</h4>' +
        c.in.map(function (p) { return portHtml(p, 'input'); }).join('') + '</div>' : '') +
      (c.out.length ? '<div class="ports-col"><h4>' + esc(T('outputs')) + ' (' + c.out.length + ')</h4>' +
        c.out.map(function (p) { return portHtml(p, 'output'); }).join('') + '</div>' : '') +
      '</div>');
  }

  function portDetailHtml(p, zh) {
    if (!p.d) return '';
    var lab = function (k) { return '<span class="port-d-label">' + esc(T(k)) + '</span>'; };
    var zhHtml = '<div class="port-d-zh">' + lab('zhNotes') +
      esc(window.HBU.portZhDetail(p.d, { type: p.t || '数值', req: !!p.r })) + '</div>';
    var enHtml = '<div class="port-d-en">' + lab('enOriginal') + esc(p.d) + '</div>';
    return '<details class="port-d"><summary>' + esc(T('portDetail')) + '</summary><div class="port-d-body">' +
      (zh ? zhHtml + enHtml : zhHtml) + '</div></details>';
  }

  function portHtml(p, dir) {
    var zh = state.lang === 'zh', zhName = state.portZh[p.n] || p.n;
    var type = zh ? (p.t || '') : (window.HB_I18N.typeEn[p.t] || p.t || '');
    var name = zh ? zhName : p.n, sub = (zh ? p.n : zhName) + (type ? ' · ' + type : '');
    var note = window.HBU.portNote(p.d, 'zh');
    var info = zh
      ? (note ? '<div class="port-info">' + esc(note) + '</div>' : '') + portDetailHtml(p, true)
      : (p.d ? '<div class="port-info">' + esc(p.d) + '</div>' : '') +
        (note ? '<div class="port-note-zh">' + esc(note) + '</div>' : '') + portDetailHtml(p, false);
    return '<div class="port-row ' + dir + '">' +
      (p.r ? '<span class="port-required">' + esc(T('required')) + '</span>' : '') +
      '<div class="port-main"><div class="port-name">' + esc(name) +
      (sub ? '<em>' + esc(sub) + '</em>' : '') + '</div>' + info + '</div></div>';
  }

  function closeModal() {
    $('modal').hidden = true;
    state.detailId = null;
    document.body.style.overflow = '';
  }

  // ====== 教程 ======
  function renderDoc() {
    var host = $('doc-view');
    if (!state.docSlug) {
      $('content-title').textContent = T('tutorialTitle');
      $('content-count').textContent = T('countChapter', { n: countChapters() });
      $('search-count').textContent = '';
      host.innerHTML = '<div class="doc-list">' + state.chapters.map(function (part) {
        return '<div class="doc-part"><h2>' + esc(partLabel(part)) + '</h2>' +
          part.items.map(function (item) {
            return '<div class="doc-item" onclick="window._hb.openDoc(\'' + esc(item.slug) + '\')">' +
              '<span class="doc-num">' + esc(item.slug.split('-')[0].toUpperCase()) + '</span>' +
              '<span><b>' + esc(itemLabel(item)) + '</b><small>' + esc(state.lang === 'zh' ? item.en : item.zh) +
              '</small></span></div>';
          }).join('') + '</div>';
      }).join('') + '</div>';
      return;
    }
    var meta = findChapter(state.docSlug);
    $('content-title').textContent = meta ? itemLabel(meta) : state.docSlug;
    $('content-count').textContent = '';
    $('search-count').textContent = '';
    host.innerHTML = '<div class="doc-article"><div class="doc-toolbar">' +
      '<button onclick="window._hb.openDoc(null)">' + esc(T('backToToc')) + '</button>' +
      '<button class="' + (state.docLang === 'zh' ? 'active' : '') + '" onclick="window._hb.setLang(\'zh\')">中文</button>' +
      '<button class="' + (state.docLang === 'en' ? 'active' : '') + '" onclick="window._hb.setLang(\'en\')">English</button>' +
      '</div><div class="doc-body" id="doc-body">' + esc(T('loadingText')) + '</div></div>';
    loadDoc(state.docSlug, state.docLang);
  }

  function findChapter(slug) {
    var hit = null;
    state.chapters.forEach(function (p) {
      p.items.forEach(function (i) { if (i.slug === slug) hit = i; });
    });
    return hit;
  }

  function openDoc(slug) {
    state.docSlug = slug;
    state.docLang = state.lang;
    render();
    $('content').scrollTop = 0;
  }

  function openDocByNum(num) {
    var slug = state.chapters.reduce(function (acc, p) {
      p.items.forEach(function (i) {
        var n = parseInt(i.slug.split('-')[0], 10);
        if (n === num) acc = i.slug;
      });
      return acc;
    }, null);
    closeModal();
    if (!slug) return;
    state.view = 'doc';
    openDoc(slug);
  }

  function setLang(lang) {
    state.docLang = lang;
    renderDoc();
  }

  function loadDoc(slug, lang) {
    var key = slug + '.' + lang;
    var show = function (text) {
      var el = $('doc-body');
      if (el) el.innerHTML = window.HBU.mdToHtml(text);
    };
    if (state.docCache[key]) { show(state.docCache[key]); return; }
    fetch('../doc/' + lang + '/' + slug + '.md').then(function (r) {
      if (!r.ok) throw new Error('missing');
      return r.text();
    }).then(function (text) {
      state.docCache[key] = text;
      show(text);
    }).catch(function () {
      var el = $('doc-body');
      if (!el) return;
      el.innerHTML = '<p style="color:var(--text-mute)">' + esc(
        lang === 'en' ? 'English version is being prepared.' : T('docMissing')) + '</p>';
    });
  }

  // ====== 术语表 ======
  function renderTerms() {
    var list = state.terms;
    if (state.query) {
      var q = state.query;
      list = list.filter(function (t) {
        return (t.en + ' ' + t.zh + ' ' + t.note).toLowerCase().indexOf(q) >= 0;
      });
    }
    $('content-title').textContent = T('sidebarTerms');
    $('content-count').textContent = T('countTerm', { n: list.length });
    $('search-count').textContent = state.query ? list.length : '';
    $('terms-view').innerHTML = '<table><thead><tr><th>' + esc(T('thEn')) + '</th><th>' + esc(T('thZh')) +
      '</th><th>' + esc(T('thNote')) + '</th></tr></thead><tbody>' +
      list.map(function (t) {
        return '<tr><td>' + esc(t.en) + '</td><td>' + esc(t.zh) + '</td><td>' + esc(t.note) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function openByName(name) {
    var c = state.comps.find(function (x) { return x.name.toLowerCase() === name.toLowerCase(); });
    if (!c) return;
    state.view = 'ref';
    render();
    openDetail(c.id);
  }

  // ====== 主题 ======
  function loadTheme() {
    var saved = localStorage.getItem('hb-theme');
    if (saved) document.documentElement.dataset.theme = saved;
  }

  function toggleTheme() {
    var next = document.documentElement.dataset.theme === 'dark' ? '' : 'dark';
    if (next) document.documentElement.dataset.theme = next;
    else delete document.documentElement.dataset.theme;
    localStorage.setItem('hb-theme', next);
  }

  window._hb = {
    pickTab: pickTab, pickSub: pickSub, openDetail: openDetail,
    openDoc: openDoc, openDocByNum: openDocByNum, setLang: setLang,
    openByName: openByName, go: go
  };

  init();
})();
