#! /usr/bin/env node

console.log(
  "This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Category = require("./models/category");
const Item = require("./models/item");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const categories = [];
const items = [];

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(category, name, price, summary, numberInStock, cb) {
  const item = new Item({ category, name, price, summary, numberInStock });
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate(
          "Chicken",
          "The chicken is a domesticated junglefowl species, with attributes of wild species such as the grey and the Ceylon junglefowl that are originally from Southeastern Asia. Rooster or cock is a term for an adult male bird, and a younger male may be called a cockerel",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Turkey",
          "Turkey meat, commonly referred to as just turkey, is the meat from turkeys, typically domesticated turkeys but also wild turkeys",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Fish",
          "Fish are aquatic, craniate, gill-bearing animals that lack limbs with digits. Included in this definition are the living hagfish, lampreys, and cartilaginous and bony fish as well as constious extinct related groups",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Decapod",
          "The Decapoda or decapods are an order of crustaceans within the class Malacostraca, including many familiar groups, such as crabs, lobsters, crayfish, shrimp and prawns. Most decapods are scavengers..",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          categories[0],
          "Gizzard",
          50,
          "An organ found in the digestive tract of a chicken that helps it digest food. It is also referred to as the ventriculus, gastric mill, and gigerium. It contains approximately 80% Cholesterol and 36% protein",
          100,
          callback
        );
      },
      function (callback) {
        itemCreate(
          categories[0],
          "Wings",
          20,
          "Chicken wings are white meat; They're juicier and have a more concentrated poultry flavor, like dark meat. Many people think of Buffalo wings when they think of this part of the chicken",
          75,
          callback
        );
      },
      function (callback) {
        itemCreate(
          categories[1],
          "Wings",
          100,
          "Turkey wings have all the flavor of whole roast turkey without having to cooking an entire bird or wait for Thanksgiving. This is the most popular type of Turkey",
          60,
          callback
        );
      },
      function (callback) {
        itemCreate(
          categories[2],
          "Titus",
          30,
          "The Mackerel or Titus fish as it is commonly called, is one of Nigeria’s most popular fish. It's clear dark wavy design and moist taste puts it in a class of its own",
          300,
          callback
        );
      },
      function (callback) {
        itemCreate(
          categories[2],
          "Red Pacu.",
          150,
          "Piaractus brachypomus, the pirapitinga, is a large species of pacu, a close relative of piranhas and silver dollars, in the serrasalmid family",
          30,
          callback
        );
      },
      function (callback) {
        itemCreate(
          categories[3],
          "Shrimp",
          30,
          "Shrimps are small shellfish with long tails and many leg. They play important roles in the food chain and are an important food source for larger animals ranging from fish to whales.",
          100,
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + categories, items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
