const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");

// Display list of all items
exports.item_list = (req, res, next) => {
  async.parallel(
    {
      items_list(callback) {
        Item.find({}).populate("category", "name").exec(callback);
      },
      categories_list(callback) {
        Category.find({}, "name").exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      function checkCategoryID() {
        return "hello world";
      }
      res.render("items", {
        title: "Items",
        items_list: results.items_list,
        categories_list: results.categories_list,
        category_id: checkCategoryID,
      });
    }
  );
};

exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Create item get page");
};

exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Create item post page");
};

exports.item_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: single item detail");
};
