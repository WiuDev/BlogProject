const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({ include: [Category] }).then((articles) => {
    res.render("admin/articles/index", { articles: articles });
  });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/articles/save", adminAuth,(req, res) => {
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

router.post("/articles/delete", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
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

router.post("/articles/update", adminAuth,(req, res) => {
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
  let page = parseInt(req.params.num);
  let limit = 4;
  let offset;
  if (isNaN(page) || page === 1) {
    offset = 0;
  } else {
    offset = (page - 1) * limit;
  }
  Article.findAndCountAll({
    limit: limit,
    offset: offset,
    order: [["id", "DESC"]]
  }).then((articles) => {
    let next;
    if (offset + limit >= articles.count) {
      next = false;
    } else {
      next = true;
    }
    let result = {
      page: page,
      next: next,
      articles: articles,
    };
    Category.findAll().then((categories) => {
      res.render("admin/articles/page", {
        result: result,
        categories: categories
      });
    });
  });
});

module.exports = router;
