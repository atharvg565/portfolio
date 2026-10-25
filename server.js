const express = require('express');
const path = require('path');
const projects = require('./projects.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});