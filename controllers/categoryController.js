const Category = require("../models/category");

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

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Create Category post page");
};

exports.category_detail = (req, res, next) => {
  const { categoryId } = req.params;
  Category.findById(categoryId).exec(function (err, category) {
    if (err) return next(err);
    res.render("categories", { category });
  });
};
