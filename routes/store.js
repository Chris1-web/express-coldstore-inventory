const express = require("express");
const router = express.Router();

const category_list = require("../controllers/categoryController");
const item_list = require("../controllers/itemController");

router.get("/", function (req, res) {
  res.redirect("/store/categories");
});

router.get("/categories", category_list.category_list);

router.get("/items", item_list.item_list);

module.exports = router;
