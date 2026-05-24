const dns = require("dns");
const { URL } = require("url");

let urls = [];
let counter = 1;

module.exports = function (req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  const originalUrl = req.body.url;

  let parsedUrl;

  try {
    parsedUrl = new URL(originalUrl);
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(parsedUrl.hostname, (err) => {

    if (err) {
      return res.json({ error: "invalid url" });
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

};