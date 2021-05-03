const path = require('path');
const express = require('express');

const app = express();
const port = 8282;

app.use('/', express.static(path.join(__dirname, "client")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.listen(port, '0.0.0.0', () => console.log(`Example app listening at http://localhost:${port}`))
