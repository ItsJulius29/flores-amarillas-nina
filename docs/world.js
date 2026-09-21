(function () {
  'use strict';
  const { $, esc, buzz, pick, flowerInner, flowerSVG } = FA;
  FA.menu.push({ id: 'world', order: 40, title: 'Nuestro mundito', text: 'Juega con nosotros' });

  const EDITOR = /[?&]editor/.test(location.search); // con ?editor la página no guarda nada local y muestra "Copiar"
  const KEY = 'mundito-v1';
  const OPT = {
    skin: ['#FBE3CF', '#F3CBA6', '#E2A97E', '#D9A074', '#C98A5C', '#A56A43', '#7A4A2E'],
    hair: ['#1B1420', '#3B2418', '#6B4226', '#C98F4B', '#E8C36A', '#A8452C', '#B79CE0'],
    outfit: ['#B79CE0', '#F2C94C', '#1B1420', '#E9DBFB', '#7A4BC4', '#F4EFF8', '#EFE4D3'],
    pants: ['#1B1420', '#2A1B3D', '#8FB0D4', '#4A6FA5', '#5A3A2E', '#C9B99A'],
    style: [['curls', 'Rizado'], ['long', 'Largo'], ['short', 'Corto'], ['quiff', 'Voluminoso'], ['bun', 'Chongo'], ['tails', 'Colitas']],
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const nameOf = (k) => (k === 'her' ? HER_NAME : MY_NAME);

  // Lo que se personaliza en la página se guarda en el dispositivo, pero solo
  // mientras CHARACTERS (content.js) no cambie: si lo editas, manda content.js.
  const BASE = JSON.stringify(CHARACTERS);
  let cfg = clone(CHARACTERS);
  if (!EDITOR) {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.base === BASE) { cfg.her = Object.assign(cfg.her, s.cfg.her); cfg.him = Object.assign(cfg.him, s.cfg.him); }
    } catch (e) {}
  }
  const save = () => { if (!EDITOR) { try { localStorage.setItem(KEY, JSON.stringify({ base: BASE, cfg: cfg })); } catch (e) {} } };

  /* ---------- Muñequito (SVG) ---------- */
  const bumps = (list, c) => list.map((b) => '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + c + '"/>').join('');
  function hairBack(style, c) {
    if (style === 'curls') return bumps([[22, 46, 17], [13, 70, 16], [17, 94, 16], [25, 116, 15], [98, 46, 17], [107, 70, 16], [103, 94, 16], [95, 116, 15], [32, 18, 16], [52, 9, 17], [72, 9, 17], [91, 19, 16]], c);
    if (style === 'long') return '<path d="M22 58 Q20 8 60 8 Q100 8 98 58 L104 128 Q60 140 16 128Z" fill="' + c + '"/>';
    if (style === 'tails') return '<ellipse cx="16" cy="88" rx="13" ry="25" fill="' + c + '" transform="rotate(12 16 88)"/><ellipse cx="104" cy="88" rx="13" ry="25" fill="' + c + '" transform="rotate(-12 104 88)"/>';
    return '';
  }
  function hairFront(style, c) {
    const cap = '<path d="M24 58 Q16 6 60 6 Q104 6 96 58 Q88 32 60 34 Q32 32 24 58Z" fill="' + c + '"/>';
    if (style === 'curls') return '<path d="M22 60 Q14 8 60 6 Q106 8 98 60 Q92 40 76 34 Q68 30 60 40 Q52 30 44 34 Q28 40 22 60Z" fill="' + c + '"/>' + bumps([[30, 42, 11], [90, 42, 11], [26, 58, 8], [94, 58, 8], [44, 28, 9], [76, 28, 9]], c);
    if (style === 'quiff') return '<ellipse cx="64" cy="13" rx="30" ry="14" fill="' + c + '"/>' + cap;
    if (style === 'long') return '<path d="M23 66 Q16 6 60 6 Q104 6 97 66 Q95 42 80 34 Q60 46 40 34 Q25 42 23 66Z" fill="' + c + '"/>';
    if (style === 'bun') return '<circle cx="60" cy="4" r="15" fill="' + c + '"/>' + cap;
    return cap;
  }
  function charSVG(c) {
    const ink = '#24172F';
    return '<svg viewBox="0 0 120 170" role="img" aria-hidden="true">' +
      '<ellipse cx="60" cy="163" rx="34" ry="5" fill="#000" opacity=".22"/>' +
      '<rect x="41" y="136" width="15" height="22" rx="6" fill="' + (c.pants || '#2A1B3D') + '"/><rect x="64" y="136" width="15" height="22" rx="6" fill="' + (c.pants || '#2A1B3D') + '"/>' +
      '<ellipse cx="47" cy="159" rx="12" ry="6" fill="#EDE7F6"/><ellipse cx="73" cy="159" rx="12" ry="6" fill="#EDE7F6"/>' +
      hairBack(c.style, c.hair) +
      '<g class="arm arm-l"><path d="M36 100 Q22 108 22 128 Q22 137 29 137 Q36 137 37 128 L42 104Z" fill="' + c.outfit + '"/><circle cx="29" cy="137" r="6.5" fill="' + c.skin + '"/></g>' +
      '<g class="arm arm-r"><path d="M84 100 Q98 108 98 128 Q98 137 91 137 Q84 137 83 128 L78 104Z" fill="' + c.outfit + '"/><circle cx="91" cy="137" r="6.5" fill="' + c.skin + '"/></g>' +
      '<path d="M32 102 Q32 90 46 90 L74 90 Q88 90 88 102 L92 142 Q60 150 28 142Z" fill="' + c.outfit + '"/>' +
      '<path d="M44 124 Q60 133 76 124" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="60" cy="56" r="36" fill="' + c.skin + '"/>' +
      hairFront(c.style, c.hair) +
      (c.cap ? '<path d="M21 46 Q18 2 60 2 Q102 2 99 46 Q60 30 21 46Z" fill="#D8C6A3"/><path d="M60 3 Q54 22 50 36 M60 3 Q66 22 70 36" fill="none" stroke="#BFAE8A" stroke-width="1.6"/><circle cx="60" cy="3" r="3" fill="#BFAE8A"/>' : '') +
      (c.freckles ? '<g fill="#8A4F2E" opacity=".5">' + [[45, 67], [49.5, 69.5], [44, 71.8], [75, 67], [70.5, 69.5], [76, 71.8], [57, 68], [60, 66.3], [63, 68]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.2"/>').join('') + '</g>' : '') +
      (c.earrings ? '<g fill="none" stroke="#F2C94C" stroke-width="2"><circle cx="26" cy="78" r="4.6"/><circle cx="94" cy="78" r="4.6"/></g>' : '') +
      '<g fill="none" stroke="' + c.hair + '" stroke-width="2.8" stroke-linecap="round"><path d="M41 51 Q47 47.5 53 50"/><path d="M67 50 Q73 47.5 79 51"/></g>' +
      '<circle cx="38" cy="71" r="5.6" fill="#F29BB0" opacity=".42"/><circle cx="82" cy="71" r="5.6" fill="#F29BB0" opacity=".42"/>' +
      '<g class="eyes"><ellipse cx="47" cy="61" rx="3.4" ry="4.4" fill="' + ink + '"/><ellipse cx="73" cy="61" rx="3.4" ry="4.4" fill="' + ink + '"/>' +
      '<circle cx="45.9" cy="59.4" r="1.2" fill="#fff"/><circle cx="71.9" cy="59.4" r="1.2" fill="#fff"/></g>' +
      '<g class="eyes-happy"><path d="M42 62 Q47 55 52 62" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round"/><path d="M68 62 Q73 55 78 62" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '<path class="mouth" d="M53 75 Q60 81 67 75" fill="none" stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path class="mouth-happy" d="M51 73 Q60 89 69 73Z" fill="#8A3344" stroke="' + ink + '" stroke-width="2" stroke-linejoin="round"/>' +
      (c.glasses ? '<g fill="rgba(255,255,255,.10)" stroke="' + ink + '" stroke-width="2.2"><circle cx="47" cy="61" r="11"/><circle cx="73" cy="61" r="11"/><path d="M58 60 L62 60" fill="none"/></g>' : '') +
      (c.flower ? '<g transform="translate(74 4) scale(.34)">' + flowerInner('yellow') + '</g>' : '') +
      '</svg>';
  }

  /* ---------- Objetos ---------- */
  const PROPS = {
    flower: { label: 'Flor amarilla', svg: () => flowerSVG('yellow') },
    rose: { label: 'Rosa blanca', svg: () => flowerSVG('rose') },
    lilac: { label: 'Flor lila', svg: () => flowerSVG('lilac') },
    ball: {
      label: 'Balón de vóley',
      svg: () => '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#F4EFF8" stroke="#CDB7EC" stroke-width="3"/>' +
        [0, 120, 240].map((r) => '<path d="M50 5 C22 30 22 70 50 95" fill="none" stroke="#F2C94C" stroke-width="5" stroke-linecap="round" transform="rotate(' + r + ' 50 50)"/>').join('') +
        '<circle cx="50" cy="50" r="46" fill="none" stroke="#B79CE0" stroke-width="2" opacity=".6"/></svg>',
    },
    cake: {
      label: 'Mil hojas',
      svg: () => '<svg viewBox="0 0 100 100"><rect x="10" y="70" width="80" height="12" rx="4" fill="#E3B76F"/><rect x="10" y="62" width="80" height="9" fill="#FFF3D1"/>' +
        '<rect x="10" y="53" width="80" height="10" fill="#E3B76F"/><rect x="10" y="46" width="80" height="8" fill="#FFF3D1"/><rect x="10" y="37" width="80" height="10" fill="#E3B76F"/>' +
        '<rect x="10" y="27" width="80" height="11" rx="5" fill="#F7F2FA"/><path d="M22 38 v8 M40 38 v6 M58 38 v9 M76 38 v6" stroke="#CDB7EC" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M50 30 C36 30 34 14 41 9 Q50 5 59 9 C66 14 64 30 50 30Z" fill="#E14B62"/><path d="M44 10 L50 4 L56 10 L50 12Z" fill="#5F8F63"/>' +
        '<g fill="#FFD8A0"><circle cx="44" cy="17" r="1.1"/><circle cx="52" cy="15" r="1.1"/><circle cx="48" cy="23" r="1.1"/><circle cx="56" cy="21" r="1.1"/></g></svg>',
    },
    bear: {
      label: 'Osito',
      svg: () => '<svg viewBox="0 0 100 100"><circle cx="24" cy="26" r="15" fill="#8B5E3C"/><circle cx="76" cy="26" r="15" fill="#8B5E3C"/><circle cx="24" cy="26" r="7" fill="#C99A72"/><circle cx="76" cy="26" r="7" fill="#C99A72"/>' +
        '<circle cx="50" cy="52" r="36" fill="#A67449"/><ellipse cx="50" cy="64" rx="15" ry="12" fill="#E8CDA6"/><ellipse cx="50" cy="58" rx="5.5" ry="4" fill="#24172F"/>' +
        '<circle cx="36" cy="46" r="3.6" fill="#24172F"/><circle cx="64" cy="46" r="3.6" fill="#24172F"/><path d="M44 68 Q50 73 56 68" fill="none" stroke="#24172F" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M50 90 L34 82 L34 98Z M50 90 L66 82 L66 98Z" fill="#B79CE0"/><circle cx="50" cy="90" r="5" fill="#CDB7EC"/></svg>',
    },
    bunny: {
      label: 'Conejito',
      svg: () => '<svg viewBox="0 0 100 100"><ellipse cx="35" cy="26" rx="9" ry="24" fill="#F4EFF8"/><ellipse cx="65" cy="26" rx="9" ry="24" fill="#F4EFF8"/>' +
        '<ellipse cx="35" cy="28" rx="4.5" ry="15" fill="#F2B6C6"/><ellipse cx="65" cy="28" rx="4.5" ry="15" fill="#F2B6C6"/>' +
        '<circle cx="50" cy="64" r="30" fill="#F4EFF8"/><circle cx="40" cy="60" r="3.2" fill="#24172F"/><circle cx="60" cy="60" r="3.2" fill="#24172F"/>' +
        '<circle cx="32" cy="70" r="4.5" fill="#F29BB0" opacity=".45"/><circle cx="68" cy="70" r="4.5" fill="#F29BB0" opacity=".45"/>' +
        '<ellipse cx="50" cy="67" rx="3.6" ry="2.6" fill="#F29BB0"/><path d="M44 73 Q50 79 56 73" fill="none" stroke="#24172F" stroke-width="2" stroke-linecap="round"/></svg>',
    },
    snowman: {
      label: 'Muñeco de nieve',
      svg: () => '<svg viewBox="0 0 100 100"><circle cx="50" cy="73" r="25" fill="#F4EFF8" stroke="#B7A6D6" stroke-width="2"/><circle cx="50" cy="35" r="19" fill="#F4EFF8" stroke="#B7A6D6" stroke-width="2"/>' +
        '<circle cx="43" cy="31" r="2.6" fill="#24172F"/><circle cx="57" cy="31" r="2.6" fill="#24172F"/><path d="M50 37 L67 41 L50 45Z" fill="#F29B4B"/>' +
        '<path d="M32 52 Q50 62 68 52 L68 60 Q50 70 32 60Z" fill="#B79CE0"/><g fill="#24172F"><circle cx="50" cy="74" r="2.4"/><circle cx="50" cy="84" r="2.4"/></g></svg>',
    },
    moon: { label: 'Luna', svg: () => '<svg viewBox="0 0 100 100"><path d="M64 8 A42 42 0 1 0 92 68 A34 34 0 1 1 64 8Z" fill="#F2C94C"/><g fill="#F2C94C"><circle cx="78" cy="30" r="2.4"/><circle cx="86" cy="46" r="1.8"/></g></svg>' },
    phones: {
      label: 'Audífonos',
      svg: () => '<svg viewBox="0 0 100 100"><path d="M20 62 C20 14 80 14 80 62" fill="none" stroke="#B79CE0" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="10" y="56" width="17" height="28" rx="7" fill="#7A4BC4"/><rect x="73" y="56" width="17" height="28" rx="7" fill="#7A4BC4"/>' +
        '<rect x="14" y="62" width="9" height="16" rx="4" fill="#CDB7EC"/><rect x="77" y="62" width="9" height="16" rx="4" fill="#CDB7EC"/></svg>',
    },
    mug: {
      label: 'Chocolate caliente',
      svg: () => '<svg viewBox="0 0 100 100"><path d="M66 50 q18 0 18 15 q0 15 -18 15" fill="none" stroke="#F4EFF8" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="20" y="40" width="50" height="46" rx="10" fill="#F4EFF8"/><ellipse cx="45" cy="42" rx="25" ry="6" fill="#6B3A24"/>' +
        '<path d="M34 28 q-5 -7 0 -13 M46 28 q-5 -7 0 -13 M58 28 q-5 -7 0 -13" fill="none" stroke="#E9DBFB" stroke-width="3" stroke-linecap="round" opacity=".75"/>' +
        '<path d="M45 72 C36 66 33 61 39 58 C42 56 45 59 45 60 C45 59 48 56 51 58 C57 61 54 66 45 72Z" fill="#B79CE0"/></svg>',
    },
    butterfly: {
      label: 'Mariposa',
      svg: () => {
        const wing = '<path d="M50 48 C30 8 4 22 12 46 C16 58 40 56 50 48Z" fill="#B79CE0"/><path d="M50 52 C34 54 20 78 32 88 C46 94 52 68 50 52Z" fill="#CDB7EC"/><circle cx="26" cy="38" r="5" fill="#F2C94C" opacity=".85"/>';
        return '<svg viewBox="0 0 100 100">' + wing + '<g transform="translate(100 0) scale(-1 1)">' + wing + '</g><ellipse cx="50" cy="56" rx="3.6" ry="20" fill="#24172F"/>' +
          '<path d="M48 38 Q42 24 36 22 M52 38 Q58 24 64 22" fill="none" stroke="#24172F" stroke-width="2" stroke-linecap="round"/></svg>';
      },
    },
    net: {
      label: 'Red de vóley',
      svg: () => {
        let g = '';
        for (let x = 20; x <= 80; x += 10) g += '<path d="M' + x + ' 30 V62"/>';
        for (let y = 38; y <= 60; y += 8) g += '<path d="M15 ' + y + ' H85"/>';
        return '<svg viewBox="0 0 100 100"><rect x="9" y="18" width="5" height="72" rx="2" fill="#CDB7EC"/><rect x="86" y="18" width="5" height="72" rx="2" fill="#CDB7EC"/>' +
          '<g stroke="#F4EFF8" stroke-width="1.4" opacity=".8">' + g + '</g><rect x="14" y="26" width="72" height="5" rx="2" fill="#F4EFF8"/><rect x="14" y="62" width="72" height="3" rx="1.5" fill="#F4EFF8"/></svg>';
      },
    },
    heart: { label: 'Corazón', svg: () => '<svg viewBox="0 0 24 24"><path d="M12 21 C5 15 2 11 2 7.5 A5 5 0 0 1 12 6 A5 5 0 0 1 22 7.5 C22 11 19 15 12 21Z" fill="#B79CE0"/></svg>' },
    star: { label: 'Estrella', svg: () => '<svg viewBox="0 0 100 100"><path d="M50 4 C53 34 66 47 96 50 C66 53 53 66 50 96 C47 66 34 53 4 50 C34 47 47 34 50 4Z" fill="#F2C94C"/></svg>' },
  };

  /* ---------- Escenario ---------- */
  const stage = $('stage');
  const SCENES = [['winter', 'Invierno'], ['dusk', 'Atardecer'], ['garden', 'Jardín']];
  const chars = {};
  let z = 10, selected = null, inited = false, lastHug = 0, drag = null;

  function setPos(el, cx, cy) {
    const r = stage.getBoundingClientRect();
    el.style.left = (cx / r.width) * 100 + '%';
    el.style.top = (cy / r.height) * 100 + '%';
  }
  function heartsAt(x, y) {
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('span');
      h.className = 'fx-heart';
      h.style.cssText = 'left:' + (x + (Math.random() - 0.5) * 50) + 'px;top:' + y + 'px;--dx:' + Math.round((Math.random() - 0.5) * 60) + 'px;animation-delay:' + i * 90 + 'ms;--s:' + (0.7 + Math.random() * 0.7);
      h.innerHTML = PROPS.heart.svg().replace('#B79CE0', i % 2 ? '#F2C94C' : '#B79CE0');
      h.addEventListener('animationend', () => h.remove());
      stage.appendChild(h);
    }
  }
  function happy(el) {
    el.classList.add('happy');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('happy'), 1900);
  }
  function center(el) {
    const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top };
  }
  function poke(el) {
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump');
    happy(el);
    const c = center(el);
    heartsAt(c.x, c.y - el.offsetHeight / 2);
    buzz(12);
  }
  function checkHug() {
    const a = chars.her, b = chars.him, ca = center(a), cb = center(b);
    const close = Math.hypot(ca.x - cb.x, ca.y - cb.y) < Math.min(a.offsetWidth, b.offsetWidth) * 0.9;
    if (close && Date.now() - lastHug > 3500) {
      lastHug = Date.now();
      happy(a); happy(b);
      heartsAt((ca.x + cb.x) / 2, Math.min(ca.y, cb.y) - 40);
      buzz([20, 40, 20]);
    }
  }
  function select(el) {
    if (selected) selected.classList.remove('sel');
    selected = el && el.dataset.kind === 'prop' ? el : null;
    if (selected) selected.classList.add('sel');
    $('removeProp').disabled = !selected;
  }

  function makeActor(kind, id, xPct, yPct) {
    const el = document.createElement('div');
    el.className = 'actor ' + (kind === 'char' ? 'char' : 'prop');
    el.dataset.kind = kind; el.dataset.id = id;
    el.style.left = xPct + '%'; el.style.top = yPct + '%';
    el.style.zIndex = ++z;
    if (kind === 'char') {
      el.innerHTML = '<div class="fig">' + charSVG(cfg[id]) + '</div><span class="tag">' + esc(nameOf(id)) + '</span>';
      chars[id] = el;
    } else {
      el.innerHTML = '<div class="fig">' + PROPS[id].svg() + '</div>';
    }
    stage.appendChild(el);
    return el;
  }
  function placeChars() {
    if (chars.her) { chars.her.style.left = '32%'; chars.her.style.top = '64%'; }
    if (chars.him) { chars.him.style.left = '68%'; chars.him.style.top = '64%'; }
  }

  function setScene(id) {
    stage.dataset.scene = id;
    $('sceneChips').innerHTML = SCENES.map((s) => '<button class="chip" data-s="' + s[0] + '" aria-pressed="' + (s[0] === id) + '">' + s[1] + '</button>').join('');
    let deco = stage.querySelector('.deco');
    if (deco) deco.remove();
    deco = document.createElement('div');
    deco.className = 'deco';
    const r = stage.getBoundingClientRect();
    let html = '';
    if (id === 'winter') {
      for (let i = 0; i < 26; i++) {
        html += '<i class="flake" style="left:' + Math.random() * 100 + '%;width:' + (2 + Math.random() * 3) + 'px;height:' + (2 + Math.random() * 3) + 'px;--sw:' + Math.round((Math.random() - 0.5) * 40) + 'px;animation-duration:' + (8 + Math.random() * 8) + 's;animation-delay:-' + Math.random() * 14 + 's"></i>';
      }
      deco.style.setProperty('--drop', Math.round(r.height) + 'px');
    }
    if (id === 'garden') {
      for (let i = 0; i < 22; i++) {
        const w = 20 + Math.random() * 16;
        html += '<span class="gf" style="left:' + Math.random() * 96 + '%;bottom:' + (1 + Math.random() * 20) + '%;width:' + w + 'px;height:' + w + 'px;transform:rotate(' + Math.floor(Math.random() * 360) + 'deg)">' + flowerSVG(pick(['yellow', 'yellow', 'lilac', 'rose'])) + '</span>';
      }
    }
    deco.innerHTML = html;
    stage.insertBefore(deco, stage.firstChild);
  }
  $('sceneChips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) setScene(b.dataset.s); });

  /* ---------- Arrastrar ---------- */
  stage.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.actor');
    if (!el) { select(null); return; }
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    const c = center(el), s = stage.getBoundingClientRect();
    drag = { el, ox: e.clientX - s.left - c.x, oy: e.clientY - s.top - c.y, sx: e.clientX, sy: e.clientY, lx: e.clientX, moved: false };
    el.style.zIndex = ++z;
    el.classList.add('drag');
    select(el);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const s = stage.getBoundingClientRect(), el = drag.el;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
    const hw = el.offsetWidth / 2, hh = el.offsetHeight / 2;
    const cx = Math.min(s.width - hw, Math.max(hw, e.clientX - s.left - drag.ox));
    const cy = Math.min(s.height - hh, Math.max(hh, e.clientY - s.top - drag.oy));
    setPos(el, cx, cy);
    el.style.setProperty('--tilt', Math.max(-9, Math.min(9, (e.clientX - drag.lx) * 1.4)) + 'deg');
    drag.lx = e.clientX;
    if (el.dataset.kind === 'char') checkHug();
  });
  function endDrag() {
    if (!drag) return;
    const el = drag.el;
    el.classList.remove('drag');
    el.style.setProperty('--tilt', '0deg');
    if (!drag.moved) {
      if (el.dataset.kind === 'char') poke(el);
      else { el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle'); }
    }
    drag = null;
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  /* ---------- Bandeja y botones ---------- */
  $('tray').innerHTML = Object.keys(PROPS).map((k) =>
    '<button class="prop-btn" data-p="' + k + '" aria-label="Agregar ' + esc(PROPS[k].label) + '" title="' + esc(PROPS[k].label) + '">' + PROPS[k].svg() + '</button>').join('');
  $('tray').addEventListener('click', (e) => {
    const b = e.target.closest('.prop-btn');
    if (!b) return;
    const el = makeActor('prop', b.dataset.p, 40 + Math.random() * 20, 30 + Math.random() * 25);
    el.classList.add('drop');
    select(el);
    buzz(8);
  });
  $('removeProp').addEventListener('click', () => {
    if (!selected) return;
    const el = selected; select(null);
    el.classList.add('gone');
    setTimeout(() => el.remove(), 250);
  });
  $('resetWorld').addEventListener('click', () => {
    stage.querySelectorAll('.actor.prop').forEach((p) => p.remove());
    select(null); placeChars();
  });

  /* ---------- Guardar la escena como imagen ---------- */
  const svgToImage = (svgEl, vb, pxW, pxH) => new Promise((res, rej) => {
    const s = svgEl.cloneNode(true);
    s.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    s.setAttribute('viewBox', vb); s.setAttribute('width', pxW); s.setAttribute('height', pxH);
    const img = new Image();
    img.onload = () => res(img); img.onerror = rej;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(s));
  });
  const curvedTop = (g, x, top, w, h, r) => { // suelo con esquinas superiores elípticas, como en pantalla
    g.beginPath(); g.moveTo(x, top + r);
    g.ellipse(x + w / 4, top + r, w / 4, r, 0, Math.PI, 1.5 * Math.PI);
    g.ellipse(x + (3 * w) / 4, top + r, w / 4, r, 0, 1.5 * Math.PI, 2 * Math.PI);
    g.lineTo(x + w, top + h); g.lineTo(x, top + h); g.closePath(); g.fill();
  };

  async function sceneBlob() {
    const sr = stage.getBoundingClientRect(), SW = sr.width, SH = sr.height;
    const scene = stage.dataset.scene, M = 60, W = 1080, k = (W - 2 * M) / SW, sh = SH * k, H = Math.round(M + sh + 260);
    // cargar todas las imágenes antes de dibujar
    const actors = Array.from(stage.querySelectorAll('.actor')).sort((a, b) => a.style.zIndex - b.style.zIndex);
    const items = await Promise.all(actors.map(async (el) => {
      const svg = el.querySelector('.fig svg'), isChar = el.dataset.kind === 'char';
      if (isChar) {
        const happy = el.classList.contains('happy'), s = svg.cloneNode(true);
        s.querySelectorAll(happy ? '.eyes, .mouth' : '.eyes-happy, .mouth-happy').forEach((n) => n.setAttribute('style', 'display:none'));
        return { el, isChar, img: await svgToImage(s, '-10 -20 140 200', 560, 800) };
      }
      return { el, isChar, img: await svgToImage(svg, svg.getAttribute('viewBox'), 400, 400) };
    }));
    const gardens = scene === 'garden' ? await Promise.all(Array.from(stage.querySelectorAll('.gf')).map(async (gf) => ({
      gf, img: await svgToImage(gf.querySelector('svg'), '0 0 100 100', 200, 200),
    }))) : [];
    try { await Promise.all([document.fonts.load('italic 500 60px "Cormorant Garamond"'), document.fonts.load('500 24px Inter')]); } catch (e) {}

    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#0D0A12'; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W / 2, 0, 0, W / 2, 0, W);
    glow.addColorStop(0, 'rgba(183,156,224,.16)'); glow.addColorStop(1, 'rgba(183,156,224,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, H);

    g.save();
    g.beginPath(); g.roundRect ? g.roundRect(M, M, W - 2 * M, sh, 40) : g.rect(M, M, W - 2 * M, sh); g.clip();
    g.translate(M, M); g.scale(k, k);
    const top = SH * 0.73, gh = SH - top, bg = g.createLinearGradient(0, 0, 0, SH);
    if (scene === 'winter') { bg.addColorStop(0, '#0F0B18'); bg.addColorStop(1, '#2A1A45'); }
    else if (scene === 'dusk') { bg.addColorStop(0, '#2A1245'); bg.addColorStop(0.52, '#7A4BC4'); bg.addColorStop(0.73, '#F2C94C'); bg.addColorStop(1, '#F2C94C'); }
    else { bg.addColorStop(0, '#150F1E'); bg.addColorStop(1, '#2F2140'); }
    g.fillStyle = bg; g.fillRect(0, 0, SW, SH);
    if (scene === 'winter') {
      g.fillStyle = 'rgba(255,255,255,.7)';
      for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(((i * 137) % 100) / 100 * SW, ((i * 61) % 72) / 100 * SH, 1 + (i % 3) * 0.7, 0, 7); g.fill(); }
      g.fillStyle = '#DCD3EB'; curvedTop(g, 0, top, SW, gh, 14);
    } else if (scene === 'dusk') { g.fillStyle = '#1A0B2E'; g.fillRect(0, top, SW, gh); }
    else { g.fillStyle = '#34503A'; curvedTop(g, 0, top, SW, gh, 12); }
    gardens.forEach(({ gf, img }) => {
      const w = parseFloat(gf.style.width), cx = parseFloat(gf.style.left) / 100 * SW + w / 2, cy = SH - parseFloat(gf.style.bottom) / 100 * SH - w / 2;
      const rot = parseFloat((gf.style.transform.match(/rotate\(([-\d.]+)deg/) || [0, 0])[1]) * Math.PI / 180;
      g.save(); g.translate(cx, cy); g.rotate(rot); g.drawImage(img, -w / 2, -w / 2, w, w); g.restore();
    });
    items.forEach(({ el, isChar, img }) => {
      const w = el.offsetWidth, h = el.offsetHeight, cx = parseFloat(el.style.left) / 100 * SW, cy = parseFloat(el.style.top) / 100 * SH;
      if (isChar) {
        g.drawImage(img, cx - w / 2 - 10 * (w / 120), cy - h / 2 - 20 * (h / 170), w * 140 / 120, h * 200 / 170);
        g.textAlign = 'center'; g.font = '500 ' + 10 + 'px Inter, sans-serif';
        g.fillStyle = scene === 'winter' ? '#24172F' : '#F4EFF8';
        if (scene !== 'winter') { g.shadowColor = 'rgba(13,10,18,.95)'; g.shadowBlur = 6; }
        g.fillText(nameOf(el.dataset.id).toUpperCase().split('').join(String.fromCharCode(8202, 8202)), cx, cy + h / 2 + 14);
        g.shadowColor = 'transparent'; g.shadowBlur = 0;
      } else g.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    });
    g.restore();
    g.strokeStyle = 'rgba(244,239,248,.14)'; g.lineWidth = 2;
    g.beginPath(); g.roundRect ? g.roundRect(M, M, W - 2 * M, sh, 40) : g.rect(M, M, W - 2 * M, sh); g.stroke();

    g.textAlign = 'center';
    g.fillStyle = '#F4EFF8'; g.font = 'italic 500 70px "Cormorant Garamond", Georgia, serif';
    g.fillText(HER_NAME + ' y ' + MY_NAME, W / 2, M + sh + 110);
    g.fillStyle = '#A196B3'; g.font = '500 22px Inter, sans-serif';
    g.fillText('FELIZ DÍA DE LAS FLORES AMARILLAS'.split('').join(String.fromCharCode(8202)), W / 2, M + sh + 170);
    return new Promise((res) => cv.toBlob(res, 'image/png'));
  }
  const busy = (btn, txt, fn) => async () => {
    const old = btn.textContent; btn.disabled = true; btn.textContent = txt;
    try { await fn(); } catch (e) { if (!e || e.name !== 'AbortError') btn.textContent = 'No se pudo'; else btn.textContent = old; setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1600); return; }
    btn.textContent = old; btn.disabled = false;
  };
  $('saveWorld').addEventListener('click', busy($('saveWorld'), 'Guardando…', async () => { FA.download(await sceneBlob(), 'nuestro-mundito.png'); }));
  if (FA.canShareFiles()) $('shareWorld').hidden = false;
  $('shareWorld').addEventListener('click', busy($('shareWorld'), 'Preparando…', async () => { await FA.shareBlob(await sceneBlob(), 'nuestro-mundito.png', 'Nuestro mundito'); }));

  /* ---------- Personalizar ---------- */
  const sheet = $('sheet');
  let who = 'her';
  const swatches = (k, list) => list.map((v) => '<button class="sw" data-k="' + k + '" data-v="' + v + '" style="--c:' + v + '" aria-pressed="' + (cfg[who][k] === v) + '" aria-label="' + k + ' ' + v + '"></button>').join('');
  const row = (label, inner) => '<div class="ed-row"><span class="label">' + label + '</span><div class="ed-opts">' + inner + '</div></div>';

  function renderSheet() {
    const c = cfg[who];
    $('whoChips').innerHTML = ['her', 'him'].map((k) => '<button class="chip" data-who="' + k + '" aria-pressed="' + (k === who) + '">' + esc(nameOf(k)) + '</button>').join('');
    $('preview').innerHTML = charSVG(c);
    $('editor').innerHTML =
      row('Piel', swatches('skin', OPT.skin)) +
      row('Pelo', swatches('hair', OPT.hair)) +
      row('Peinado', OPT.style.map((s) => '<button class="chip" data-k="style" data-v="' + s[0] + '" aria-pressed="' + (c.style === s[0]) + '">' + s[1] + '</button>').join('')) +
      row('Ropa', swatches('outfit', OPT.outfit)) +
      row('Pantalón', swatches('pants', OPT.pants)) +
      row('Detalles', [['glasses', 'Lentes'], ['freckles', 'Pequitas'], ['earrings', 'Aretes'], ['cap', 'Gorra'], ['flower', 'Flor en el pelo']].map((t) =>
        '<button class="chip" data-t="' + t[0] + '" aria-pressed="' + !!c[t[0]] + '">' + t[1] + '</button>').join(''));
    $('sheetFoot').innerHTML = '<button class="btn sm" id="resetChars">Restablecer</button>' + (EDITOR ? '<button class="btn sm" id="copyCfg">Copiar</button>' : '');
  }
  function refresh(id) {
    if (chars[id]) chars[id].querySelector('.fig').innerHTML = charSVG(cfg[id]);
    $('preview').innerHTML = charSVG(cfg[id]);
  }
  sheet.addEventListener('click', (e) => {
    const t = e.target;
    if (t === sheet) { sheet.hidden = true; return; }
    const sw = t.closest('.sw, [data-k]'), tg = t.closest('[data-t]'), wh = t.closest('[data-who]');
    if (wh) { who = wh.dataset.who; renderSheet(); return; }
    if (sw) { cfg[who][sw.dataset.k] = sw.dataset.v; save(); refresh(who); renderSheet(); return; }
    if (tg) { cfg[who][tg.dataset.t] = !cfg[who][tg.dataset.t]; save(); refresh(who); renderSheet(); return; }
    if (t.closest('#resetChars')) { cfg = clone(CHARACTERS); save(); ['her', 'him'].forEach(refresh); renderSheet(); return; }
    if (t.closest('#copyCfg')) {
      const txt = 'const CHARACTERS = ' + JSON.stringify(cfg, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'") + ';';
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => { t.textContent = 'Copiado'; }, () => { window.prompt('Copia esto y pégalo en content.js', txt); });
    }
  });
  $('sheetClose').addEventListener('click', () => { sheet.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) sheet.hidden = true; });
  $('customize').addEventListener('click', () => { renderSheet(); sheet.hidden = false; });
  window.addEventListener('hashchange', () => { sheet.hidden = true; });

  /* ---------- Entrada a la pantalla ---------- */
  FA.hooks.world = function () {
    if (inited) return;
    inited = true;
    setScene('winter');
    makeActor('char', 'her', 32, 64);
    makeActor('char', 'him', 68, 64);
  };
})();
