// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(tag, cls = '', text = '') {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

// ---------- sound (tiny 8-bit blips) ----------
let soundOn = true, actx;
function blip(freq = 520, dur = 0.07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.04;
    o.connect(g); g.connect(actx.destination);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.start(); o.stop(actx.currentTime + dur);
  } catch (e) {}
}
const soundBtn = $('#sound');
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? '♪ on' : '♪ off';
  blip();
});

// ---------- chibi sprite (16x20 pixel map: edit me!) ----------
// o outline, h hair, H hair shine, s skin, k blush, e eyes, m mouth,
// r/R outfit light/dark, p pants, b shoes, . transparent
const SPRITE = [
  '....oooooooo....',
  '...ohhhhhhhho...',
  '..ohhHHhhhhhho..',
  '..ohhhhhhhhhho..',
  '.ohhhsssssshhho.',
  '.ohhsssssssshho.',
  '.ohseesssseesho.',
  '.ohseesssseesho.',
  '.ohskssssssksho.',
  '..ohsssmmsssho..',
  '....ossssssso...',
  '...orrrrrrrro...',
  '..orrrRrrRrrro..',
  '.orrrrrrrrrrrro.',
  '.osrrrRRRRrrrso.',
  '..oorrrrrrrroo..',
  '...oppppppppo...',
  '...opppoopppo...',
  '...obbboobbbo...',
  '...oooo..oooo...',
];
const OUTFITS = [
  { name: 'night guard',  main: '#2b2f3a', dark: '#161922', cape: '#14161d', mask: '#14161d' },
  { name: 'gold armor',   main: '#c4302b', dark: '#e0a526', emblem: '#bff3ff' },
  { name: 'web runner',   main: '#d62839', dark: '#2748a8', mask: '#d62839' },
  { name: 'storm hammer', main: '#5b6b7a', dark: '#3a4654', cape: '#c0392b', emblem: '#e0e6ee' },
  { name: 'bow kitty',    main: '#ff8fb1', dark: '#d9628a', bow: '#ff3d77' },
];
let outfitIndex = 0;
let usingCustom = false;

function paletteFor(o) {
  return { o: '#2a1a14', h: '#1c1c26', H: '#3d3d58', s: '#f0c19a', k: '#e88a7a',
           e: '#15110f', m: '#8a3b2e', r: o.main, R: o.dark, p: '#3b4a6b', b: '#2a1a14' };
}

function drawSprite(ctx, pal, ox = 0, oy = 0) {
  SPRITE.forEach((row, y) => {
    [...row.padEnd(16, '.')].forEach((ch, x) => {
      if (pal[ch]) { ctx.fillStyle = pal[ch]; ctx.fillRect(ox + x, oy + y, 1, 1); }
    });
  });
}

// capes, masks, bows and chest emblems are drawn on top of the base sprite
function drawExtras(ctx, o, ox = 0, oy = 0) {
  const px = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(ox + x, oy + y, 1, 1); };
  if (o.cape) for (let y = 11; y < 18; y++) { px(0, y, o.cape); px(15, y, o.cape); }
  if (o.mask) {
    for (let x = 5; x <= 10; x++) px(x, 4, o.mask);
    for (let x = 3; x <= 12; x++) px(x, 5, o.mask);
    [3, 6, 7, 8, 9, 12].forEach(x => { px(x, 6, o.mask); px(x, 7, o.mask); });
  }
  if (o.bow) {
    [9, 10, 12, 13].forEach(x => px(x, 1, o.bow));
    [9, 10, 12, 13].forEach(x => px(x, 2, o.bow));
    px(11, 1, '#ffffff'); px(11, 2, '#ffffff');
  }
  if (o.emblem) { px(7, 13, o.emblem); px(8, 13, o.emblem); px(7, 14, o.emblem); px(8, 14, o.emblem); }
}

function drawCharacter(ctx, o, ox = 0, oy = 0) {
  drawSprite(ctx, paletteFor(o), ox, oy);
  drawExtras(ctx, o, ox, oy);
}

const heroCanvas = $('#hero');
const heroCtx = heroCanvas.getContext('2d');
function renderHero() {
  if (usingCustom) return;
  heroCtx.clearRect(0, 0, 16, 20);
  drawCharacter(heroCtx, OUTFITS[outfitIndex]);
  $('#outfit-name').textContent = 'hero: ' + OUTFITS[outfitIndex].name;
}

function cycleOutfit(d) {
  if (usingCustom) return;
  outfitIndex = (outfitIndex + d + OUTFITS.length) % OUTFITS.length;
  renderHero();
  buildStatic();
  blip(600, 0.05);
}
$('#prev').addEventListener('click', () => cycleOutfit(-1));
$('#next').addEventListener('click', () => cycleOutfit(1));

// Optional: drop your own sprite at public/images/chibi.png (32x40 px, transparent) and it replaces this one
const customSprite = new Image();
customSprite.onload = () => {
  usingCustom = true;
  customSprite.id = 'hero';
  customSprite.alt = 'Chibi Atharv';
  heroCanvas.replaceWith(customSprite);
  $('#outfit-name').textContent = 'player one';
  buildStatic();
};
customSprite.src = 'images/chibi.png';

// ---------- pixel forest scene (320x180, scaled up crisp) ----------
const W = 320, H = 180;
const scene = $('#scene');
scene.width = W; scene.height = H;
const sctx = scene.getContext('2d');
const layer = document.createElement('canvas');
layer.width = W; layer.height = H;
const lctx = layer.getContext('2d');

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pine(c, x, baseY, h, w, color) {
  c.fillStyle = color;
  for (let i = 0; i < h; i++) {
    const half = Math.max(1, Math.round((i / h) * (w / 2) + (i % 7 < 2 ? 1.5 : 0)));
    c.fillRect(x - half, baseY - h + i, half * 2 + 1, 1);
  }
  c.fillRect(x - 1, baseY, 3, 4);
}
function log(c, x, y, w) {
  c.fillStyle = '#6b3f26'; c.fillRect(x, y, w, 9);
  c.fillStyle = '#8a5634'; c.fillRect(x, y, w, 2);
  c.fillStyle = '#3e2315'; c.fillRect(x, y + 8, w, 1);
  c.fillStyle = '#caa070'; c.fillRect(x + w - 3, y + 1, 3, 7);
  c.fillStyle = '#e8c58f'; c.fillRect(x + w - 2, y + 3, 1, 3);
}

function buildStatic() {
  const c = lctx, r = mulberry32(11);
  c.imageSmoothingEnabled = false;

  // sky bands (dusk)
  ['#2c4352', '#34505f', '#41596a', '#5b6372', '#7a6670', '#9b6c69', '#bc7b66', '#d68f68']
    .forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * 15, W, 15); });
  c.fillStyle = 'rgba(255,190,120,0.18)';
  for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(190, 112, 40 - k * 9, 0, Math.PI * 2); c.fill(); }

  // far + mid trees
  for (let x = -5; x < W + 10; x += 11 + Math.floor(r() * 8)) pine(c, x, 122, 46 + Math.floor(r() * 26), 22, '#4d5f66');
  for (let x = 0; x < W + 10; x += 16 + Math.floor(r() * 12)) pine(c, x, 128, 60 + Math.floor(r() * 30), 30, '#2f4448');

  // ground
  c.fillStyle = '#2b3a2b'; c.fillRect(0, 124, W, H - 124);
  for (let i = 0; i < 500; i++) {
    c.fillStyle = r() > 0.5 ? '#37502f' : '#202c20';
    c.fillRect(Math.floor(r() * W), 124 + Math.floor(r() * (H - 124)), 2, 1);
  }
  c.fillStyle = '#5a4c33';
  for (let y = 140; y < 166; y++) for (let x = 70; x < 250; x++) {
    const dx = (x - 160) / 90, dy = (y - 153) / 13;
    if (dx * dx + dy * dy < 1 && r() > 0.12) c.fillRect(x, y, 1, 1);
  }

  // dark foreground trees framing the scene
  pine(c, 6, 190, 200, 80, '#0e1715');
  pine(c, 314, 190, 200, 84, '#0e1715');
  pine(c, 52, 190, 150, 50, '#142120');
  pine(c, 272, 190, 150, 50, '#142120');

  // you, sitting on the left log
  if (usingCustom) c.drawImage(customSprite, 90, 108, 24, 30);
  else drawCharacter(c, OUTFITS[outfitIndex], 92, 113);
  log(c, 78, 130, 58);
  log(c, 184, 132, 58);
}

function drawFire(t) {
  const c = sctx, fx = 160, fy = 152, f = Math.floor(t / 120);
  c.fillStyle = 'rgba(255,150,60,0.07)';
  for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(fx, fy - 6, 70 - k * 14, 0, Math.PI * 2); c.fill(); }
  [['#e5432d', 12, 9], ['#ff8a3d', 9, 7], ['#ffd36b', 5, 4]].forEach(([col, h, w], i) => {
    c.fillStyle = col;
    const hh = h + ((f * (i + 3) * 7) % 4);
    for (let y = 0; y < hh; y++) {
      const half = Math.max(1, Math.round((1 - y / hh) * w / 2));
      c.fillRect(fx - half, fy - y - 3, half * 2 + 1, 1);
    }
  });
  c.fillStyle = '#6a6a62';
  [-9, -5, 0, 5, 9].forEach(dx => c.fillRect(fx + dx - 1, fy + (Math.abs(dx) > 6 ? -2 : 0), 3, 2));
}

const flies = Array.from({ length: 16 }, () => ({
  x: Math.random() * W, y: 60 + Math.random() * 90, p: Math.random() * 6.28, s: 0.3 + Math.random() * 0.5,
}));
function drawFlies(t) {
  flies.forEach(f => {
    const x = f.x + Math.sin(t / 900 * f.s + f.p) * 14;
    const y = f.y + Math.cos(t / 1100 * f.s + f.p) * 8;
    const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 600 * f.s + f.p));
    sctx.fillStyle = `rgba(255,226,130,${a.toFixed(2)})`;
    sctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  });
}

let last = 0;
function frame(t) {
  if (t - last > 110) {
    last = t;
    sctx.drawImage(layer, 0, 0);
    drawFire(t);
    drawFlies(t);
  }
  if (!reduceMotion) requestAnimationFrame(frame);
}

// ---------- stats ----------
// Be honest here: 1 = just started, 5 = very comfortable
const LANGS = [
  ['Python', 3], ['SQL', 3], ['JavaScript', 3], ['HTML / CSS', 3],
  ['Node.js', 2], ['React', 2], ['MongoDB', 2],
];
$('#stat-list').replaceChildren(...LANGS.map(([name, lvl]) => {
  const li = el('li');
  li.append(el('span', '', name));
  const bar = el('span', 'bar');
  bar.setAttribute('aria-label', `${lvl} out of 5`);
  for (let i = 0; i < 5; i++) bar.append(el('i', i < lvl ? 'on' : ''));
  li.append(bar);
  return li;
}));

// ---------- projects (from your Express API) ----------
fetch('/api/projects')
  .then(res => res.json())
  .then(list => {
    $('#project-grid').replaceChildren(...list.map(p => {
      const card = el('article', 'panel project-card');
      card.append(el('h3', 'p-title', p.title), el('p', '', p.description));
      const tags = el('div', 'tags');
      (p.tags || []).forEach(t => tags.append(el('span', 'tag', t)));
      card.append(tags);
      const a = el('a', 'pixel-link', 'view on github ▶');
      a.href = p.link; a.target = '_blank'; a.rel = 'noopener';
      card.append(a);
      return card;
    }));
  })
  .catch(() => { $('#project-grid').textContent = 'Could not load the quest log. Is the server running?'; });

// ---------- navigation ----------
let current = 'menu';
const quitModal = $('#quit-modal');
const firstMenuBtn = () => $('#menu-list button');

function show(name) {
  if (name === 'quit') return openQuit();
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === name));
  current = name;
  if (name === 'menu') firstMenuBtn().focus();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (b) { blip(660); show(b.dataset.go); }
});
$$('.menu-list button').forEach(b => b.addEventListener('mouseenter', () => b.focus()));

// ---------- quit pop-up ----------
function openQuit() {
  quitModal.hidden = false;
  $('input[name="reason"]:checked').focus();
  blip(330);
}
function closeQuit() {
  quitModal.hidden = true;
  if (current === 'menu') firstMenuBtn().focus();
}
$('#stay').addEventListener('click', () => { blip(440); closeQuit(); });
$('#leave').addEventListener('click', () => {
  const choice = $('input[name="reason"]:checked').value;
  const extra = $('#reason-other').value.trim();
  const reason = extra ? `${choice}: ${extra}` : choice;
  // Optional: only does something if you add the /api/quit-reason route to server.js
  fetch('/api/quit-reason', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }),
  }).catch(() => {});
  quitModal.hidden = true;
  $('#bye-msg').textContent = `Safe travels, adventurer. Reason noted: ${choice}`;
  $('#reason-other').value = '';
  show('bye');
  blip(260, 0.2);
});

// ---------- keyboard ----------
document.addEventListener('keydown', e => {
  if (!quitModal.hidden) { if (e.key === 'Escape') closeQuit(); return; }
  if (e.key === 'Escape') { current === 'menu' ? openQuit() : show('menu'); return; }
  if (current === 'menu' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    const btns = $$('#menu-list button');
    const i = btns.indexOf(document.activeElement);
    const n = i < 0 ? 0 : (i + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
    btns[n].focus();
    blip(520, 0.04);
  }
  if (current === 'about') {
    if (e.key === 'ArrowRight') cycleOutfit(1);
    if (e.key === 'ArrowLeft') cycleOutfit(-1);
  }
});

// ---------- go ----------
renderHero();
buildStatic();
if (reduceMotion) frame(1000); else requestAnimationFrame(frame);
firstMenuBtn().focus();