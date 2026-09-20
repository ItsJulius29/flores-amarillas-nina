(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n + 1).padStart(2, '0');

  /* ---------- Flores (planas, de dos capas) ---------- */
  function layer(n, cy, rx, ry, fill, offset) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += '<ellipse cx="50" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" transform="rotate(' + ((360 / n) * i + offset) + ' 50 50)"/>';
    }
    return s;
  }
  function flowerSVG(type) {
    let inner;
    if (type === 'rose') {
      inner = layer(8, 26, 17, 21, '#FFFFFF', 0).replace(/\/>/g, ' stroke="#DCCFEB" stroke-width="1"/>') +
        layer(6, 35, 12, 14, '#FAF6FE', 20).replace(/\/>/g, ' stroke="#CFBDE4" stroke-width="1"/>') +
        layer(4, 42, 8, 9, '#F1E7FA', 45).replace(/\/>/g, ' stroke="#C2A9DE" stroke-width="1"/>') +
        '<circle cx="50" cy="50" r="4.5" fill="#DFCBF1"/>';
    } else if (type === 'lilac') {
      inner = layer(5, 30, 13, 17, '#B79CE0', 0) + layer(5, 34, 9.5, 12, '#CDB7EC', 36) + '<circle cx="50" cy="50" r="6" fill="#F2C94C"/>';
    } else {
      inner = layer(10, 27, 7.5, 20, '#E3B32F', 0) + layer(10, 30, 6.5, 16, '#F5D565', 18) +
        '<circle cx="50" cy="50" r="10" fill="#3A2708"/><circle cx="50" cy="50" r="4.5" fill="#6B4A12"/>';
    }
    return '<svg viewBox="0 0 100 100">' + inner + '</svg>';
  }

  /* ---------- Pétalos suaves (solo en la portada) ---------- */
  (function petals() {
    const box = $('petals');
    const colors = ['#F2C94C', '#F2C94C', '#B79CE0'];
    for (let i = 0; i < 9; i++) {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 7;
      p.className = 'petal';
      p.style.cssText = 'left:' + Math.random() * 100 + '%;width:' + size + 'px;height:' + size * 1.5 + 'px;background:' + colors[i % colors.length] +
        ';--sway:' + (16 + Math.random() * 30) + 'px;animation-duration:' + (14 + Math.random() * 8) + 's;animation-delay:-' + Math.random() * 20 + 's';
      box.appendChild(p);
    }
  })();

  /* ---------- Textos iniciales ---------- */
  $('heroFlower').innerHTML = flowerSVG('yellow');
  $('forName').textContent = 'Para ' + HER_NAME;
  $('hello').textContent = 'Hola, ' + HER_NAME;

  /* ---------- Ramo ---------- */
  const canvas = $('canvas');
  const TYPES = ['yellow', 'yellow', 'lilac', 'rose'];
  const MAX_FLOWERS = 250;

  function updateHint() {
    const n = canvas.children.length;
    $('bouquetHint').textContent = n === 0 ? 'Toca en cualquier lugar para sembrar flores' : n + (n === 1 ? ' flor para ti' : ' flores para ti');
  }
  function plant(x, y, delay) {
    if (canvas.children.length >= MAX_FLOWERS) canvas.removeChild(canvas.firstChild);
    const size = 78 * (0.72 + Math.random() * 0.6);
    const f = document.createElement('div');
    f.className = 'flower';
    f.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;--rot:' + Math.floor(Math.random() * 360) + 'deg;animation-delay:' + (delay || 0) + 'ms';
    f.innerHTML = flowerSVG(pick(TYPES));
    canvas.appendChild(f);
    updateHint();
  }
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    plant(e.clientX - r.left, e.clientY - r.top);
    buzz(10);
  });
  $('surprise').addEventListener('click', () => {
    const r = canvas.getBoundingClientRect();
    for (let i = 0; i < 12; i++) plant(30 + Math.random() * (r.width - 60), 30 + Math.random() * (r.height - 60), i * 70);
    buzz([20, 40, 20]);
  });
  $('clear').addEventListener('click', () => { canvas.innerHTML = ''; updateHint(); });

  /* ---------- Favoritos ---------- */
  $('favGrid').innerHTML = FAVORITES.map((f, i) =>
    '<div class="flip" role="button" tabindex="0" aria-pressed="false"><div class="flip-inner">' +
    '<div class="face front"><span class="num">' + pad(i) + '</span><b>' + esc(f.title) + '</b></div>' +
    '<div class="face back-face"><span>' + esc(f.back) + '</span>' +
    (f.link ? '<a href="' + esc(f.link) + '" target="_blank" rel="noopener">Escuchar ↗</a>' : '') + '</div></div></div>'
  ).join('');
  document.querySelectorAll('.flip').forEach((card) => {
    const toggle = () => { card.classList.toggle('open'); card.setAttribute('aria-pressed', card.classList.contains('open')); buzz(8); };
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) toggle(); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ---------- Carta (se redibuja para reiniciar la animación) ---------- */
  function renderLetter() {
    let html = '<h2 class="to">Para ' + esc(HER_NAME) + ',</h2>';
    LETTER.forEach((t, i) => { html += '<p class="line" style="animation-delay:' + (0.4 + i * 1.1) + 's">' + esc(t) + '</p>'; });
    html += '<div class="sign" style="animation-delay:' + (0.4 + LETTER.length * 1.1) + 's">Con todo mi cariño,<br>' + esc(MY_NAME) + '</div>';
    $('paper').innerHTML = html;
    if (TOGETHER_SINCE) {
      const days = Math.floor((Date.now() - new Date(TOGETHER_SINCE + 'T00:00:00').getTime()) / 86400000);
      $('counter').innerHTML = '<span class="days">' + days + '</span><p class="label">días juntos y contando</p>';
      $('counter').hidden = false;
    }
  }

  /* ---------- Vales ---------- */
  let used = {};
  try { used = JSON.parse(localStorage.getItem('vales') || '{}'); } catch (e) {}
  function renderCoupons() {
    $('couponList').innerHTML = COUPONS.map((c, i) =>
      '<div class="ticket' + (used[i] ? ' done' : '') + '"><span class="num">' + pad(i) + '</span>' +
      '<div class="txt"><b>' + esc(c.title) + '</b><small>' + esc(c.text) + '</small></div>' +
      (used[i] ? '<span class="done-label">Canjeado</span>' : '<button data-i="' + i + '">Canjear</button>') + '</div>'
    ).join('');
  }
  $('couponList').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    used[b.dataset.i] = true;
    try { localStorage.setItem('vales', JSON.stringify(used)); } catch (err) {}
    buzz([20, 40, 20]);
    renderCoupons();
  });
  renderCoupons();

  /* ---------- Deseo ---------- */
  let lastWish = null;
  $('star').addEventListener('click', () => {
    let w;
    do { w = pick(WISHES); } while (w === lastWish && WISHES.length > 1);
    lastWish = w;
    $('wishText').textContent = w;
    const s = $('star');
    s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop');
    buzz([20, 40, 20]);
  });

  /* ---------- Navegación por hash ---------- */
  const screens = ['intro', 'home', 'bouquet', 'favorites', 'letter', 'coupons', 'wish'];
  function route() {
    const name = location.hash.slice(1);
    const id = screens.includes(name) ? name : 'intro';
    screens.forEach((s) => $(s).classList.toggle('active', s === id));
    if (id === 'letter') renderLetter();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
