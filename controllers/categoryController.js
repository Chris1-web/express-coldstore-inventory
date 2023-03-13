const async = require("async");
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

// display chosen category form with input
exports.category_update_get = (req, res) => {
  const { categoryId } = req.params;
  async.parallel(
    {
      category(callback) {
        Category.findById(categoryId).exec(callback);
      },
    },
    (error, results) => {
      res.render("category_form", {
        title: "Edit Category",
        category: results.category,
      });
    }
  );
};

exports.category_update_post = [
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
    const { categoryId } = req.params;
    const errors = validationResult(req);
    // create a category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: categoryId,
    });
    // if there are errors, redisplay the form with errors
    if (!errors.isEmpty()) {
      async.parallel(
        {
          category(callback) {
            Category.findById(categoryId).exec(callback);
          },
        },
        (errors, results) => {
          res.render("category_form", {
            title: "Edit Category",
            category: results.category,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    console.log(req.body);
    // if there are no errors, data form is valid. Update the record
    Category.findByIdAndUpdate(categoryId, category, {}, (err, thecategory) => {
      if (err) return next(err);
      // successful, so redirect
      res.redirect(category.url);
    });
  },
];
