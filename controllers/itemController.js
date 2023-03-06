const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

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

exports.item_create_post = [
  body("item_name", "Item Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_summary", "Item Summary is required")
    .trim()
    .isLength({ min: 20 })
    .escape(),
  body("stock_number", "A Number is required").isInt({ min: 1 }).escape(),
  body("chosen_category", "A Category is required").escape(),
  body("price", "An Item must be priced").isInt({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      category: req.body.chosen_category,
      name: req.body.item_name,
      price: req.body.price,
      summary: req.body.item_summary,
      numberInStock: req.body.stock_number,
    });

    // if errors is not empty
    if (!errors.isEmpty()) {
      // get all categories for form
      Category.find({}).exec((err, categories_list) => {
        if (err) return next(err);
        res.render("item_form", {
          title: "New Item",
          categories_list,
          errors: errors.array(),
        });
        return;
      });
    }

    // if Errors is empty, check if same item exists in the same category, if so, redirect to item detail page else create new item
    Item.findOne({
      name: req.body.item_name,
      category: req.body.chosen_category,
    }).exec((err, found_item) => {
      if (err) return next(err);
      if (found_item) {
        res.redirect(`/store/item/${found_item.category}`);
        return;
      } else {
        item.save((err) => {
          if (err) return next(err);
          // successful, so redirect
          res.redirect(`/store/item/${item.category}`);
        });
      }
    });
  },
];

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
