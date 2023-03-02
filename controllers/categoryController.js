const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

// Displays list of all categories
exports.category_list = (req, res, next) => {
  Category.find({}).exec(function (err, categories_list) {
    if (err) return next(err);
    // Successful, so render
    res.render("categories", { title: "Categories", categories_list });
  });
};

exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "Add Category" });
};

exports.category_create_post = [
  // validate and sanitize
  body("name", "Category Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description is required")
    .trim()
    .isLength({ min: 100 })
    .escape(),
  // process request after validation and santization
  (req, res, next) => {
    // extract validation errors from the request
    const errors = validationResult(req);
    // // create a category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    // if there are errors
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add Category",
        errors: errors.array(),
      });
      return;
    }
    Category.findOne({ name: req.body.name }).exec((err, found_category) => {
      if (err) {
        return next(err);
      }
      if (found_category) {
        // Genre exists, redirect to its detail page.
        res.redirect(found_category.url);
      } else {
        category.save((err) => {
          if (err) {
            return next(err);
          }
          // Genre saved. Redirect to genre detail page.
          res.redirect(category.url);
        });
      }
    });
  },
];

exports.category_detail = (req, res, next) => {
  const { categoryId } = req.params;
  Category.findById(categoryId).exec(function (err, category) {
    if (err) return next(err);
    res.render("categories", { category });
  });
};
