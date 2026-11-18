// util.js — 通用工具：转义、图标路径、端口要点、极简 Markdown
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // 图标：矢量 SVG，任意缩放清晰；失败由调用方回退 PNG
  var ICON_V = '?v=20261118g';
  function iconSrc(id) { return '../assets/icons/svg/' + id + '.svg' + ICON_V; }
  function iconFallback(id, size) { return '../assets/icons/' + (size || 48) + '/' + id + '.png'; }

  // 常见对象名词 → 中文，用于“涉及对象”提示
  var OBJ_ZH = [
    [/\bmodifier\b/i, 'Modifier 构造集'], [/\bconstruction set\b/i, '构造集（ConstructionSet）'],
    [/\bconstruction\b/i, '构造（Construction）'], [/\bschedule ruleset\b/i, '运行计划规则集'],
    [/\bschedule\b/i, '运行计划（Schedule）'], [/\bprogram type\b/i, '使用类型（ProgramType）'],
    [/\bhoneybee model\b/i, 'Honeybee 模型'], [/\broom\b/i, '房间（Room）'],
    [/\bface\b/i, '面（Face）'], [/\bshade\b/i, '遮阳（Shade）'],
    [/\bmesh\b/i, '网格（Mesh）'], [/\bbrep\b/i, 'Brep 几何'],
    [/\bsensor grid\b/i, '传感器网格'], [/\banalysis period\b/i, '分析时段'],
    [/\bdata collection/i, '数据集合（Data Collection）'], [/\bepw\b/i, 'EPW 气象文件'],
    [/\bhvac\b/i, 'HVAC 系统'], [/\bview\b/i, '视图（View）'], [/\bzone\b/i, '热区（Zone）'],
    [/\bsky matrix\b/i, '天空矩阵（SkyMatrix）'], [/\bsky\b/i, '天空（Sky）'],
    [/\bsun\b/i, '太阳（Sun）'], [/\bweather\b/i, '气象数据（Weather）']
  ];

  // 固定句式 → 中文整句
  var BOILER_ZH = [
    [/reports?, errors?, warnings?/i, '输出为运行报告、错误与警告等信息'],
    [/a python object containing/i, 'Python 对象，包含分析的输入与结果，可接入其他组件继续处理'],
    [/can be plugged into/i, '可接入其他组件继续处理'],
    [/values? (?:are|is) one of the following/i, '取值为下列枚举之一']
  ];
  var LIST_ZH = {
    'honeybee rooms': '房间（Room）', 'honeybee room': '房间（Room）', 'honeybee faces': '面（Face）',
    'honeybee shades': '遮阳（Shade）', 'numbers': '数值', 'data collections': '数据集合',
    'data collection': '数据集合', 'line segments': '线段', 'vectors': '向量', 'points': '点',
    'meshes': '网格', 'surfaces': '表面', 'faces': '面', 'shades': '遮阳', 'schedules': '运行计划',
    'constructions': '构造', 'sensors': '传感器', 'views': '视图', 'text strings': '文本',
    'strings': '文本', 'breps': 'Brep 几何', 'zones': '热区', 'rooms': '房间'
  };

  // 解析英文说明中的结构化事实（单位、默认值、范围、开关等）
  function portFacts(d) {
    var f = { def: '', unit: '', range: '', bool: false, optional: false, ifNone: false,
      ident: false, rhino: false, listOf: '', lowSpeed: '', same: '', tags: [], enumVals: [], boiler: [] };
    if (!d) return f;
    f.optional = /\boptional\b/i.test(d);
    f.bool = /^(?:an?\s+)?(?:optional\s+)?boolean\b/i.test(d) || /^set to\s+"?true"?/i.test(d.trim());
    f.ifNone = /\bif none\b/i.test(d);
    f.ident = /can also be text for the identifier/i.test(d);
    f.rhino = /rhino model units/i.test(d);

    var m = d.match(/\(Default:\s*([^)]+)\)/i) ||
      d.match(/\bdefault[:\s]+(-?\d+(?:\.\d+)?|true|false|none|auto)\b/i) ||
      d.match(/\bdefault\s+([^.,;\n]+)/i);
    if (m) {
      var v = m[1].trim().replace(/^["']|["']$/g, '');
      // 只保留真正的取值（数字/布尔/短词），避免把整句英文当默认值
      var valueLike = /^[-+]?\d[\d.,]*\s*[A-Za-z%°²³/^·-]{0,10}$/.test(v) ||
        /^(true|false|none|auto|yes|no|0|1)$/i.test(v) ||
        /^[A-Za-z][A-Za-z0-9 ._/-]{0,20}$/.test(v);
      if (valueLike) f.def = v;
      else {
        var same = v.match(/is the same as the ([a-z_0-9]+)/i);
        var low = v.match(/is a very low speed of ([\d.]+)/i);
        if (same) f.same = same[1];
        else if (low) { f.def = low[1]; f.lowSpeed = low[1]; }
      }
    }

    var dq = d.match(/\bdefault\s+(?:is|of)\s+["']([^"']{1,24})["']/i);
    if (dq && !f.def) f.def = dq[1];

    var u = d.match(/\[([A-Za-z°%][A-Za-z0-9°%²³/^.\s-]{0,15})\]/);
    if (!u) {
      u = d.match(/\bin\s+((?:W|kW|Wh|kWh|J|MJ|GJ|m\/s|m2|m²|mm|cm|m|kg|Pa|kPa|degrees?|hours?|minutes?|seconds?|%|C|K|cd\/m2|lux|W\/m2|kWh\/m2|people|m3\/s|l\/s)(?:[\/·^][A-Za-z0-9²³]+)*)\b/i);
    }
    if (u && u[1].split(' ').length <= 2) {
      var unitMap = { 'C': '°C', 'degrees': '°', 'degrees C': '°C', 'm2': 'm²', 'kWh/m2': 'kWh/m²', 'W/m2': 'W/m²' };
      f.unit = unitMap[u[1].trim()] || u[1].trim();
    }

    var r = d.match(/\bbetween\s+(-?[\d.]+)\s*(?:and|to)\s*(-?[\d.]+)/i) ||
      d.match(/\((-?\d+)\s*[-–~]\s*(-?\d+)\)/);
    if (r) f.range = r[1] + '–' + r[2];

    var lm = d.match(/^(?:an?\s+)?(?:optional\s+)?(?:list|array) of ([a-z ]{3,40}?)(?:\s+(?:for|to|with|that|which|of|\.|,)|\.|$)/i);
    if (lm) f.listOf = lm[1].trim();

    (function () {
      var i;
      for (i = 0; i < OBJ_ZH.length; i++) {
        if (OBJ_ZH[i][0].test(d) && f.tags.indexOf(OBJ_ZH[i][1]) < 0) f.tags.push(OBJ_ZH[i][1]);
      }
      for (i = 0; i < BOILER_ZH.length; i++) {
        if (BOILER_ZH[i][0].test(d)) f.boiler.push(BOILER_ZH[i][1]);
      }
      var en = d.match(/\*\s*(-?\d+)\s*=/g);
      if (en) f.enumVals = en.map(function (s) { return s.replace(/^[^-\d]*/, '').replace(/\s*=.*$/, ''); });
      if (!f.enumVals.length) {
        var et = d.match(/(?:one of the following|choose from the following)[^:]*:\s*([\s\S]+)$/i);
        if (et) {
          f.enumVals = et[1].split(/\s*[-*]\s+/).slice(0, 6).map(function (s) { return s.trim(); })
            .filter(function (s, i, a) {
              return /^[A-Za-z][A-Za-z0-9 ._/-]{0,23}$/.test(s) && a.indexOf(s) === i;
            });
        }
      }
    })();
    return f;
  }

  // 从英文说明里抽取单位/默认值/取值范围，生成中文（或英文）要点
  function portNote(d, lang) {
    if (!d) return '';
    var T = window.HB_T, f = portFacts(d), out = [];
    if (f.def) out.push(T(lang, 'noteDefault', { v: f.def }));
    if (f.same) out.push(T(lang, 'noteSame', { v: f.same }));
    if (f.unit) out.push(T(lang, 'noteUnit', { v: f.unit }));
    if (f.range) out.push(T(lang, 'noteRange', { v: f.range }));
    return out.join(' · ');
  }

  // 端口的中文详细说明（依据英文原文抽取的结构化事实，始终为中文）
  function portZhDetail(d, opt) {
    opt = opt || {};
    var f = portFacts(d), out = [];
    out.push('类型：' + (opt.type || '数值') + (opt.req ? '（必填）' : '（可选）'));
    if (f.tags.length) out.push('涉及对象：' + f.tags.slice(0, 3).join('、'));
    if (f.def) out.push('默认值：' + f.def);
    if (f.unit) out.push('单位：' + f.unit);
    if (f.range) out.push('取值范围：' + f.range);
    if (f.enumVals.length) out.push('可选值：' + f.enumVals.join(' / '));
    if (f.lowSpeed) out.push('也可用极低风速 ' + f.lowSpeed + ' 代替');
    if (f.same) out.push('与端口 ' + f.same + ' 保持一致');
    if (f.bool || opt.type === '布尔') out.push('开关参数：True 开启，False 关闭');
    if (f.ifNone) out.push('留空（None）表示不启用');
    if (f.ident) out.push('也可直接填写库内对象的标识符文本');
    if (f.rhino) out.push('数值按 Rhino 模型单位理解');
    if (f.listOf) out.push('需要列表数据：' + (LIST_ZH[f.listOf.toLowerCase()] || f.listOf));
    for (var i = 0; i < f.boiler.length; i++) out.push(f.boiler[i]);
    if (out.length === 1) out.push('无默认值、单位或范围约束，具体语义见英文原文');
    return out.join('；') + '。';
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

  window.HBU = { esc: esc, iconSrc: iconSrc, iconFallback: iconFallback, portFacts: portFacts,
    portNote: portNote, portZhDetail: portZhDetail, mdToHtml: mdToHtml };
})();
