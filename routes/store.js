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
router.get(
  "/category/:categoryId/update",
  category_controller.category_update_get
);
router.post(
  "/category/:categoryId/update",
  category_controller.category_update_post
);
router.get(
  "/category/:categoryId/delete",
  category_controller.category_delete_get
);
router.post(
  "/category/:categoryId/delete",
  category_controller.category_delete_post
);

// Items Routes
router.get("/items", item_controller.item_list);
router.post("/item", item_controller.item_detail_post); //for filter search in items list
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);
router.get("/item/:categoryId", item_controller.item_detail); // to get items with particular categories
router.get("/item/:itemId/update", item_controller.item_update_get);
router.post("/item/:itemId/update", item_controller.item_update_post);
router.get("/item/:itemId/delete", item_controller.item_delete_get);
router.post("/item/:itemId/delete", item_controller.item_delete_post);

module.exports = router;
