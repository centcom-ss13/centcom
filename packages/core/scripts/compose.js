const shell = require('shelljs');
const config = require('config');


const safeConfigGet = (key) => {
  try {
    return config.get(key);
  } catch(e) {
    return undefined;
  }
};

const environment = {
  CENTCOM_API_SSL: safeConfigGet('apiSSL'),
  CENTCOM_API_PORT: safeConfigGet('apiPort'),
  CENTCOM_API_HOST: safeConfigGet('apiHost'),
  CENTCOM_DEBUG: safeConfigGet('debug'),
  CENTCOM_DB_DATABASE: safeConfigGet('databaseDb'),
  CENTCOM_DB_HOST: safeConfigGet('databaseUrl'),
  CENTCOM_DB_PASSWORD: safeConfigGet('databasePassword'),
  CENTCOM_DB_PORT: safeConfigGet('databasePort'),
  CENTCOM_DB_USER: safeConfigGet('databaseUsername'),
  CENTCOM_FRONT_END_PORT: safeConfigGet('frontEndPort'),
  CENTCOM_FRONT_END_SSL: safeConfigGet('frontEndSSL'),
  CENTCOM_FRONT_END_URL: safeConfigGet('frontEndUrl'),
  CENTCOM_SSL_CERT_FILE: safeConfigGet('apiSSLCertFile'),
  CENTCOM_SSL_KEY_FILE: safeConfigGet('apiSSLKeyFile'),
  CENTCOM_SSL_KEY_PASSPHRASE: safeConfigGet('apiSSLKeyPassphrase'),
};

Object.entries(environment).forEach(([key, value]) => {
  shell.env[key] = value;
});

shell.exec('cp ./node_modules/@centcom/ui/* ./docker/buildUI -Rf');
shell.exec('cp ./node_modules/@centcom/server/* ./docker/api -Rf');
shell.exec('cp ./config ./docker/api -Rf');

shell.exec('sudo docker-compose down');
shell.exec('sudo docker-compose pull');
shell.exec('sudo docker-compose build --no-cache');
shell.exec('sudo docker-compose up -d --force-recreate');