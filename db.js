// db.js
const { Client } = require('pg');

const client = new Client({
  user: 'dew',         
  host: 'localhost',        
  database: 'contactos_db',
  password: 'salchipapa',   
  port: 5432,               
});

client.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar:', err));

module.exports = client;

