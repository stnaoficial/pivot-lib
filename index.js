const express = require('express');
const path = require('path');

const app  = express();
const port = 8000;

app.use(express.static("src/assets"));

app.use(express.static("public/"));

app.listen({ port }, () => {
  console.log(`Server started at http://0.0.0.0:${port}.`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
  res.status(200);
});