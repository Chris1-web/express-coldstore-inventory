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
      res.render("items", {
        title: "Items",
        items_list: results.items_list,
        categories_list: results.categories_list,
      });
    }
  );
};

exports.item_create_get = (req, res) => {
  async.parallel(
    {
      categories_list(callback) {
        Category.find({}, "name").exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("item_form", {
        title: "Create New Item",
        categories_list: results.categories_list,
      });
    }
  );
};

exports.item_create_post = (req, res) => {
  const { item_name, item_summary, chosen_category, stock_number, price } =
    req.body;
  async.parallel(
    {
      item(callback) {
        Item.find({ name: item_name.trim(), category: chosen_category }).exec(
          callback
        );
      },
    },
    (err, results) => {
      // if item with exact category exists, redirect to existing page detail
      if (results.item.length !== 0) {
        res.redirect(`/store/item/${results.item[0].category}`);
        return;
      }
      // if item does with exact category doesn't exit, create a new item
    }
  );
};

exports.item_detail = (req, res, next) => {
  const { categoryId } = req.params;
  async.parallel(
    {
      filtered_items_list(callback) {
        Item.find({ category: categoryId })
          .populate("category", "name")
          .exec(callback);
      },
      categories_list(callback) {
        Category.find({}, "name").exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      // console.log(results);
      res.render("items", {
        category_id: categoryId,
        categories_list: results.categories_list,
        filtered_items_list: results.filtered_items_list,
      });
    }
  );
};

exports.item_detail_post = (req, res, next) => {
  const { category } = req.body;
  if (category === "all") {
    res.redirect("/store/items");
  } else {
    res.redirect(`/store/item/${category}`);
  }
};
