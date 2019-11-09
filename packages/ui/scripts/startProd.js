const express = require('express');
const fs = require('fs');
const https = require('https');
const config = require('config');
const app = express();
const port = config.get('frontEndPort');

app.use(express.static('dist'));

if(config.get('apiSSL')) {
  https.createServer({
    key: fs.readFileSync(config.get('apiSSLKeyFile')),
    cert: fs.readFileSync(config.get('apiSSLCertFile')),
  }, app).listen(port, () => console.log(`Front end server listening on port ${port}!`));
} else {
  app.listen(port, () => console.log(`Front end server listening on port ${port}!`));
}