const sequelize = require('sequelize')

const connection = new sequelize('blogdb', 'root', 'Senha123', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;
