import Hapi from '@hapi/hapi';
import config from 'config';
import fs from 'fs';
import * as controllers from './controller';
import { getHealthReporter } from './util/healthReporter';
import UserService from './service/users';
import { generate as generatePassword } from 'generate-password';

function registerRoute(server, route) {
  console.log(`Registering Route: ${route.method} ${route.path}`);
  server.route(route);
}

function addControllers(server) {
  Object.values(controllers)
    .forEach(controller => controller
      .forEach(route => registerRoute(server, route)));
}

function isDefaultPort(ssl, port) {
  return (ssl && port === 443) || (!ssl && port === 80);
}
async function init() {
  const host = config.get('apiHost');

  const server = Hapi.server({
    port: config.get('apiPort'),
    ...(host && { host }),
    routes: {
      cors: {
        origin: [`${config.get('frontEndSSL') ? 'https' : 'http'}://${config.get('frontEndUrl')}${
          isDefaultPort(config.get('frontEndSSL'), config.get('frontEndPort')) ?
          '' :
          `:${config.get('frontEndPort')}`}`
        ],
        headers: ["Accept", "Content-Type"],
        additionalHeaders: ["X-Requested-With"],
        credentials: true,
      },
    },
    ...(config.get('apiSSL') && { tls: {
      key: fs.readFileSync(config.get('apiSSLKeyFile')),
      cert: fs.readFileSync(config.get('apiSSLCertFile')),
      passphrase: config.get('apiSSLKeyPassphrase'),
    } }),
    ...(config.get('debug') && { debug: { request: ['error'] } }),
  });

  await server.register(require('@hapi/cookie'));

  const cookiePassword = generatePassword({
    length: 32,
    numbers: true
  });

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'centcom-auth',
      password: cookiePassword,
      isSecure: config.get('apiSSL'),
    },
    validateFunc: async (request, session) => {
      if(!session.id) {
        return { valid: false };
      }

      try {
        const user = UserService.getUser(session.id);

        if(!user) {
          return { valid: false };
        }

        return { valid: true, credentials: user };
      } catch(e) {
        return { valid: false };
      }
    }
  });

  server.auth.default('session');

  addControllers(server);

  await server.start();

  const healthReporter = await getHealthReporter();
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();