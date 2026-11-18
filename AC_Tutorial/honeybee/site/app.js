// app.js — Honeybee 组件速查与教程
(function () {
  'use strict';

  var DATA = '../data/';
  var ICON = function (id, size) { return '../assets/icons/' + (size || 48) + '/' + id + '.png'; };

  var state = {
    view: 'ref', tab: null, sub: null, query: '',
    comps: [], cats: [], chapters: [], terms: [],
    docSlug: null, docLang: 'zh', docCache: {}
  };

  var $ = function (id) { return document.getElementById(id); };

  // ====== 启动 ======
  function init() {
    Promise.all([
      fetchJson(DATA + 'components.json'),
      fetchJson(DATA + 'categories.json'),
      fetchJson(DATA + 'chapters.json'),
      fetchJson(DATA + 'terms.json')
    ]).then(function (res) {
      state.comps = res[0]; state.cats = res[1];
      state.chapters = res[2]; state.terms = res[3];
      bindEvents();
      loadTheme();
      render();
      $('loading').hidden = true;
    }).catch(function (err) {
      $('loading').innerHTML = '<div style="color:#ff6b6b;padding:24px;text-align:center;line-height:1.8">' +
        '数据加载失败：' + err.message + '<br>请通过本地 HTTP 服务打开，例如：<br>' +
        '<code>python -m http.server 8080</code></div>';
    });
  }

  function fetchJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
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
  }

  function go(view) {
    state.view = view;
    state.docSlug = null;
    if (view !== 'doc') state.docLang = 'zh';
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
      $('sidebar-title').textContent = '插件标签页';
      count.textContent = state.comps.length + ' 组件';
      nav.innerHTML = refTreeHtml();
    } else if (state.view === 'doc') {
      $('sidebar-title').textContent = '教程目录';
      count.textContent = countChapters() + ' 篇';
      nav.innerHTML = docTreeHtml();
    } else {
      $('sidebar-title').textContent = '术语表';
      count.textContent = state.terms.length + ' 条';
      nav.innerHTML = '<div class="cat-main active">全部术语</div>';
    }
  }

  function refTreeHtml() {
    var html = '<div class="cat-group">' +
      '<div class="cat-main ' + (!state.tab ? 'active' : '') + '" onclick="window._hb.pickTab(null)">' +
      '<span class="cat-chevron">▸</span>全部组件<span class="cat-count">' + state.comps.length + '</span></div></div>';
    state.cats.forEach(function (cat) {
      var open = state.tab === cat.tab;
      html += '<div class="cat-group ' + (open ? 'open' : '') + '">' +
        '<div class="cat-main ' + (open && !state.sub ? 'active' : '') + '" onclick="window._hb.pickTab(\'' + esc(cat.tab) + '\')">' +
        '<span class="cat-chevron">▸</span>' + esc(cat.tab) + '<span class="cat-count">' + cat.count + '</span></div>' +
        '<div class="cat-subs">';
      cat.subs.forEach(function (sub) {
        var active = open && state.sub === sub.key;
        html += '<div class="cat-sub ' + (active ? 'active' : '') + '" onclick="event.stopPropagation();window._hb.pickSub(\'' +
          esc(cat.tab) + '\',\'' + esc(sub.key) + '\')">' + esc(sub.zh) +
          '<span class="cat-count">' + sub.count + '</span></div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function docTreeHtml() {
    var html = '<div class="cat-group open"><div class="cat-main ' + (!state.docSlug ? 'active' : '') +
      '" onclick="window._hb.openDoc(null)"><span class="cat-chevron">▸</span>教程总览</div></div>';
    state.chapters.forEach(function (part) {
      html += '<div class="cat-group open"><div class="cat-main" style="cursor:default">' +
        '<span class="cat-chevron">▸</span>' + esc(part.part) + '</div><div class="cat-subs">';
      part.items.forEach(function (item) {
        html += '<div class="cat-sub ' + (state.docSlug === item.slug ? 'active' : '') +
          '" onclick="window._hb.openDoc(\'' + esc(item.slug) + '\')">' + esc(item.zh) + '</div>';
      });
      html += '</div></div>';
    });
    return html;
  }

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
    var ports = c.in.concat(c.out).map(function (p) { return p.n + ' ' + p.d; }).join(' ');
    return (c.name + ' ' + c.zh + ' ' + c.nick + ' ' + c.tab + ' ' + c.sub + ' ' +
      c.subZh + ' ' + c.desc + ' ' + c.descEn + ' ' + ports).toLowerCase();
  }

  function renderGrid() {
    var list = filtered();
    $('content-title').textContent = state.sub
      ? state.tab + ' › ' + (subZh(state.tab, state.sub))
      : (state.tab || '全部组件');
    $('content-count').textContent = '共 ' + list.length + ' 个';
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

  function subZh(tab, sub) {
    var found = sub;
    state.cats.forEach(function (cat) {
      if (cat.tab !== tab) return;
      cat.subs.forEach(function (s) { if (s.key === sub) found = s.zh; });
    });
    return found;
  }

  function cardHtml(c) {
    return '<div class="card" onclick="window._hb.openDetail(\'' + esc(c.id) + '\')">' +
      '<div class="card-icon"><img loading="lazy" src="' + ICON(c.id, 48) + '" alt="' + esc(c.name) + '"></div>' +
      '<div class="card-name">' + (c.zh ? esc(c.zh) : esc(c.name)) +
      '<small>' + esc(c.name) + '</small></div>' +
      '<div class="card-cat">' + esc(c.tab) + ' · ' + esc(c.subZh) + '</div></div>';
  }

  // ====== 详情 ======
  function openDetail(id) {
    var c = state.comps.find(function (x) { return x.id === id; });
    if (!c) return;
    var body = $('modal-body');
    body.innerHTML = '<div class="modal-header">' +
      '<div class="modal-icon"><img src="' + ICON(c.id, 96) + '" alt="' + esc(c.name) + '"></div>' +
      '<div class="modal-title-block">' +
      '<h2>' + (c.zh || c.name) + (c.zh ? ' <small>(' + esc(c.name) + ')</small>' : '') + '</h2>' +
      '<div class="modal-breadcrumb">' + esc(c.tab) + ' › ' + esc(c.subZh) + ' · ' + esc(c.sub) +
      (c.ver ? ' · v' + esc(c.ver) : '') + ' · ' + esc(c.nick || '') + '</div>' +
      '<div class="modal-links">' +
      (c.chapter ? '<a href="#" onclick="window._hb.openDocByNum(' + c.chapter + ');return false;">相关章节 第 ' + c.chapter + ' 章 ↗</a>' : '') +
      '<a href="https://docs.ladybug.tools/honeybee-primer/" target="_blank">官方 Primer ↗</a>' +
      '</div></div></div>' +
      (c.desc ? '<div class="modal-section"><h3>功能说明 · 中文</h3><div class="desc">' + esc(c.desc) + '</div></div>' : '') +
      portsHtml(c) +
      (c.descEn ? '<div class="modal-section"><h3>官方说明 · English</h3><div class="desc-en">' + esc(c.descEn) + '</div></div>' : '') +
      '<div class="modal-section" style="font-size:11px;color:var(--text-mute)">图标与英文说明 © Ladybug Tools（AGPL-3.0），仅用于组件功能说明。</div>';
    $('modal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function portsHtml(c) {
    if (!c.in.length && !c.out.length) return '';
    return '<div class="modal-section"><h3>端口 Ports</h3><div class="ports-grid">' +
      (c.in.length ? '<div class="ports-col"><h4>输入 Inputs (' + c.in.length + ')</h4>' +
        c.in.map(function (p) { return portHtml(p, 'input'); }).join('') + '</div>' : '') +
      (c.out.length ? '<div class="ports-col"><h4>输出 Outputs (' + c.out.length + ')</h4>' +
        c.out.map(function (p) { return portHtml(p, 'output'); }).join('') + '</div>' : '') +
      '</div></div>';
  }

  function portHtml(p, dir) {
    return '<div class="port-row ' + dir + '">' +
      (p.r ? '<span class="port-required">必填</span>' : '') +
      '<div class="port-main"><div class="port-name">' + esc(p.n) +
      (p.t ? '<em>' + esc(p.t) + '</em>' : '') + '</div>' +
      '<div class="port-info">' + esc(p.d) + '</div></div></div>';
  }

  function closeModal() {
    $('modal').hidden = true;
    document.body.style.overflow = '';
  }

  // ====== 教程 ======
  function renderDoc() {
    var host = $('doc-view');
    if (!state.docSlug) {
      $('content-title').textContent = '系统教程';
      $('content-count').textContent = countChapters() + ' 篇';
      $('search-count').textContent = '';
      host.innerHTML = '<div class="doc-list">' + state.chapters.map(function (part) {
        return '<div class="doc-part"><h2>' + esc(part.part) + '</h2>' +
          part.items.map(function (item) {
            return '<div class="doc-item" onclick="window._hb.openDoc(\'' + esc(item.slug) + '\')">' +
              '<span class="doc-num">' + esc(item.slug.split('-')[0].toUpperCase()) + '</span>' +
              '<span><b>' + esc(item.zh) + '</b><small>' + esc(item.en) + '</small></span></div>';
          }).join('') + '</div>';
      }).join('') + '</div>';
      return;
    }
    var meta = findChapter(state.docSlug);
    $('content-title').textContent = meta ? meta.zh : state.docSlug;
    $('content-count').textContent = '';
    $('search-count').textContent = '';
    host.innerHTML = '<div class="doc-article"><div class="doc-toolbar">' +
      '<button onclick="window._hb.openDoc(null)">← 返回目录</button>' +
      '<button class="' + (state.docLang === 'zh' ? 'active' : '') + '" onclick="window._hb.setLang(\'zh\')">中文</button>' +
      '<button class="' + (state.docLang === 'en' ? 'active' : '') + '" onclick="window._hb.setLang(\'en\')">English</button>' +
      '</div><div class="doc-body" id="doc-body">加载中...</div></div>';
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
    state.docLang = 'zh';
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
      if (el) el.innerHTML = mdToHtml(text);
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
      el.innerHTML = '<p style="color:var(--text-mute)">' +
        (lang === 'en' ? 'English version is being prepared.' : '该章节尚未编写。') + '</p>';
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
    $('content-title').textContent = '术语表 Glossary';
    $('content-count').textContent = list.length + ' 条';
    $('search-count').textContent = state.query ? list.length : '';
    $('terms-view').innerHTML = '<table><thead><tr><th>English</th><th>中文</th><th>说明</th></tr></thead><tbody>' +
      list.map(function (t) {
        return '<tr><td>' + esc(t.en) + '</td><td>' + esc(t.zh) + '</td><td>' + esc(t.note) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  // ====== 极简 Markdown 渲染 ======
  function mdToHtml(md) {
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^```/.test(line)) {
        var code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        continue;
      }
      if (/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/.test(line)) {
        var img = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
        out.push('<figure><img loading="lazy" src="' + esc(img[2]) + '" alt="' + esc(img[1]) + '">' +
          (img[1] ? '<figcaption>' + esc(img[1]) + '</figcaption>' : '') + '</figure>');
        i++; continue;
      }
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        out.push(tableHtml(rows));
        continue;
      }
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) { out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); i++; continue; }
      if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      if (/^\s*>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quote.push(lines[i].replace(/^\s*>\s?/, '')); i++;
        }
        out.push('<blockquote>' + inline(quote.join(' ')) + '</blockquote>');
        continue;
      }
      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++;
        }
        out.push('<ul>' + items.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ul>');
        continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        var ols = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          ols.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++;
        }
        out.push('<ol>' + ols.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ol>');
        continue;
      }
      if (!line.trim()) { i++; continue; }
      var para = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*>|\s*[-*+]\s|\s*\d+\.\s|\s*\|)/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function tableHtml(rows) {
    var cells = rows.map(function (r) {
      return r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
    });
    var head = cells[0];
    var bodyRows = cells.slice(2);
    return '<table><thead><tr>' + head.map(function (h) { return '<th>' + inline(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + bodyRows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  function inline(text) {
    var html = esc(text);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/\[\[([^\]]+)\]\]/g, function (_, name) {
      return '<span class="doc-chip" onclick="window._hb.openByName(\'' + name.replace(/'/g, "\\'") + '\')">' + name + '</span>';
    });
    return html;
  }

  function openByName(name) {
    var c = state.comps.find(function (x) { return x.name.toLowerCase() === name.toLowerCase(); });
    if (!c) return;
    state.view = 'ref';
    render();
    openDetail(c.id);
  }

  // ====== 工具 ======
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

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
