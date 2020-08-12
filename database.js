var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./sqlite3/mydb.sqlite", 
     database : 'users'
  },
    useNullAsDefault: true
});

module.exports = knex;