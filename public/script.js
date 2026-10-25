fetch('/api/projects')
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById('projects');
    container.innerHTML = projects.map(p => `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank">View on GitHub</a>
      </div>
    `).join('');
  });