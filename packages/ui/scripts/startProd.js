const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const config = require('config');
const httpsRedirect = require('express-https-redirect');
const main = express();
const port = config.get('frontEndPort');


if(config.get('frontEndSSL')) {
  https.createServer({
    key: fs.readFileSync(config.get('apiSSLKeyFile'), 'utf8'),
    cert: fs.readFileSync(config.get('apiSSLCertFile'), 'utf8'),
    passphrase: config.get('apiSSLKeyPassphrase'),
  }, main).listen(port, () => console.log(`Front end https server listening on port ${port}!`));

  const redirect = express();
  redirect.use(httpsRedirect(true));
  http.createServer(redirect).listen(80, () => console.log(`Front end http redirect server listening on port 80!`));
} else {
  main.listen(port, () => console.log(`Front end http server listening on port ${port}!`));
}

main.use(express.static(path.join(__dirname+'/../dist'), {'index': ['index.html']}));

main.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});