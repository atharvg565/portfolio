const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } },
                set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

/* ===== EDIT ME: your details ===== */
const ME = {
  github: 'https://github.com/atharvg565',
  linkedin: 'www.linkedin.com/in/atharvg565',
  email: 'guptaatharv565@gmail.com',
  other: []     // [{ label: 'Portfolio', url: '...' }]
};

/* ===== pixel icons (8x8) ===== */
const ICON_MAPS = {
  about: ['..####..','.######.','.######.','..####..','.######.','########','########','########'],
  projects: ['.######.','#.....##','#.####.#','#.....##','#.####.#','#.....##','#.####.#','.######.'],
  skills: ['########','########','########','########','.######.','..####..','...##...','........'],
  connect: ['########','##....##','#.#..#.#','#..##..#','#......#','#......#','########','........']
};
const iconCache = {};
function icon(name) {
  if (!iconCache[name]) {
    const c = document.createElement('canvas'); c.width = c.height = 8;
    const x = c.getContext('2d'); x.fillStyle = '#c9252c';
    ICON_MAPS[name].forEach((r, y) => [...r].forEach((ch, i) => ch === '#' && x.fillRect(i, y, 1, 1)));
    iconCache[name] = c.toDataURL();
  }
  return `<img class="ico" src="${iconCache[name]}" alt="">`;
}

/* ===== home decorations (smooth vector art, original) ===== */
const OL = 'stroke="#2a1030" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
const DECO_SVG = {
  folder: `<svg viewBox="0 0 100 84"><g ${OL}>
    <path d="M8 20a6 6 0 0 1 6-6h24l8 8h40a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#e8963a"/>
    <path d="M8 34a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v36a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#f7c873"/></g></svg>`,
  books: `<svg viewBox="0 0 100 84"><g ${OL}>
    <rect x="10" y="8" width="80" height="22" rx="5" fill="#c9252c"/>
    <rect x="5" y="31" width="88" height="22" rx="5" fill="#2f7fc4"/>
    <rect x="12" y="54" width="78" height="22" rx="5" fill="#3a9a5a"/></g>
    <path d="M22 19h32M17 42h38M24 65h30" stroke="#fff1d6" stroke-width="3" stroke-linecap="round"/></svg>`,
  cone: `<svg viewBox="0 0 100 92"><g ${OL}>
    <path d="M42 8h16l22 68H20z" fill="#f06a2b"/>
    <rect x="10" y="74" width="80" height="14" rx="4" fill="#f06a2b"/></g>
    <path d="M35.3 30H64.7L69.3 44H30.7Z M26 58H74L78.7 70H21.3Z" fill="#fff1d6"/></svg>`,
  notepad: `<svg viewBox="0 0 100 100"><g ${OL}>
    <rect x="18" y="10" width="66" height="82" rx="7" fill="#4fb6ec"/></g>
    <path d="M34 36h38M34 50h38M34 64h26" stroke="#fff1d6" stroke-width="4" stroke-linecap="round"/>
    <g fill="#fff1d6" ${OL}><circle cx="18" cy="26" r="5"/><circle cx="18" cy="46" r="5"/><circle cx="18" cy="66" r="5"/></g></svg>`,
  terminal: `<svg viewBox="0 0 100 76"><g ${OL}>
    <rect x="6" y="6" width="88" height="64" rx="8" fill="#1a0f14"/></g>
    <path d="M6 14a8 8 0 0 1 8-8h72a8 8 0 0 1 8 8v8H6z" fill="#8a8a99" stroke="#2a1030" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="18" cy="14" r="3" fill="#c9252c"/><circle cx="28" cy="14" r="3" fill="#f7b32b"/>
    <text x="16" y="56" font-family="Pixelify Sans, monospace" font-size="26" font-weight="700" fill="#fff1d6">&gt;_</text></svg>`,
  sparkle: `<svg viewBox="0 0 100 100"><path d="M50 4Q56 44 96 50Q56 56 50 96Q44 56 4 50Q44 44 50 4Z" fill="#f7b32b" ${OL}/></svg>`,
  star: `<svg viewBox="0 0 100 100"><path d="M50 6L61 38L95 38L67 58L78 92L50 71L22 92L33 58L5 38L39 38Z" fill="#c9252c" ${OL}/></svg>`
};
Object.assign(DECO_SVG, {
  potion: `<svg viewBox="0 0 100 100"><g ${OL}>
    <rect x="38" y="4" width="24" height="14" rx="4" fill="#c97a2a"/>
    <path d="M42 18v14L20 66a16 16 0 0 0 14 24h32a16 16 0 0 0 14-24L58 32V18z" fill="#4fd0c8"/></g>
    <path d="M26 66h48l4 4a12 12 0 0 1-10 16H34a12 12 0 0 1-10-16z" fill="#2f9fb0"/>
    <path d="M36 52l-8 14" stroke="#fff1d6" stroke-width="4" stroke-linecap="round"/></svg>`,
  key: `<svg viewBox="0 0 100 100"><g transform="rotate(35 50 50)" ${OL}>
    <rect x="45" y="36" width="10" height="52" rx="3" fill="#f7b32b"/>
    <rect x="55" y="64" width="15" height="8" rx="2" fill="#f7b32b"/>
    <rect x="55" y="77" width="11" height="8" rx="2" fill="#f7b32b"/>
    <circle cx="50" cy="24" r="17" fill="#f7b32b"/><circle cx="50" cy="24" r="6" fill="#4a1233"/></g></svg>`,
  sword: `<svg viewBox="0 0 100 100"><g transform="rotate(40 50 50)" ${OL}>
    <path d="M50 2l9 12v50H41V14z" fill="#d8dee6"/>
    <rect x="26" y="64" width="48" height="10" rx="5" fill="#c97a2a"/>
    <rect x="44" y="74" width="12" height="16" rx="3" fill="#7a3a1a"/>
    <circle cx="50" cy="93" r="5" fill="#f7b32b"/></g></svg>`,
  mushroom: `<svg viewBox="0 0 100 100"><g ${OL}>
    <path d="M34 50h32v28a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10z" fill="#fff1d6"/>
    <path d="M8 52a42 40 0 0 1 84 0z" fill="#c9252c"/></g>
    <circle cx="30" cy="40" r="6" fill="#fff1d6"/><circle cx="56" cy="30" r="7" fill="#fff1d6"/><circle cx="74" cy="43" r="5" fill="#fff1d6"/></svg>`,
  apple: `<svg viewBox="0 0 100 100"><g ${OL}>
    <path d="M50 30C30 16 8 30 12 56c3 22 20 36 38 30 18 6 35-8 38-30 4-26-18-40-38-26z" fill="#d93a2f"/>
    <path d="M54 18q16-10 28 2q-14 10-28-2z" fill="#3a9a5a"/></g>
    <path d="M24 46q4-10 12-12" stroke="#fff1d6" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  scroll: `<svg viewBox="0 0 100 100"><g ${OL}>
    <rect x="20" y="20" width="60" height="60" fill="#fff1d6"/>
    <rect x="12" y="12" width="76" height="16" rx="8" fill="#f0c98a"/>
    <rect x="12" y="72" width="76" height="16" rx="8" fill="#f0c98a"/></g>
    <path d="M32 40h36M32 52h36M32 62h22" stroke="#c9252c" stroke-width="4" stroke-linecap="round"/></svg>`,
  feather: `<svg viewBox="0 0 100 100"><g ${OL}>
    <path d="M18 90C6 42 38 8 90 8C88 52 62 88 18 90z" fill="#f06a2b"/></g>
    <path d="M20 88L72 26" stroke="#2a1030" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 66l-12-6M52 52l-14-6M62 40l-12-4M32 76l-10-2" stroke="#fff1d6" stroke-width="3" stroke-linecap="round"/></svg>`
});
const MOUTH = (() => {
  const top = t => 6 + 24 * t * (1 - t);    // upper lip curve
  const bot = t => 6 + 100 * t * (1 - t);   // lower lip curve
  const X = t => 10 + 80 * t;
  const f = n => n.toFixed(1);
  const S = 'fill="#fff" stroke="#2a1030" stroke-width="1.5" stroke-linejoin="round"';
  const N = 6, a = .12, step = .76 / N;
  let teeth = '';
  for (let i = 0; i < N; i++) {                       // top teeth
    const t0 = a + i * step, t1 = t0 + step, tm = (t0 + t1) / 2;
    const gap = bot(tm) - top(tm);
    teeth += `<path d="M${f(X(t0))} ${f(top(t0))}L${f(X(t1))} ${f(top(t1))}L${f(X(tm))} ${f(top(tm) + gap * .42)}Z" ${S}/>`;
  }
  for (let i = 1; i < N; i++) {                       // bottom teeth
    const tm = a + i * step, t0 = tm - step * .4, t1 = tm + step * .4;
    const gap = bot(tm) - top(tm);
    teeth += `<path d="M${f(X(t0))} ${f(bot(t0))}L${f(X(t1))} ${f(bot(t1))}L${f(X(tm))} ${f(bot(tm) - gap * .3)}Z" ${S}/>`;
  }
  return `<svg class="mouth" viewBox="0 0 100 40"><path d="M10 6Q50 56 90 6Q50 18 10 6Z" fill="#5a0f1a" stroke="#2a1030" stroke-width="3" stroke-linejoin="round"/>${teeth}</svg>`;
})();
function deco(name, cls, mimic = false) {
  return `<span class="deco ${cls}${mimic ? ' mimic' : ''}" aria-hidden="true">${DECO_SVG[name]}${mimic ? MOUTH : ''}</span>`;
}
const tagNote = (cls, text) => `<span class="deco paper ${cls}" aria-hidden="true"><i class="tape"></i>${text}</span>`;

/* ===== sound ===== */
let sfxOn = false, actx;
function blip(f = 520, d = .06) {
  if (!sfxOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = f; g.gain.value = .03;
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d);
  } catch {}
}
const bgm = $('#bgm'), musicBtn = $('#music'), vol = $('#vol'), sfxBtn = $('#sfx');
bgm.volume = (Number(store.get('vol')) || 25) / 100; vol.value = Math.round(bgm.volume * 100);
function setMusicUI(on, label) {
  musicBtn.setAttribute('aria-pressed', on); musicBtn.textContent = label || (on ? 'MUSIC ON' : 'MUSIC OFF');
}
async function playMusic() {
  try { await bgm.play(); setMusicUI(true); store.set('music', 'on'); }
  catch { setMusicUI(false, 'NO AUDIO FILE'); }
}
musicBtn.addEventListener('click', () => {
  if (bgm.paused) playMusic(); else { bgm.pause(); setMusicUI(false); store.set('music', 'off'); }
});
bgm.addEventListener('error', () => setMusicUI(false, 'NO AUDIO FILE'));
vol.addEventListener('input', () => { bgm.volume = vol.value / 100; store.set('vol', vol.value); });
sfxBtn.addEventListener('click', () => {
  sfxOn = !sfxOn; sfxBtn.setAttribute('aria-pressed', sfxOn); sfxBtn.textContent = sfxOn ? 'SFX ON' : 'SFX OFF'; blip(700);
});

/* ===== splash: press any key ===== */
const splash = $('#splash');
let entered = false;
function enter() {
  if (entered) return;
  entered = true; document.body.classList.remove('locked');
  splash.classList.add('out'); setTimeout(() => splash.remove(), 500);
  if (store.get('music') !== 'off') playMusic();   // allowed: the user just interacted
  blip(660);
  const t = location.hash.length > 2 ? view : $('#menu a');
  t && t.focus({ preventScroll: true });
}
addEventListener('keydown', enter); addEventListener('pointerdown', enter);

/* ===== pixel sunset scene (320x180, original art) ===== */
const W = 320, H = 180, sc = $('#scene'); sc.width = W; sc.height = H;
const cx = sc.getContext('2d'), bgc = document.createElement('canvas'); bgc.width = W; bgc.height = H;
const b = bgc.getContext('2d');
const R = (x, y, w, h, c) => { b.fillStyle = c; b.fillRect(x, y, w, h); };
const tri = (x, y, h, hw, c) => { for (let i = 0; i < h; i++) { const w = Math.round(i * hw / h); R(x - w, y + i, w * 2 + 1, 1, c); } };
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

// sky + streaky clouds
['#4a1233','#7a1a3a','#a82440','#d03a3c','#ea5d3a','#f4864a','#fbad5c','#fdc977'].forEach((c, i) => R(0, i * 17, W, 17, c));
for (let i = 0; i < 14; i++) R(Math.floor(rnd() * W), 10 + Math.floor(rnd() * 80), 20 + Math.floor(rnd() * 40), 1 + (i % 2), 'rgba(255,190,140,.35)');
// big sun
[44, 38].forEach((r, i) => { b.fillStyle = `rgba(255,220,130,${.12 + i * .06})`; b.beginPath(); b.arc(92, 84, r, 0, 7); b.fill(); });
for (let y = -26; y <= 26; y++) for (let x = -26; x <= 26; x++) if (x * x + y * y <= 676) R(92 + x, 84 + y, 1, 1, y % 7 === 0 && y > 8 ? '#ffcf6e' : '#ffe28f');
// misty hills
const hills = (base, amp, f, seed, c) => { for (let x = 0; x < W; x++) { const y = Math.floor(base + Math.sin(x * f + seed) * amp + Math.sin(x * f * 2.3 + seed * 2) * amp / 2); R(x, y, 1, 134 - y, c); } };
hills(106, 9, .028, 1, '#b04a6a'); hills(114, 8, .042, 4, '#7f2f5c'); hills(121, 5, .06, 7, '#4f1f48');
// river + sun reflection
R(0, 130, W, 50, '#cf3d40');
for (let i = 0; i < 10; i++) R(80 + (i * 5) % 9, 132 + i * 3, 26 - i * 2, 1, 'rgba(255,226,143,.75)');
for (let i = 0; i < 40; i++) R(Math.floor(rnd() * W), 132 + Math.floor(rnd() * 20), 6, 1, 'rgba(255,160,100,.4)');
// mansion on the cliff (right)
const D = '#2a1030';
R(232, 124, 90, 56, D); R(240, 90, 60, 38, D); tri(252, 70, 22, 16, D); tri(284, 76, 16, 14, D);
R(268, 52, 8, 40, D); tri(272, 36, 18, 6, D); R(271, 28, 2, 8, D); R(269, 31, 6, 2, D);
[[246,100],[256,100],[246,110],[286,100],[294,108],[270,64],[262,112]].forEach(([x, y]) => R(x, y, 3, 4, '#ffb347'));
// pines (left)
const pine = (x, base, h, hw, c) => { tri(x, base - h, h, hw, c); R(x - 1, base, 3, 8, c); };
pine(10, 150, 78, 15, D); pine(30, 152, 56, 12, D); pine(50, 146, 40, 9, '#3a1438');
// red tree (right)
R(306, 120, 3, 30, '#3a1428');
for (let dy = -15; dy <= 15; dy++) for (let dx = -15; dx <= 15; dx++) if (dx * dx + dy * dy < 225) R(307 + dx, 108 + dy, 1, 1, (dx * 7 + dy * 13) & 3 ? '#e5573a' : '#c9252c');
// red banks
const bank = (x0, x1, base, amp, f, c1, c2) => { for (let x = x0; x < x1; x++) { const y = Math.floor(base + Math.sin(x * f) * amp); R(x, y, 1, H - y, c1); if (rnd() > .7) R(x, y + Math.floor(rnd() * (H - y)), 2, 1, c2); } };
bank(0, 150, 152, 4, .05, '#b02a3c', '#e5573a'); bank(200, W, 158, 3, .07, '#8f1f36', '#d4452f');

const birds = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * W, y: 24 + Math.random() * 50, s: .1 + Math.random() * .12, p: i * 1.7 }));
const motes = Array.from({ length: matchMedia('(max-width:760px)').matches ? 18 : 36 },
  () => ({ x: Math.random() * W, y: Math.random() * H, v: .15 + Math.random() * .35, p: Math.random() * 6 }));
let last = 0;
function frame(t) {
  if (t - last > 80) {
    last = t; cx.drawImage(bgc, 0, 0);
    cx.fillStyle = D;
    birds.forEach(o => {
      o.x = (o.x + o.s * 8) % W;
      const x = Math.round(o.x), y = Math.round(o.y + Math.sin(t / 700 + o.p) * 3), up = Math.sin(t / 140 + o.p) > 0;
      [[-2, up ? -1 : 1], [-1, 0], [0, up ? 1 : 0], [1, 0], [2, up ? -1 : 1]].forEach(([dx, dy]) => cx.fillRect(x + dx, y + dy, 1, 1));
    });
    motes.forEach(m => {
      m.y -= m.v; m.x += Math.sin(t / 800 + m.p) * .2; if (m.y < 0) { m.y = H; m.x = Math.random() * W; }
      cx.fillStyle = `rgba(255,214,120,${(.3 + .5 * Math.abs(Math.sin(t / 500 + m.p))).toFixed(2)})`;
      cx.fillRect(m.x | 0, m.y | 0, 1, 1);
    });
  }
  requestAnimationFrame(frame);
}
cx.drawImage(bgc, 0, 0); if (!reduce) requestAnimationFrame(frame);

/* ===== pages ===== */
const view = $('#view');
const ph = t => `<span class="ph">[Add: ${esc(t)}]</span>`;

function pageMenu() {
  return `<div class="note" aria-hidden="true"><i class="pin"></i>psst: use ↑ ↓ then enter</div>
  <h1 class="sticker">ATHARV<br>GUPTA</h1>
  <p class="sub"><span>DEVELOPER // DIGITAL CREATOR</span></p>
  <ul class="menu" id="menu">
    ${[['about','ABOUT ME'],['projects','PROJECTS'],['skills','SKILLS'],['connect','CONNECT WITH ME']]
      .map(([k, l]) => `<li><a href="#/${k}">${icon(k)}${l}</a></li>`).join('')}
  </ul>
  <div class="scatter">
    ${deco('folder','d1',true)}${deco('books','d2',true)}${deco('cone','d3',true)}${deco('notepad','d4',true)}${deco('terminal','d5',true)}
    ${deco('potion','e1')}${deco('key','e2')}${deco('sword','e3')}${deco('mushroom','e4',true)}${deco('apple','e5',true)}${deco('scroll','e6')}${deco('feather','e7')}
    ${deco('star','s1')}${deco('star','s4')}${deco('sparkle','s2')}${deco('sparkle','s3')}${deco('sparkle','s5')}${deco('sparkle','s6')}${deco('sparkle','s7')}${deco('sparkle','s8')}
    ${tagNote('n1','full-stack<br>dev ✦')}${tagNote('n2','build.<br>break.<br>repeat.')}
  </div>`;
}

function pageAbout() {
  return `<h2 class="sticker page-h">PLAYER PROFILE</h2>
  <div class="two">
    <aside class="panel profile">
      <div class="avatar" aria-hidden="true">AG</div>
      <h3>ATHARV</h3><p class="status">CLASS: FULL-STACK APPRENTICE</p>
      <dl>
        <dt>STUDYING</dt><dd>${ph('degree / school / year')}</dd>
        <dt>BASE</dt><dd>${ph('city, optional')}</dd>
        <dt>LOOKING FOR</dt><dd>${ph('internships / collaborations')}</dd>
      </dl>
    </aside>
    <article class="panel">
      <div class="label">INTRODUCTION</div>
      <p>I'm a student developer who learns by building. I like turning messy problems into software that can explain its own answers.</p>
      <div class="label">BACKGROUND &amp; EDUCATION</div><p>${ph('your educational journey')}</p>
      <div class="label">HOW I GOT INTO PROGRAMMING</div><p>${ph('your story')}</p>
      <div class="label">INTERESTS</div>
      <p>Software development, cybersecurity (CyberShield), and explainable matching and scoring (Setu). ${ph('AI / creative tech interests, if accurate')}</p>
      <div class="label">CURRENTLY LEARNING</div><p>${ph('e.g. what you are studying now')}</p>
      <div class="label">FUTURE GOALS</div><p>${ph('the kinds of projects you want to build')}</p>
    </article>
  </div>`;
}

function projectCard(p) {
  return `<article class="panel card ${p.featured ? 'feat' : ''}">
    <div class="shot">${p.shot ? `<img src="${esc(p.shot)}" alt="${esc(p.title)} preview">` : '[ PREVIEW PLACEHOLDER ]'}</div>
    <h3>${esc(p.title)}${p.featured ? ' ★' : ''}</h3><div class="status">STATUS: ${esc(p.status)}</div>
    <p>${esc(p.summary)}</p>
    <div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="row"><a class="btn" href="#/projects/${esc(p.slug)}">INSPECT</a>
      ${p.github ? `<a class="btn" href="${esc(p.github)}" target="_blank" rel="noopener">GITHUB</a>` : ''}
      ${p.demo ? `<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener">LIVE</a>` : ''}</div></article>`;
}
const pageProjects = () => `<h2 class="sticker page-h">QUEST LOG</h2><div class="grid">${PROJECTS.map(projectCard).join('')}</div>`;

function pageProject(slug) {
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return `<h2 class="sticker page-h">QUEST NOT FOUND</h2><a class="btn" href="#/projects">◀ BACK</a>`;
  const sec = (l, v) => `<div class="label">${l}</div><p>${/^\[Add/.test(v) ? `<span class="ph">${esc(v)}</span>` : esc(v)}</p>`;
  return `<h2 class="sticker page-h">${esc(p.title.toUpperCase())}</h2>
  <article class="panel">
    <div class="shot">${p.shot ? `<img src="${esc(p.shot)}" alt="${esc(p.title)} screenshot">` : '[ SCREENSHOT PLACEHOLDER ]'}</div>
    <div class="status" style="margin-top:.6rem">STATUS: ${esc(p.status)}</div>
    ${sec('OVERVIEW', p.overview)}${sec('PROBLEM', p.problem)}${sec('MY CONTRIBUTION', p.contribution)}
    ${sec('TECHNICAL APPROACH', p.approach)}
    <div class="label">TECH STACK</div><div class="tags">${p.stack.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    ${sec('KEY CHALLENGES', p.challenges)}${sec('RESULTS &amp; LESSONS', p.results)}
    <div class="row" style="margin-top:1rem"><a class="btn" href="#/projects">◀ ALL QUESTS</a>
      ${p.github ? `<a class="btn" href="${esc(p.github)}" target="_blank" rel="noopener">REPOSITORY</a>` : ''}
      ${p.demo ? `<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener">LIVE DEMO</a>` : ''}</div>
  </article>`;
}

/* Only skills you've mentioned are listed. '' means "add how you used it". */
const SKILLS = {
  'Programming languages': [['Python','Used in CyberShield.'],['JavaScript','Used in this portfolio and Setu.'],['SQL',''],['HTML / CSS','Used to build this portfolio.']],
  'Frontend': [['React','Used in Setu.'],['Tailwind','Used in Setu.']],
  'Backend': [['Node.js','Used in Setu and this portfolio.'],['Express','Serves this portfolio; used in Setu.']],
  'Databases': [['MongoDB','Used in Setu.'],['SQL / SQLite','']],
  'AI & machine learning': [['ML classification','CyberShield uses a model trained on about 235,000 URLs.']],
  'Developer tools': [['Git & GitHub',''],['VS Code',''],['Vercel','Hosts this portfolio.']]
};
function pageSkills() {
  return `<h2 class="sticker page-h">INVENTORY</h2><div class="inv">
  ${Object.entries(SKILLS).map(([cat, items]) => `<h3>${esc(cat.toUpperCase())}</h3>
    <div class="slots">${items.map(([n, d]) => `<button class="slot" aria-pressed="false" data-n="${esc(n)}" data-d="${esc(d)}">${icon('skills')}${esc(n)}</button>`).join('')}</div>`).join('')}
  </div><div class="panel detail" id="detail" aria-live="polite"><span class="ph">Select an item to inspect it.</span></div>`;
}

function pageConnect() {
  const link = (l, u) => u ? `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`
    : `<span class="btn ph">${l}: [Add link in ME in script.js]</span>`;
  return `<h2 class="sticker page-h">START TRANSMISSION</h2>
  <section class="panel term">
    <div class="line">channel open: atharv_gupta</div>
    <div class="line">status: available for collaboration ${ph('edit if not true')}</div>
    <div class="line caret">let's connect</div>
    <div class="links">
      ${link('GITHUB', ME.github)}${link('LINKEDIN', ME.linkedin)}
      ${ME.other.map(o => link(esc(o.label.toUpperCase()), o.url)).join('')}
      ${ME.email ? `<div class="row"><a class="btn" href="mailto:${esc(ME.email)}">EMAIL: ${esc(ME.email)}</a>
        <button class="btn" id="copy">COPY EMAIL</button><span id="copied" role="status"></span></div>`
        : '<span class="btn ph">EMAIL: [Add email in ME in script.js]</span>'}
    </div>
  </section>`;
}

/* ===== router ===== */
const PAGES = { about: [pageAbout, 'About'], projects: [pageProjects, 'Projects'], skills: [pageSkills, 'Skills'], connect: [pageConnect, 'Connect'] };
function route() {
  const [page, id] = location.hash.replace(/^#\/?/, '').split('/');
  let html = pageMenu(), title = "Atharv's Portfolio";
  if (page === 'projects' && id) { html = pageProject(id); title = 'Quest | Atharv Gupta'; }
  else if (PAGES[page]) { html = PAGES[page][0](); title = `${PAGES[page][1]} | Atharv Gupta`; }
  view.innerHTML = html; document.title = title;
  view.classList.toggle('board', !!page); view.classList.toggle('home', !page);
  view.classList.remove('enter'); void view.offsetWidth; if (!reduce) view.classList.add('enter');
  const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; if (!reduce) f.classList.add('go');
  $('#home-link').hidden = !page;
  $('#foot').textContent = page ? 'ESC BACK · TAB / CLICK TO NAVIGATE' : '↑ ↓ MOVE · ENTER SELECT · ESC BACK';
  scrollTo(0, 0); blip(660);
  if (entered) (page ? view : $('#menu a')).focus({ preventScroll: true });
  if (!page) $('#menu').addEventListener('mouseover', e => e.target.closest('a')?.focus());
}
addEventListener('hashchange', route); route();

/* ===== interactions ===== */
view.addEventListener('click', e => {
  const slot = e.target.closest('.slot');
  if (slot) {
    document.querySelectorAll('.slot').forEach(s => s.setAttribute('aria-pressed', s === slot));
    $('#detail').innerHTML = `<h3>${esc(slot.dataset.n)}</h3><p>${slot.dataset.d ? esc(slot.dataset.d) : '<span class="ph">[Add: how you have used this in a project]</span>'}</p>`;
    blip(520);
  }
  if (e.target.id === 'copy') {
    navigator.clipboard.writeText(ME.email).then(
      () => { $('#copied').textContent = ' COPIED ✓'; },
      () => { $('#copied').textContent = ' COPY FAILED, use the email link'; });
  }
});
addEventListener('keydown', e => {
  if (!entered || e.target.matches('input,textarea')) return;
  const page = location.hash.replace(/^#\/?/, '').split('/');
  if (e.key === 'Escape' && page[0]) { location.hash = page[1] ? '#/projects' : '#/'; return; }
  if (!page[0] && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    const items = [...document.querySelectorAll('#menu a')], i = items.indexOf(document.activeElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); blip(520, .04);
  }
});