const sequelize = require('sequelize')

const connection = new sequelize('blogdb', 'root', 'Senha123', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;
