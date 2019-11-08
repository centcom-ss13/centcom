const express = require('express');
const config = require('config');
const app = express();
const port = config.get('frontEndPort');

app.use(express.static('dist'));

app.listen(port, () => console.log(`Front end server listening on port ${port}!`));