// Displays list of all categories
exports.category_list = (req, res) => {
  res.render("categories");
};

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Create Category get page");
};

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Create Category post page");
};

exports.category_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: single category detail");
};
