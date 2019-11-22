const mysql = require('mysql');
const config = require('config');
const { promisify } = require('util');

async function main() {
  const con = mysql.createConnection({
    host: config.get('databaseUrl'),
    user: config.get('databaseUsername'),
    password: config.get('databasePassword'),
  });

  const dbName = config.get('databaseDb');
  con.connect();
  console.log('@centcom/core - Connected.');
  try {
    await promisify(con.query.bind(con))(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`@centcom/core - Created database ${dbName}.`);
  } catch (e) {
    console.log(`@centcom/core - Error creating database ${dbName}`);
    con.end();
    console.log(e);
    process.exit(1);
  }

  con.end();
}

console.log('@centcom/core - Initializing connection to database.');
main();