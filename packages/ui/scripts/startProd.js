const express = require('express');
const fs = require('fs');
const https = require('https');
const config = require('config');
const app = express();
const port = config.get('frontEndPort');

app.use(express.static(`${__dirname}../dist`));

if(config.get('frontEndSSL')) {
  https.createServer({
    key: fs.readFileSync(config.get('apiSSLKeyFile'), 'utf8'),
    cert: fs.readFileSync(config.get('apiSSLCertFile'), 'utf8'),
    passphrase: config.get('apiSSLKeyPassphrase'),
  }, app).listen(port, () => console.log(`Front end https server listening on port ${port}!`));
} else {
  app.listen(port, () => console.log(`Front end http server listening on port ${port}!`));
}