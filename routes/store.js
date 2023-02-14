const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

router.get("/", function (req, res) {
  res.redirect("/store/categories");
});

// Categories Routes
router.get("/categories", category_controller.category_list);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:categoryId", category_controller.category_detail);

// Items Routes
router.get("/items", item_controller.item_list);
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);
router.get("/item/:itemId", item_controller.item_detail);

module.exports = router;
