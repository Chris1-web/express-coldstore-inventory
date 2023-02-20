const Category = require("../models/category");

// Displays list of all categories
exports.category_list = (req, res, next) => {
  Category.find({}).exec(function (err, categories_list) {
    if (err) return next(err);
    // Successful, so render
    console.log(categories_list);
    res.render("categories", { title: "Categories", categories_list });
  });
};

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Create Category get page");
};

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Create Category post page");
};

exports.category_detail = (req, res) => {
  const { categoryId } = req.params;
  console.log(categoryId);
};
