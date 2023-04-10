const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");
// options for multer
const multer = require("multer");
const Image = require("../models/image");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  upload.single("item_image"),
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

    // create image model
    const itemImage = new Image({
      fileName: req.file.originalname,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const item = new Item({
      category: req.body.chosen_category,
      image: itemImage._id,
      name: req.body.item_name,
      price: req.body.price,
      summary: req.body.item_summary,
      numberInStock: req.body.stock_number,
    });

    // if there is an error, rerender form with errors
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

    // if there is no error, check if same item exists in the same category, if so, redirect to item detail page else create new item
    Item.findOne({
      name: req.body.item_name,
      category: req.body.chosen_category,
    }).exec((err, found_item) => {
      if (err) return next(err);
      if (found_item) {
        res.redirect(`/store/item/${found_item.category}`);
        return;
      } else {
        // save item image
        itemImage.save((err) => {
          if (err) return next(err);
        });
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
      res.render("items", {
        title: "search",
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

exports.item_update_get = (req, res, next) => {
  const { itemId } = req.params;
  async.parallel(
    {
      item_detail(callback) {
        Item.findById(itemId).exec(callback);
      },
      category_list(callback) {
        Category.find({}).exec(callback);
      },
    },
    (error, results) => {
      if (error) return next(error);
      // select item category
      for (const category of results.category_list) {
        if (
          results.item_detail.category.toString() === category._id.toString()
        ) {
          category.checked = "true";
        }
      }
      res.render("item_form", {
        title: "Update Item",
        categories_list: results.category_list,
        item_detail: results.item_detail,
      });
    }
  );
};

exports.item_update_post = [
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
    const { itemId } = req.params;
    // get validator errors
    const errors = validationResult(req);
    // create an item with trimmed and escaped form data
    const item = new Item({
      _id: itemId,
      category: req.body.chosen_category,
      name: req.body.item_name,
      price: req.body.price,
      summary: req.body.item_summary,
      numberInStock: req.body.stock_number,
    });

    // if there are errors in the form
    if (!errors.isEmpty()) {
      // find item and list categories
      async.parallel(
        {
          item_detail(callback) {
            Item.findById(itemId).exec(callback);
          },
          category_list(callback) {
            Category.find({}).exec(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);
          // select item category
          for (const category of results.category_list) {
            if (
              results.item_detail.category.toString() ===
              category._id.toString()
            ) {
              category.checked = "true";
            }
          }
          res.render("item_form", {
            title: "Update Item",
            categories_list: results.category_list,
            item_detail: results.item_detail,
            errors: errors.array(),
          });
          return;
        }
      );
    }

    // if there are no errors, find item and update
    Item.findByIdAndUpdate(itemId, item, {}, (err, newItem) => {
      if (err) return next(err);
      // successful, so redirect
      res.redirect(`/store/item/${newItem.category}`);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .populate("category", "name")
    .exec(function (err, found_item) {
      if (err) return next(err);
      res.render("item_delete", { title: "Delete Item", item: found_item });
    });
};

exports.item_delete_post = (req, res, next) => {
  const { itemId } = req.params;
  Item.findByIdAndRemove(itemId, (err) => {
    if (err) return next(err);
    // Success so redirect
    res.redirect("/store/items");
  });
};
