(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- Flores SVG ---------- */
  function flowerSVG(type) {
    if (type === 'rose') {
      let r = '<svg viewBox="0 0 100 100">';
      for (let i = 0; i < 8; i++) r += '<ellipse cx="50" cy="26" rx="17" ry="21" fill="#FFFFFF" stroke="#D9C8EC" stroke-width="1.3" transform="rotate(' + i * 45 + ' 50 50)"/>';
      for (let i = 0; i < 6; i++) r += '<ellipse cx="50" cy="35" rx="12" ry="14" fill="#FBF7FF" stroke="#CDB8E3" stroke-width="1.3" transform="rotate(' + (i * 60 + 20) + ' 50 50)"/>';
      for (let i = 0; i < 4; i++) r += '<ellipse cx="50" cy="42" rx="8" ry="9" fill="#F4EAFB" stroke="#C2A9DE" stroke-width="1.2" transform="rotate(' + (i * 90 + 45) + ' 50 50)"/>';
      return r + '<circle cx="50" cy="50" r="5" fill="#E2CDF3" stroke="#B99BD9" stroke-width="1"/></svg>';
    }
    const cfg = type === 'lilac'
      ? { n: 5, fill: '#C8A2F0', edge: '#7A4BC4', rx: 14, ry: 15, cr: 9, center: '#FFD93B', core: '#F5B700' }
      : { n: 12, fill: '#FFD93B', edge: '#F5B700', rx: 8, ry: 17, cr: 13, center: '#7A4A00', core: '#A86A00' };
    let petals = '';
    for (let i = 0; i < cfg.n; i++) {
      petals += '<ellipse cx="50" cy="30" rx="' + cfg.rx + '" ry="' + cfg.ry + '" fill="' + cfg.fill + '" stroke="' + cfg.edge +
        '" stroke-width="1" transform="rotate(' + (360 / cfg.n) * i + ' 50 50)"/>';
    }
    return '<svg viewBox="0 0 100 100">' + petals + '<circle cx="50" cy="50" r="' + cfg.cr + '" fill="' + cfg.center +
      '"/><circle cx="50" cy="50" r="' + cfg.cr / 2 + '" fill="' + cfg.core + '" opacity=".7"/></svg>';
  }

  /* ---------- Pétalos de fondo ---------- */
  (function petals() {
    const box = $('petals');
    const colors = ['#FFD93B', '#FFD93B', '#F5B700', '#C8A2F0'];
    const count = window.innerWidth < 600 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = 8 + Math.random() * 10;
      p.className = 'petal';
      p.style.cssText = 'left:' + Math.random() * 100 + '%;width:' + size + 'px;height:' + size * 1.5 + 'px;background:' + colors[i % colors.length] +
        ';--sway:' + (20 + Math.random() * 40) + 'px;animation-duration:' + (8 + Math.random() * 7) + 's;animation-delay:-' + Math.random() * 15 + 's';
      box.appendChild(p);
    }
  })();

  /* ---------- Textos iniciales ---------- */
  $('heroFlower').innerHTML = flowerSVG('yellow');
  $('forName').textContent = 'Para ' + HER_NAME;
  $('hello').textContent = 'Hola, ' + HER_NAME + ' 💛';

  /* ---------- Ramo ---------- */
  const canvas = $('canvas');
  const TYPES = ['yellow', 'yellow', 'lilac', 'rose'];
  const MAX_FLOWERS = 250;
  let count = 0;

  function plant(x, y, delay) {
    if (canvas.children.length >= MAX_FLOWERS) canvas.removeChild(canvas.firstChild);
    const size = 80 * (0.7 + Math.random() * 0.7);
    const f = document.createElement('div');
    f.className = 'flower';
    f.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;--rot:' + Math.floor(Math.random() * 360) + 'deg;animation-delay:' + (delay || 0) + 'ms';
    f.innerHTML = flowerSVG(pick(TYPES));
    canvas.appendChild(f);
    count++;
    updateHint();
  }
  function updateHint() {
    $('bouquetHint').textContent = canvas.children.length === 0 ? 'Toca en cualquier lugar para sembrar flores 🌼' : canvas.children.length + ' flores para ti 💛';
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
  $('favGrid').innerHTML = FAVORITES.map((f) =>
    '<div class="flip" role="button" tabindex="0" aria-pressed="false"><div class="flip-inner">' +
    '<div class="face front"><span class="em">' + f.emoji + '</span><b>' + esc(f.title) + '</b></div>' +
    '<div class="face back-face"><span>' + esc(f.back) + '</span>' +
    (f.link ? '<a href="' + esc(f.link) + '" target="_blank" rel="noopener">▶ Escuchar</a>' : '') + '</div></div></div>'
  ).join('');
  document.querySelectorAll('.flip').forEach((card) => {
    const toggle = () => { card.classList.toggle('open'); card.setAttribute('aria-pressed', card.classList.contains('open')); buzz(8); };
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) toggle(); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ---------- Carta (se vuelve a dibujar para reiniciar la animación) ---------- */
  function renderLetter() {
    let html = '<h3 class="to">Para ' + esc(HER_NAME) + ',</h3>';
    LETTER.forEach((t, i) => { html += '<p class="line" style="animation-delay:' + (0.4 + i * 1.1) + 's">' + esc(t) + '</p>'; });
    html += '<div class="sign" style="animation-delay:' + (0.4 + LETTER.length * 1.1) + 's">Con todo mi cariño,<br>' + esc(MY_NAME) + ' 💛</div>';
    $('paper').innerHTML = html;
    if (TOGETHER_SINCE) {
      const days = Math.floor((Date.now() - new Date(TOGETHER_SINCE + 'T00:00:00').getTime()) / 86400000);
      $('counter').innerHTML = '<span class="days">' + days + '</span><span>días juntos y contando 💜</span>';
      $('counter').hidden = false;
    }
  }

  /* ---------- Vales ---------- */
  let used = {};
  try { used = JSON.parse(localStorage.getItem('vales') || '{}'); } catch (e) {}
  function renderCoupons() {
    $('couponList').innerHTML = COUPONS.map((c, i) =>
      '<div class="ticket' + (used[i] ? ' done' : '') + '"><span class="em">' + c.emoji + '</span><div><b>' + esc(c.title) + '</b><small>' + esc(c.text) + '</small></div>' +
      (used[i] ? '<span class="stamp">¡CANJEADO!</span>' : '<button data-i="' + i + '">Canjear</button>') + '</div>'
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

  /* ---------- Navegación por hash (el botón atrás del navegador funciona) ---------- */
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
