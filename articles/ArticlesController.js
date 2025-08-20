const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({ include: [Category] }).then((articles) => {
    res.render("admin/articles/index", { articles: articles });
  });
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/articles/save", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", (req, res) => {
  let id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({ where: { id: id } }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      //NaN
      res.redirect("/admin/articles");
    }
  } else {
    //NULL
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  let id = req.params.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.findByPk(id)
        .then((article) => {
          if (article) {
            Category.findAll().then((categories) => {
              res.render("admin/articles/edit", {
                article: article,
                categories: categories,
              });
            });
          } else {
            res.redirect("/admin/articles");
          }
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
          res.redirect("/admin/articles");
        });
    } else {
      //NAN
      res.redirect("/admin/articles");
    }
  } else {
    //NULL
    res.redirect("/admin/articles");
  }
});

router.post("/articles/update", (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  if (id != undefined && title != undefined) {
    if (!isNaN(id)) {
      Article.update(
        {
          title: title,
          slug: slugify(title),
          body: body,
          categoryId: category,
        },
        { where: { id: id } }
      )
        .then(() => {
          res.redirect("/admin/articles");
        })
        .catch((error) => {
          console.error("Error updating article:", error);
          res.redirect("/admin/articles");
        });
    } else {
      //NaN
      res.redirect("/admin/articles");
    }
  } else {
    //NULL
    res.redirect("/admin/articles");
  }
});

router.get("/articles/page/:num", (req, res) => {
  let page = req.params.num;
  let limit = 4;
  if(isNaN(page) || page == 1) {
    offset = 0;
  }else {
    offset = parseInt(page) * 4;
  }

  Article.findAndCountAll({
    limit: limit,
    offset: offset,
    include: [Category],
  }).then((result) => {
    let totalPages = Math.ceil(result.count / limit);
    res.render("articles/index", {
      articles: result.rows,
      currentPage: page,
      totalPages: totalPages,
    });
  });
});

module.exports = router;
