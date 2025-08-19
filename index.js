const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articleController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

// View Engine
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));

//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DataBase
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar-se ao banco de dados:", error);
  });


app.use("/", categoriesController);
app.use("/", articleController);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log(`Server rodando!`);
});
