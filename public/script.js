// ----- Theme toggle (remembers your choice) -----
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (systemDark ? 'dark' : 'light'));

toggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ----- Typing effect -----
const words = ['full-stack web apps', 'explainable software', 'things that solve real problems'];
const typedEl = document.getElementById('typed');
let wordIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = words[wordIndex];
  typedEl.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex === word.length) {
    deleting = true;
    return setTimeout(type, 1500);
  }
  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }
  charIndex += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 80);
}
type();

// ----- Scroll reveal -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ----- Projects: load from API, build filters -----
const grid = document.getElementById('projects-grid');
const filtersEl = document.getElementById('filters');
let allProjects = [];

function renderProjects(list) {
  grid.innerHTML = list.map(p => `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <a href="${p.link}" target="_blank" rel="noopener">View on GitHub →</a>
    </div>
  `).join('');
}

function renderFilters() {
  const tags = ['All', ...new Set(allProjects.flatMap(p => p.tags || []))];
  filtersEl.innerHTML = tags.map((t, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.tag;
    renderProjects(tag === 'All' ? allProjects : allProjects.filter(p => (p.tags || []).includes(tag)));
  });
}

fetch('/api/projects')
  .then(res => res.json())
  .then(projects => {
    allProjects = projects;
    renderFilters();
    renderProjects(allProjects);
  })
  .catch(() => {
    grid.innerHTML = '<p>Could not load projects right now.</p>';
  });