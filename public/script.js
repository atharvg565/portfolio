const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } },
                set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

/* ===== EDIT ME: your details ===== */
const ME = {
  github: 'https://github.com/atharvg565',
  linkedin: '', // e.g. https://www.linkedin.com/in/yourname
  email: '',    // e.g. you@example.com
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
    const x = c.getContext('2d'); x.fillStyle = '#F06A2B';
    ICON_MAPS[name].forEach((r, y) => [...r].forEach((ch, i) => ch === '#' && x.fillRect(i, y, 1, 1)));
    iconCache[name] = c.toDataURL();
  }
  return `<img class="ico" src="${iconCache[name]}" alt="">`;
}

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
  musicBtn.setAttribute('aria-pressed', on); musicBtn.textContent = label || (on ? '♪ MUSIC ON' : '♪ MUSIC OFF');
}
async function playMusic() {
  try { await bgm.play(); setMusicUI(true); store.set('music', 'on'); }
  catch { setMusicUI(false, '♪ NO AUDIO FILE'); }
}
musicBtn.addEventListener('click', () => {
  if (bgm.paused) playMusic(); else { bgm.pause(); setMusicUI(false); store.set('music', 'off'); }
});
bgm.addEventListener('error', () => setMusicUI(false, '♪ NO AUDIO FILE'));
vol.addEventListener('input', () => { bgm.volume = vol.value / 100; store.set('vol', vol.value); });
sfxBtn.addEventListener('click', () => {
  sfxOn = !sfxOn; sfxBtn.setAttribute('aria-pressed', sfxOn); sfxBtn.textContent = sfxOn ? 'SFX ON' : 'SFX OFF'; blip(700);
});
// If music was on last visit, resume after the first user interaction (browsers block autoplay)
if (store.get('music') === 'on') {
  const resume = () => { if (bgm.paused) playMusic(); };
  addEventListener('pointerdown', resume, { once: true }); addEventListener('keydown', resume, { once: true });
}

/* ===== pixel scene: burning horizon, castle silhouettes, embers ===== */
const W = 320, H = 180, sc = $('#scene'); sc.width = W; sc.height = H;
const cx = sc.getContext('2d'), bgc = document.createElement('canvas'); bgc.width = W; bgc.height = H;
const b = bgc.getContext('2d');
['#0B090A','#160c0e','#2a0f12','#4a1414','#7a1f1c','#a8321c','#d4551f','#f06a2b']
  .forEach((c, i) => { b.fillStyle = c; b.fillRect(0, i * 14, W, 14); });
b.fillStyle = 'rgba(255,170,90,.35)'; [26, 18].forEach(r => { b.beginPath(); b.arc(215, 112, r, 0, 7); b.fill(); });
b.fillStyle = '#0B090A'; b.fillRect(0, 118, W, 62);
function tower(x, w, h) {
  b.fillRect(x, 118 - h, w, h);
  for (let i = 0; i < w; i += 4) b.fillRect(x + i, 118 - h - 3, 2, 3);
  b.fillStyle = '#f06a2b'; b.fillRect(x + (w >> 1), 118 - h + 6, 1, 3); b.fillStyle = '#0B090A';
}
tower(20, 18, 40); tower(60, 12, 62); tower(78, 26, 34); tower(120, 10, 50);
tower(196, 14, 58); tower(214, 30, 38); tower(262, 12, 70); tower(284, 22, 44);
b.fillRect(104, 100, 2, 18); b.fillRect(106, 96, 2, 22); // ruined spires

/* ===== original character: the Ashen Knight ===== */
function drawKnight(c, ox, oy, s = 1, t = 0) {
  c.save(); c.translate(ox, oy); c.scale(s, s);
  const r = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const sw = Math.round(Math.sin(t / 500) * 1.5);
  // cape (behind, sways)
  r(3 + sw, 13, 5, 13, '#7a1620'); r(2 + sw, 24, 3, 4, '#7a1620'); r(6 + sw, 26, 2, 3, '#B8202E');
  // greatsword
  r(19, 0, 2, 22, '#9aa0a8'); r(20, 0, 1, 22, '#d8dde3'); r(19, 0, 1, 1, '#d8dde3');
  r(16, 22, 8, 2, '#4a3a2a'); r(19, 24, 2, 4, '#5a3a2a'); r(19, 28, 2, 1, '#9aa0a8');
  // legs + boots
  r(9, 22, 3, 7, '#2c2c36'); r(13, 22, 3, 7, '#2c2c36');
  r(8, 28, 4, 3, '#1a1416'); r(13, 28, 4, 3, '#1a1416');
  // torso, belt, gem
  r(8, 12, 9, 10, '#3a3a46'); r(9, 13, 3, 4, '#6b6b7a'); r(8, 20, 9, 2, '#5a3a2a');
  r(12, 16, 2, 2, '#B8202E'); r(8, 12, 1, 8, '#a8321c');          // ember rim light
  // pauldrons
  r(6, 11, 4, 4, '#4a4a58'); r(15, 11, 4, 4, '#4a4a58'); r(6, 11, 4, 1, '#6b6b7a'); r(15, 11, 4, 1, '#6b6b7a');
  // sword arm + hand
  r(17, 15, 3, 3, '#3a3a46'); r(19, 17, 2, 3, '#5a3a2a');
  // horned helm
  r(9, 3, 7, 8, '#3a3a46'); r(10, 4, 2, 2, '#6b6b7a');
  r(8, 1, 1, 3, '#a69b9a'); r(7, 0, 1, 2, '#a69b9a'); r(16, 1, 1, 3, '#a69b9a'); r(17, 0, 1, 2, '#a69b9a');
  r(10, 7, 5, 1, '#0B090A'); r(11, 7, 1, 1, '#F06A2B'); r(14, 7, 1, 1, '#F06A2B');
  r(11, 11, 3, 1, '#2c2c36');
  c.restore();
}

function drawTorch(c, x, y, t) {
  c.fillStyle = 'rgba(240,106,43,.08)'; c.beginPath(); c.arc(x + 1, y - 4, 22, 0, 7); c.fill();
  c.fillStyle = '#3a2a1e'; c.fillRect(x, y, 2, 14);
  c.fillStyle = '#1a1416'; c.fillRect(x - 1, y, 4, 2);
  const f = Math.floor(t / 110) % 3;
  [['#B8202E', 7 + f, 5], ['#F06A2B', 5 + f, 3], ['#ffd36b', 3, 1]]
    .forEach(([col, h, w]) => { c.fillStyle = col; c.fillRect(x + 1 - (w >> 1), y - h, w, h); });
}

function drawScenery(t) {
  drawTorch(cx, 84, 108, t); drawTorch(cx, 236, 108, t);
  // sword planted in the ground
  cx.fillStyle = '#9aa0a8'; cx.fillRect(278, 100, 2, 28);
  cx.fillStyle = '#d8dde3'; cx.fillRect(279, 100, 1, 28);
  cx.fillStyle = '#4a3a2a'; cx.fillRect(273, 104, 12, 2);
  cx.fillStyle = '#1a1416'; cx.fillRect(272, 127, 14, 2);
  drawKnight(cx, 22, 80, 1.5, t);
}

function drawPortrait() {
  const cv = $('#portrait'); if (!cv) return;
  const c = cv.getContext('2d'); c.clearRect(0, 0, 26, 34);
  const g = c.createRadialGradient(13, 20, 2, 13, 20, 17);
  g.addColorStop(0, 'rgba(240,106,43,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, 26, 34);
  drawKnight(c, 1, 1, 1, 0);
}

const N = matchMedia('(max-width:760px)').matches ? 22 : 48;
const embers = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, v: .15 + Math.random() * .4, p: Math.random() * 6 }));
let last = 0;
function frame(t) {
  if (t - last > 70) {
    last = t; cx.drawImage(bgc, 0, 0);
    drawScenery(t);
    embers.forEach(e => {
      e.y -= e.v; e.x += Math.sin(t / 800 + e.p) * .2;
      if (e.y < 0) { e.y = H; e.x = Math.random() * W; }
      cx.fillStyle = `rgba(240,106,43,${(.35 + .5 * Math.abs(Math.sin(t / 500 + e.p))).toFixed(2)})`;
      cx.fillRect(e.x | 0, e.y | 0, 1, 1);
    });
  }
  requestAnimationFrame(frame);
}
cx.drawImage(bgc, 0, 0); drawScenery(0); if (!reduce) requestAnimationFrame(frame);

/* ===== pages ===== */
const view = $('#view');
const ph = t => `<span class="ph">[Add: ${esc(t)}]</span>`;

function pageMenu() {
  return `<h1 class="title glitch">ATHARV GUPTA</h1>
  <p class="sub">DEVELOPER // DIGITAL CREATOR</p>
  <ul class="menu" id="menu">
    ${[['about','ABOUT ME'],['projects','PROJECTS'],['skills','SKILLS'],['connect','CONNECT WITH ME']]
      .map(([k, l]) => `<li><a href="#/${k}">${icon(k)}${l}</a></li>`).join('')}
  </ul>`;
}

function pageAbout() {
  return `<h2 class="page-h">PLAYER PROFILE</h2>
  <div class="two">
    <aside class="panel profile">
      <div class="frame"><canvas id="portrait" class="portrait" width="26" height="34" aria-label="Pixel-art Ashen Knight"></canvas></div>
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
const pageProjects = () => `<h2 class="page-h">QUEST LOG</h2><div class="grid">${PROJECTS.map(projectCard).join('')}</div>`;

function pageProject(slug) {
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return `<h2 class="page-h">QUEST NOT FOUND</h2><a class="btn" href="#/projects">◀ BACK</a>`;
  const sec = (l, v) => `<div class="label">${l}</div><p>${/^\[Add/.test(v) ? `<span class="ph">${esc(v)}</span>` : esc(v)}</p>`;
  return `<h2 class="page-h">${esc(p.title)}</h2>
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

/* Only skills you've mentioned are listed. d: '' means "add how you used it". */
const SKILLS = {
  'Programming languages': [['Python','Used in CyberShield.'],['JavaScript','Used in this portfolio and Setu.'],['SQL',''],['HTML / CSS','Used to build this portfolio.']],
  'Frontend': [['React','Used in Setu.'],['Tailwind','Used in Setu.']],
  'Backend': [['Node.js','Used in Setu and this portfolio.'],['Express','Serves this portfolio; used in Setu.']],
  'Databases': [['MongoDB','Used in Setu.'],['SQL / SQLite','']],
  'AI & machine learning': [['ML classification','CyberShield uses a model trained on about 235,000 URLs.']],
  'Developer tools': [['Git & GitHub',''],['VS Code',''],['Vercel','Hosts this portfolio.']]
};
function pageSkills() {
  return `<h2 class="page-h">INVENTORY</h2><div class="inv">
  ${Object.entries(SKILLS).map(([cat, items]) => `<h3>${esc(cat.toUpperCase())}</h3>
    <div class="slots">${items.map(([n, d]) => `<button class="slot" aria-pressed="false" data-n="${esc(n)}" data-d="${esc(d)}">${icon('skills')}${esc(n)}</button>`).join('')}</div>`).join('')}
  </div><div class="panel detail" id="detail" aria-live="polite"><span class="ph">Select an item to inspect it.</span></div>`;
}

function pageConnect() {
  const link = (l, u) => u ? `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`
    : `<span class="btn ph">${l}: [Add link in ME in script.js]</span>`;
  return `<h2 class="page-h">START TRANSMISSION</h2>
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
  let html = pageMenu(), title = 'Atharv Gupta | Developer';
  if (page === 'projects' && id) { html = pageProject(id); title = 'Quest | Atharv Gupta'; }
  else if (PAGES[page]) { html = PAGES[page][0](); title = `${PAGES[page][1]} | Atharv Gupta`; }
  view.innerHTML = html; document.title = title;
  view.classList.remove('enter'); void view.offsetWidth; if (!reduce) view.classList.add('enter');
  const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; if (!reduce) f.classList.add('go');
  $('#home-link').hidden = !page;
  $('#foot').textContent = page ? 'ESC BACK · TAB / CLICK TO NAVIGATE' : '↑ ↓ MOVE · ENTER SELECT · ESC BACK';
  scrollTo(0, 0); blip(660);
  (page ? view : $('#menu a')).focus({ preventScroll: true });
  if (!page) $('#menu').addEventListener('mouseover', e => e.target.closest('a')?.focus());
  drawPortrait();
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
  if (e.target.matches('input,textarea')) return;
  const page = location.hash.replace(/^#\/?/, '').split('/');
  if (e.key === 'Escape' && page[0]) { location.hash = page[1] ? '#/projects' : '#/'; return; }
  if (!page[0] && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    const items = [...document.querySelectorAll('#menu a')], i = items.indexOf(document.activeElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); blip(520, .04);
  }
});