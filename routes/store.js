const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/store/categories");
});

router.get("/categories", function (req, res) {
  res.send("GET CATEGORIES Route: categories");
});

router.get("/items", function (req, res) {
  res.send("GET ITEMS Route: Items");
});

module.exports = router;
