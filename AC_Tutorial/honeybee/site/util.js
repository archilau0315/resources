// util.js — 通用工具：转义、图标路径、端口要点、极简 Markdown
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // 图标：矢量 SVG，任意缩放清晰；失败由调用方回退 PNG
  function iconSrc(id) { return '../assets/icons/svg/' + id + '.svg'; }
  function iconFallback(id, size) { return '../assets/icons/' + (size || 48) + '/' + id + '.png'; }

  // 从英文说明里抽取单位/默认值/取值范围，生成中文（或英文）要点
  function portNote(d, lang) {
    if (!d) return '';
    var T = window.HB_T, out = [];
    var m = d.match(/\(Default:\s*([^)]+)\)/i) || d.match(/\bdefault\s+([^.,;\n]+)/i);
    if (m) {
      var v = m[1].trim();
      // 只保留真正的取值（数字/布尔/关键字），避免把整句英文当默认值
      var valueLike = /^[-+]?\d[\d.,]*\s*[A-Za-z%°²³/^·-]{0,10}$/.test(v) ||
        /^(true|false|none|auto|yes|no|0|1)$/i.test(v);
      if (valueLike) out.push(T(lang, 'noteDefault', { v: v }));
      else {
        var same = v.match(/is the same as the ([a-z_0-9]+)/i);
        var low = v.match(/is a very low speed of ([\d.]+)/i);
        if (same) out.push(T(lang, 'noteSame', { v: same[1] }));
        else if (low) out.push(T(lang, 'noteDefault', { v: low[1] }));
      }
    }
    var u = d.match(/\[([A-Za-z°%][A-Za-z0-9°%²³/^.\s-]{1,15})\]/);
    if (!u) {
      u = d.match(/\bin\s+((?:W|kW|Wh|kWh|J|MJ|GJ|m\/s|m2|m²|mm|cm|m|kg|Pa|kPa|degrees?|hours?|minutes?|seconds?|%|C|K|cd\/m2|lux|W\/m2|kWh\/m2|people|m3\/s|l\/s)(?:[\/·^][A-Za-z0-9²³]+)*)\b/i);
    }
    if (u && u[1].split(' ').length <= 2) {
      var unitMap = { 'C': '°C', 'degrees': '°', 'degrees C': '°C', 'm2': 'm²', 'kWh/m2': 'kWh/m²', 'W/m2': 'W/m²' };
      var unit = u[1].trim();
      out.push(T(lang, 'noteUnit', { v: unitMap[unit] || unit }));
    }
    var r = d.match(/\bbetween\s+(-?[\d.]+)\s*(?:and|to)\s*(-?[\d.]+)/i);
    if (r) out.push(T(lang, 'noteRange', { v: r[1] + '–' + r[2] }));
    return out.join(' · ');
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

  window.HBU = { esc: esc, iconSrc: iconSrc, iconFallback: iconFallback, portNote: portNote, mdToHtml: mdToHtml };
})();
