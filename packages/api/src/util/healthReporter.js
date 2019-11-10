import { promisify, callbackify } from 'util';
import request from 'request';
import config from 'config';
import { getDB } from "../broker/database";
import fs from 'fs';

const db = getDB();

const STATUS = {
  UP: 'UP',
  DOWN: 'DOWN',
  UNKNOWN: 'UNKNOWN',
  IMPAIRED: 'IMPAIRED',
};

let instance = null;

class HealthReporter {
  constructor() {
    this.health = {
      mysql: STATUS.UNKNOWN,
      backend: STATUS.UNKNOWN,
      frontend: STATUS.UNKNOWN,
    };

    this.collectors = {
      mysql: {
        poll: async function () {
          try {
            await db.ping();
            this.health.mysql = STATUS.UP;
          } catch (error) {
            console.log('mysql ping error', error);
            this.health.mysql = STATUS.DOWN;
          }
        },
      },
      backend: {
        poll: async function () {
          try {
            const ssl = config.get('apiSSL');
            const options = {
              url: `http${ssl ? 's' : ''}://${config.get('apiHost')}:${config.get('apiPort')}`,
              ...(ssl && {
                agentOptions: {
                  key: fs.readFileSync(config.get('apiSSLKeyFile')),
                  cert: fs.readFileSync(config.get('apiSSLCertFile')),
                  passphrase: config.get('apiSSLKeyPassphrase'),
                  securityOptions: 'SSL_OP_NO_SSLv3'
                },
              }),
            };
            const response = await promisify(request)(options);

            if (response.statusCode && response.statusCode === 200) {
              this.health.backend = STATUS.UP;
            } else {
              this.health.backend = STATUS.IMPAIRED;
            }
          } catch (error) {
            console.log('Error pinging backend', error.message);
            this.health.backend = STATUS.DOWN;
          }
        }
      },
      frontend: {
        poll: async function () {
          try {
            const ssl = config.get('apiSSL');
            const options = {
              url: `http${ssl ? 's' : ''}://${config.get('frontEndUrl')}:${config.get('frontEndPort')}`,
              ...(ssl && {
                key: fs.readFileSync(config.get('apiSSLKeyFile')),
                cert: fs.readFileSync(config.get('apiSSLCertFile')),
                passphrase: config.get('apiSSLKeyPassphrase'),
              }),
            };
            const response = await promisify(request)(options);

            if (response.statusCode && response.statusCode === 200) {
              this.health.frontend = STATUS.UP;
            } else {
              this.health.frontend = STATUS.IMPAIRED;
            }
          } catch (error) {
            console.log('Error pinging frontend', error.message);
            this.health.frontend = STATUS.DOWN;
          }
        }
      },
    };
  }

  getHealth() {
    return this.health;
  }

  async start() {
    setInterval(this.collect.bind(this), 10000)
  }

  async collect() {
    await
      Promise.all(
        Object.entries(this.collectors)
          .map(([key, { poll }]) => poll.call(this)));
  }
}

async function

getHealthReporter() {
  if (instance) {
    return instance;
  } else {
    instance = new HealthReporter();

    await
      instance.start();

    return instance;
  }
}

export {
  getHealthReporter
  ,
}