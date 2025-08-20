const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.get("/admin/categories", (req, res) => {
  Category.findAll()
    .then((categories) => {
      res.render("admin/categories/index", { categories: categories });
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      res.redirect("/");
    });
});

router.post("/categories/save", (req, res) => {
  let title = req.body.title;
  if (title != undefined) {
    Category.create({ title: title, slug: slugify(title) }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.post("/categories/delete", (req, res) => {
  let id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({ where: { id: id } }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      //NaN
      res.redirect("/admin/categories");
    }
  } else {
    //NULL
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", (req, res) => {
  let id = req.params.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.findByPk(id)
        .then((category) => {
          if (category) {
            res.render("admin/categories/edit", { category: category });
          } else {
            res.redirect("/admin/categories");
          }
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          res.redirect("/admin/categories");
        });
    } else {
      //NAN
      res.redirect("/admin/categories");
    }
  } else {
    //NULL
    res.redirect("/admin/categories");
  }
});

router.post("/categories/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    if (id != undefined && title != undefined) {
        if (!isNaN(id)) {
            Category.update({ title: title, slug: slugify(title) }, { where: { id: id } })
                .then(() => {
                    res.redirect("/admin/categories");
                });
        } else {
            //NaN
            res.redirect("/admin/categories");
        }
    } else {
        //NULL
        res.redirect("/admin/categories");
    }
});

module.exports = router;
