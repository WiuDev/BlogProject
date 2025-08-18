const express =  require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  }) 
  .catch((error) => {
    console.error('Erro ao conectar-se ao banco de dados:', error);
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080, () => {
  console.log(`Server rodando!`);
});