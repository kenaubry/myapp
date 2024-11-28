const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || 'Bienvenue sur mon application Node.js !';

app.get('/', (req, res) => {
  res.send(`<h1>${message}</h1>`);
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
