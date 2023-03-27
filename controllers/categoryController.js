const async = require("async");
const Category = require("../models/category");
const Item = require("../models/item");
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
exports.category_update_get = (req, res, next) => {
  const { categoryId } = req.params;
  async.parallel(
    {
      category(callback) {
        Category.findById(categoryId).exec(callback);
      },
    },
    (error, results) => {
      if (error) return next(err);
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
      Category.findById(categoryId).exec((errors, results) => {
        res.render("category_form", {
          title: "Edit Category",
          category: results.category,
          errors: errors.array(),
        });
      });
      return;
    }
    // if there are no errors, data form is valid. Update the record
    Category.findByIdAndUpdate(categoryId, category, {}, (err, thecategory) => {
      if (err) return next(err);
      // successful, so redirect
      res.redirect(category.url);
    });
  },
];

exports.category_delete_get = (req, res, next) => {
  const { categoryId } = req.params;
  async.parallel(
    {
      items(callback) {
        Item.find({ category: categoryId }).populate("category").exec(callback);
      },
      category(callback) {
        Category.findById(categoryId).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.items.length === 0) {
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
        });
      }
      if (results.items.length > 0) {
        res.render("category_delete", {
          title: "Delete Category",
          items: results.items,
          category: results.category,
        });
      }
    }
  );
};

exports.category_delete_post = (req, res, next) => {
  const { categoryId } = req.params;
  Category.findByIdAndRemove(categoryId, (err) => {
    if (err) return next(err);
    // successful, so redirect
    res.redirect(`/store/categories`);
  });
};
