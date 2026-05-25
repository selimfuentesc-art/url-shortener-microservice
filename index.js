require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

// Página principal
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Base de datos temporal
let urls = [];
let counter = 1;

// Crear URL corta
app.post('/api/shorturl', function(req, res) {

  const originalUrl = req.body.url;

  let parsedUrl;

  try {
    parsedUrl = new URL(originalUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Validar protocolo
  if (
    parsedUrl.protocol !== 'http:' &&
    parsedUrl.protocol !== 'https:'
  ) {
    return res.json({ error: 'invalid url' });
  }

  // Validar dominio
  dns.lookup(parsedUrl.hostname, (err) => {

    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = counter++;

    urls.push({
      original_url: originalUrl,
      short_url: shortUrl
    });

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });

  });

});

// Redirección
app.get('/api/shorturl/:short_url', function(req, res) {

  const shortUrl = parseInt(req.params.short_url);

  const found = urls.find(
    item => item.short_url === shortUrl
  );

  if (!found) {
    return res.json({
      error: 'No short URL found'
    });
  }

  res.redirect(found.original_url);

});

module.exports = app;