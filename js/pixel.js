/*
 * Sets headings in the game's own 5x7 pixel font, drawn as crisp SVG.
 *   <h1 class="px" data-scale="5">ONLINE MANUAL</h1>
 * The words stay in the page for screen readers and for search; only their
 * look changes. No web fonts, so the site makes no third-party requests.
 */
(function () {
  var G = window.BONEBOX_GLYPHS || {};
  var NS = 'http://www.w3.org/2000/svg';

  /** One line of text as an SVG, each lit pixel run a single rect. */
  function draw(text, scale, color) {
    var chars = text.toUpperCase().split('');
    var cols = chars.length * 6 - 1;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + cols + ' 7');
    svg.setAttribute('width', cols * scale);
    svg.setAttribute('height', 7 * scale);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var d = '';
    chars.forEach(function (ch, i) {
      var rows = (G[ch] || G['?'] || '').split('|');
      rows.forEach(function (row, y) {
        var x = 0;
        while (x < row.length) {
          if (row[x] !== '#') { x++; continue; }
          var x0 = x;
          while (x < row.length && row[x] === '#') x++;
          d += 'M' + (i * 6 + x0) + ' ' + y + 'h' + (x - x0) + 'v1h-' + (x - x0) + 'z';
        }
      });
    });
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', color || 'currentColor');
    svg.appendChild(path);
    return svg;
  }

  function pixelate(el) {
    var text = el.textContent.trim();
    if (!text) return;
    var scale = Number(el.getAttribute('data-scale')) || 4;
    var hidden = document.createElement('span');
    hidden.className = 'px-text';
    hidden.textContent = text;
    el.textContent = '';
    el.appendChild(hidden);
    el.appendChild(draw(text, scale, el.getAttribute('data-color')));
    el.classList.add('px-done');
  }

  /** A small pixel bone, used as the rule under a page title. */
  var BONE = [
    '.##.....................##.',
    '####...................####',
    '###########################',
    '###########################',
    '####...................####',
    '.##.....................##.',
  ];

  function bone(el) {
    var scale = Number(el.getAttribute('data-scale')) || 3;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 27 6');
    svg.setAttribute('width', 27 * scale);
    svg.setAttribute('height', 6 * scale);
    svg.setAttribute('aria-hidden', 'true');
    var d = '';
    BONE.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        if (row[x] !== '#') { x++; continue; }
        var x0 = x;
        while (x < row.length && row[x] === '#') x++;
        d += 'M' + x0 + ' ' + y + 'h' + (x - x0) + 'v1h-' + (x - x0) + 'z';
      }
    });
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', '#d8c0a0');
    svg.appendChild(path);
    el.appendChild(svg);
  }

  window.BONEBOX_PIXEL = { draw: draw, pixelate: pixelate };

  document.querySelectorAll('.px').forEach(pixelate);
  document.querySelectorAll('.bone-rule').forEach(bone);
})();
