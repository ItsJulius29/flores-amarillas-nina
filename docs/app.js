(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n + 1).padStart(2, '0');

  /* ---------- Flores (planas, de dos capas) ---------- */
  function layer(n, cy, rx, ry, fill, offset, extra) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += '<ellipse cx="50" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (extra || '') + ' transform="rotate(' + ((360 / n) * i + offset) + ' 50 50)"/>';
    }
    return s;
  }
  // Contenido de la flor en un cuadro de 100x100 (sirve para iconos, lienzo y ramo)
  function flowerInner(type) {
    if (type === 'rose') {
      return layer(8, 26, 17, 21, '#FFFFFF', 0, ' stroke="#DCCFEB" stroke-width="1"') +
        layer(6, 35, 12, 14, '#FAF6FE', 20, ' stroke="#CFBDE4" stroke-width="1"') +
        layer(4, 42, 8, 9, '#F1E7FA', 45, ' stroke="#C2A9DE" stroke-width="1"') +
        '<circle cx="50" cy="50" r="4.5" fill="#DFCBF1"/>';
    }
    if (type === 'lilac') {
      return layer(5, 30, 13, 17, '#B79CE0', 0) + layer(5, 34, 9.5, 12, '#CDB7EC', 36) + '<circle cx="50" cy="50" r="6" fill="#F2C94C"/>';
    }
    return layer(10, 27, 7.5, 20, '#E3B32F', 0) + layer(10, 30, 6.5, 16, '#F5D565', 18) +
      '<circle cx="50" cy="50" r="10" fill="#3A2708"/><circle cx="50" cy="50" r="4.5" fill="#6B4A12"/>';
  }
  const flowerSVG = (type) => '<svg viewBox="0 0 100 100">' + flowerInner(type) + '</svg>';

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

  /* ---------- Ramo: sembrar flores ---------- */
  const canvas = $('canvas');
  const MAX_FLOWERS = 250;
  const MAX_IN_BOUQUET = 60;
  const placed = []; // [{ type, el }] en el orden en que se sembraron
  let choice = 'mix';

  const CHOICES = [
    { id: 'mix', label: 'Mixtas' },
    { id: 'yellow', label: 'Amarillas' },
    { id: 'rose', label: 'Rosas' },
    { id: 'lilac', label: 'Lilas' },
  ];
  const MIX = ['yellow', 'yellow', 'lilac', 'rose'];
  const nextType = () => (choice === 'mix' ? pick(MIX) : choice);

  function renderChips() {
    $('chips').innerHTML = CHOICES.map((c) => {
      const icon = c.id === 'mix'
        ? '<span class="mix">' + ['yellow', 'rose', 'lilac', 'yellow'].map(flowerSVG).join('') + '</span>'
        : flowerSVG(c.id);
      return '<button class="chip" data-c="' + c.id + '" aria-pressed="' + (c.id === choice) + '">' + icon + esc(c.label) + '</button>';
    }).join('');
  }
  $('chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    choice = b.dataset.c;
    renderChips();
  });
  renderChips();

  function updateHint(msg) {
    const n = placed.length;
    $('bouquetHint').textContent = msg || (n === 0 ? 'Toca en cualquier lugar para sembrar flores' : n + (n === 1 ? ' flor para ti' : ' flores para ti'));
  }
  function plant(x, y, type, delay) {
    if (placed.length >= MAX_FLOWERS) placed.shift().el.remove();
    const size = 78 * (0.72 + Math.random() * 0.6);
    const el = document.createElement('div');
    el.className = 'flower';
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;--rot:' + Math.floor(Math.random() * 360) + 'deg;animation-delay:' + (delay || 0) + 'ms';
    el.innerHTML = flowerSVG(type);
    canvas.appendChild(el);
    placed.push({ type, el });
    updateHint();
  }
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    plant(e.clientX - r.left, e.clientY - r.top, nextType());
    buzz(10);
  });
  $('surprise').addEventListener('click', () => {
    const r = canvas.getBoundingClientRect();
    for (let i = 0; i < 12; i++) plant(30 + Math.random() * (r.width - 60), 30 + Math.random() * (r.height - 60), pick(MIX), i * 70);
    buzz([20, 40, 20]);
  });
  $('clear').addEventListener('click', () => { canvas.innerHTML = ''; placed.length = 0; updateHint(); });
  $('makeBouquet').addEventListener('click', () => {
    if (!placed.length) { updateHint('Primero siembra algunas flores para formar tu ramo'); return; }
    location.hash = '#ramo';
  });

  /* ---------- Ramo: armado con lazo (SVG) ---------- */
  function rng(seed) { // generador con semilla: el ramo se ve igual en pantalla y en la imagen
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const f1 = (n) => Math.round(n * 10) / 10;

  function buildBouquet(types) {
    const rand = rng(types.length * 7919 + 13);
    const list = types.slice();
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    if (list.length > MAX_IN_BOUQUET) list.length = MAX_IN_BOUQUET;
    const n = list.length;

    const CX = 230, BX = 230, BY = 470, RMAX = 142;
    const S = Math.min(112, (2.8 * RMAX) / Math.sqrt(n));
    const c = S / 2.8;
    const R = c * Math.sqrt(n);
    const CY = 338 - 0.9 * (R + S / 2);
    const rim = R + S / 2 + 6;
    const GOLDEN = 2.39996;

    let leaves = '', sprigs = '', stems = '', flowers = '';

    // hojas alrededor del borde
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2 + rand() * 0.3;
      const x = CX + Math.cos(a) * rim * 0.92, y = CY + Math.sin(a) * rim * 0.9 * 0.92;
      const deg = (a * 180) / Math.PI;
      const s = (0.85 + rand() * 0.5) * Math.min(1, Math.max(0.55, rim / 190));
      leaves += '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(deg) + ') scale(' + f1(s) + ')">' +
        '<path d="M0 0 C22 -26 62 -26 86 0 C62 26 22 26 0 0Z" fill="' + (i % 2 ? '#4F7F58' : '#5F8F63') + '"/>' +
        '<path d="M6 0 L74 0" stroke="#7DAA7F" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
    }
    // florecitas lilas delgadas
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI * 0.95 + (i / 7) * Math.PI * 1.9 + (rand() - 0.5) * 0.25;
      const rr = rim + 26 + rand() * 20;
      const tx = CX + Math.cos(a) * rr, ty = CY + Math.sin(a) * rr * 0.9;
      const qx = (BX + tx) / 2 + (rand() - 0.5) * 30, qy = (BY - 40 + ty) / 2;
      sprigs += '<path d="M' + BX + ' ' + (BY - 60) + ' Q' + f1(qx) + ' ' + f1(qy) + ' ' + f1(tx) + ' ' + f1(ty) + '" stroke="#5F8F63" stroke-width="2" fill="none" stroke-linecap="round"/>';
      for (let k = 0; k < 5; k++) {
        const t = 0.62 + k * 0.095;
        const px = (1 - t) * (1 - t) * BX + 2 * (1 - t) * t * qx + t * t * tx;
        const py = (1 - t) * (1 - t) * (BY - 60) + 2 * (1 - t) * t * qy + t * t * ty;
        sprigs += '<circle cx="' + f1(px + (rand() - 0.5) * 7) + '" cy="' + f1(py + (rand() - 0.5) * 7) + '" r="' + f1(3.6 - k * 0.3) + '" fill="' + (k % 2 ? '#CDB7EC' : '#B79CE0') + '"/>';
      }
    }
    // flores en espiral (el centro queda arriba); tallos hacia el punto de amarre
    const items = [];
    for (let i = 0; i < n; i++) {
      const r = c * Math.sqrt(i + 0.5), th = i * GOLDEN;
      const x = CX + r * Math.cos(th), y = CY + 0.9 * r * Math.sin(th);
      items.push({ i, x, y, type: list[i], size: S * (0.94 + rand() * 0.14), rot: Math.floor(rand() * 360) });
    }
    items.forEach((it) => {
      stems += '<path d="M' + f1(it.x) + ' ' + f1(it.y) + ' Q' + f1(it.x + (BX - it.x) * 0.25) + ' ' + f1(it.y + (BY - it.y) * 0.65) + ' ' + BX + ' ' + BY + '" stroke="#4F7F58" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
    });
    for (let k = items.length - 1; k >= 0; k--) {
      const it = items[k], s = it.size / 100;
      flowers += '<g transform="translate(' + f1(it.x) + ' ' + f1(it.y) + ') rotate(' + it.rot + ') scale(' + f1(s * 100) / 100 + ')">' +
        '<g class="bloom" style="animation-delay:' + Math.min(2200, (items.length - 1 - k) * 40) + 'ms"><g transform="translate(-50 -50)">' + flowerInner(it.type) + '</g></g></g>';
    }

    // papel de envolver + lazo
    const paper =
      '<path d="M230 622 L88 376 Q230 336 372 376 Z" fill="#CDB7EC"/>' +
      '<path d="M230 622 L372 376 Q302 366 250 392 Z" fill="#B79CE0"/>' +
      '<path d="M230 622 L88 376 Q150 372 196 394 Z" fill="#DCCBF1"/>' +
      '<path d="M88 376 Q230 336 372 376" fill="none" stroke="#E9DBFB" stroke-width="2" stroke-linecap="round" opacity=".7"/>';
    const bow =
      '<path d="M144 470 Q230 490 316 470 L313 492 Q230 512 147 492 Z" fill="#F2C94C"/>' +
      '<path d="M224 494 C214 522 200 548 190 574 L210 565 L218 582 C224 552 232 522 238 496 Z" fill="#E3B32F"/>' +
      '<path d="M236 494 C246 522 260 548 270 574 L250 565 L242 582 C236 552 228 522 222 496 Z" fill="#F2C94C"/>' +
      '<path d="M230 486 C196 446 146 458 166 494 C180 514 214 500 230 486Z" fill="#F2C94C"/>' +
      '<path d="M230 486 C264 446 314 458 294 494 C280 514 246 500 230 486Z" fill="#F2C94C"/>' +
      '<path d="M226 486 C204 468 176 468 172 484" fill="none" stroke="#E3B32F" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M234 486 C256 468 284 468 288 484" fill="none" stroke="#E3B32F" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="230" cy="487" rx="12" ry="13" fill="#E3B32F"/>';

    return '<svg id="bouquetSvg" viewBox="-40 -50 540 700" role="img" aria-label="Tu ramo de flores">' +
      leaves + sprigs + stems + flowers + paper + bow + '</svg>';
  }

  let bouquetTypes = [];
  function renderBouquet() {
    bouquetTypes = placed.map((p) => p.type);
    $('bouquetView').innerHTML = buildBouquet(bouquetTypes);
    $('saveMsg').textContent = 'Hecho con las flores que sembraste. También puedes hacer una captura.';
  }

  /* ---------- Guardar / compartir el ramo como imagen ---------- */
  async function bouquetBlob() {
    const svg = $('bouquetSvg').cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', 1080);
    svg.setAttribute('height', 1400);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res; img.onerror = rej;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    });
    try { await Promise.all([document.fonts.load('italic 500 60px "Cormorant Garamond"'), document.fonts.load('500 26px Inter')]); } catch (e) {}

    const W = 1080, H = 1560, cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#0D0A12'; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W / 2, 0, 0, W / 2, 0, W);
    glow.addColorStop(0, 'rgba(183,156,224,.16)'); glow.addColorStop(1, 'rgba(183,156,224,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, H);
    const bh = 1060, bw = bh * (540 / 700);
    g.drawImage(img, (W - bw) / 2, 50, bw, bh);
    g.textAlign = 'center';
    g.fillStyle = '#A196B3'; g.font = '500 26px Inter, sans-serif';
    g.fillText(('Para ' + HER_NAME).toUpperCase().split('').join(String.fromCharCode(8202)), W / 2, 1200);
    g.fillStyle = '#F4EFF8'; g.font = 'italic 500 66px "Cormorant Garamond", Georgia, serif';
    g.fillText('Feliz Día de las', W / 2, 1290);
    g.fillStyle = '#F2C94C';
    g.fillText('Flores Amarillas', W / 2, 1366);
    g.fillStyle = '#A196B3'; g.font = '500 22px Inter, sans-serif';
    g.fillText('21 DE SEPTIEMBRE', W / 2, 1470);
    return new Promise((res) => cv.toBlob(res, 'image/png'));
  }
  const say = (t) => { $('saveMsg').textContent = t; };
  const fileName = 'ramo-flores-amarillas.png';

  $('saveImg').addEventListener('click', async () => {
    say('Preparando tu imagen…');
    try {
      const blob = await bouquetBlob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = fileName;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      say('Listo: tu ramo se guardó como imagen.');
    } catch (e) { say('No se pudo crear la imagen. Prueba con una captura de pantalla.'); }
  });
  try {
    const probe = new File([''], fileName, { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [probe] })) $('shareImg').hidden = false;
  } catch (e) {}
  $('shareImg').addEventListener('click', async () => {
    say('Preparando tu imagen…');
    try {
      const blob = await bouquetBlob();
      await navigator.share({ files: [new File([blob], fileName, { type: 'image/png' })], title: 'Mi ramo de flores amarillas' });
      say('Compartido.');
    } catch (e) { say(e && e.name === 'AbortError' ? 'Compartir cancelado.' : 'No se pudo compartir. Usa “Guardar imagen”.'); }
  });

  /* ---------- Favoritos: solo una tarjeta volteada a la vez ---------- */
  $('favGrid').innerHTML = FAVORITES.map((f, i) =>
    '<div class="flip" role="button" tabindex="0" aria-pressed="false"><div class="flip-inner">' +
    '<div class="face front"><span class="num">' + pad(i) + '</span><b>' + esc(f.title) + '</b></div>' +
    '<div class="face back-face"><span>' + esc(f.back) + '</span>' +
    (f.link ? '<a href="' + esc(f.link) + '" target="_blank" rel="noopener">Escuchar ↗</a>' : '') + '</div></div></div>'
  ).join('');
  const cards = Array.from(document.querySelectorAll('.flip'));
  const setOpen = (card, open) => { card.classList.toggle('open', open); card.setAttribute('aria-pressed', open); };
  cards.forEach((card) => {
    const toggle = () => {
      const willOpen = !card.classList.contains('open');
      cards.forEach((c) => { if (c !== card) setOpen(c, false); });
      setOpen(card, willOpen);
      buzz(8);
    };
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) toggle(); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ---------- Música (YouTube se carga solo al entrar) ---------- */
  function loadMusic() {
    if (typeof PLAYLIST_ID === 'undefined' || !PLAYLIST_ID) return;
    const fr = $('ytFrame');
    if (!fr.src) fr.src = 'https://www.youtube.com/embed/videoseries?list=' + encodeURIComponent(PLAYLIST_ID);
    $('ytLink').href = 'https://www.youtube.com/playlist?list=' + encodeURIComponent(PLAYLIST_ID);
  }

  /* ---------- Carta (se redibuja para reiniciar la animación) ---------- */
  // Próximo aniversario a partir de TOGETHER_SINCE ('AAAA-MM-DD')
  function nextAnniversary() {
    const p = TOGETHER_SINCE.split('-').map(Number);
    const now = new Date(), today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    let n = now.getFullYear() - p[0];
    if (Date.UTC(p[0] + n, p[1] - 1, p[2]) < today) n++;
    if (n < 1) return null;
    return { years: n, days: Math.round((Date.UTC(p[0] + n, p[1] - 1, p[2]) - today) / 86400000) };
  }
  function renderLetter() {
    let html = '<h2 class="to">Para ' + esc(HER_NAME) + ',</h2>';
    LETTER.forEach((t, i) => { html += '<p class="line" style="animation-delay:' + (0.4 + i * 1.1) + 's">' + esc(t) + '</p>'; });
    html += '<div class="sign" style="animation-delay:' + (0.4 + LETTER.length * 1.1) + 's">Con todo mi cariño,<br>' + esc(MY_NAME) + '</div>';
    $('paper').innerHTML = html;
    if (TOGETHER_SINCE) {
      const days = Math.floor((Date.now() - new Date(TOGETHER_SINCE + 'T00:00:00').getTime()) / 86400000);
      const nx = nextAnniversary();
      const yrs = nx ? nx.years + (nx.years === 1 ? ' año' : ' años') : '';
      const soon = !nx ? '' : nx.days === 0 ? 'Hoy cumplimos <em>' + yrs + '</em> juntos'
        : nx.days === 1 ? 'Mañana cumplimos <em>' + yrs + '</em> juntos'
        : 'Faltan <em>' + nx.days + ' días</em> para cumplir ' + yrs + ' juntos';
      $('counter').innerHTML = '<span class="days">' + days + '</span><p class="label">días juntos y contando</p>' + (soon ? '<p class="next">' + soon + '</p>' : '');
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

  /* ---------- Menú y navegación por hash ---------- */
  const FA = window.FA = {
    $, esc, buzz, pick, pad, flowerInner, flowerSVG,
    hooks: { letter: renderLetter, ramo: renderBouquet, music: loadMusic },
    menu: [
      { id: 'bouquet', order: 10, title: 'Nuestro ramo', text: 'Toca y siembra flores' },
      { id: 'favorites', order: 20, title: 'Todo lo que te gusta', text: 'Voltea cada tarjeta' },
      ...(typeof PLAYLIST_ID !== 'undefined' && PLAYLIST_ID ? [{ id: 'music', order: 45, title: 'Nuestra playlist', text: 'Música para escuchar juntos' }] : []),
      { id: 'letter', order: 50, title: 'Una carta para ti', text: 'Léela con calma' },
      { id: 'coupons', order: 60, title: 'Vales de regalo', text: 'Canjéalos cuando quieras' },
      { id: 'wish', order: 70, title: 'Pide un deseo', text: 'Toca la estrella' },
    ],
  };

  function renderMenu() {
    $('menu').innerHTML = FA.menu.slice().sort((a, b) => a.order - b.order).map((m, i) =>
      '<a href="#' + m.id + '"><span class="num">' + pad(i) + '</span><span class="txt"><b>' + esc(m.title) + '</b><small>' + esc(m.text) +
      '</small></span><span class="arr" aria-hidden="true">→</span></a>'
    ).join('');
  }

  function route() {
    let id = location.hash.slice(1);
    const sec = id && document.getElementById(id);
    if (!sec || !sec.classList.contains('screen')) id = 'intro';
    if (id === 'ramo' && !placed.length) { location.hash = '#bouquet'; return; }
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    if (FA.hooks[id]) FA.hooks[id]();
    window.scrollTo(0, 0);
  }

  FA.start = function () {
    renderMenu();
    window.addEventListener('hashchange', route);
    route();
  };
})();
