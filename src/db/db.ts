import knex from 'knex';

export const db = knex({
  client: 'mysql2',
  connection: {
    port: 3306,
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'mydatabase',
  },
});
