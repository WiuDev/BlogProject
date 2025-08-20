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
  Article.findAll({ order: [["id", "DESC"]] })
    .then((articles) => {
      Category.findAll().then((categories) => {
        res.render("index", { articles: articles, categories: categories });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar artigos:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

app.get("/:slug", (req, res) => {
  let slug = req.params.slug;

  Article.findOne({ where: { slug } })
    .then((article) => {
      if (!article) {
        return res.status(404).send("Artigo não encontrado");
      }
      Category.findAll().then((categories) => {
        res.render("article", { article: article, categories: categories });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar artigo:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

app.get("/categories/:slug", (req, res) => {
  let slug = req.params.slug;

  Category.findOne({ where: { slug }, include: [{ model: Article }] })
    .then((category) => {
      if (!category) {
        return res.status(404).send("Categoria não encontrada");
      }
      Category.findAll().then((categories) => {
        res.render("index", {
          articles: category.articles,
          categories: categories,
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar categoria:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

app.listen(8080, () => {
  console.log(`Server rodando!`);
});
