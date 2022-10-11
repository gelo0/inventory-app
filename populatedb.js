#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });

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

function itemCreate(name, description, category, price, in_stock, cb) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    in_stock: in_stock,
  };

  var item = new Item(itemdetail);
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
  async.series(
    [
      function (callback) {
        categoryCreate(
          "CORDLESS CIRCULAR SAWS",
          "Show me 22V and 36V cordless circular saws designed for performing light- and heavy-duty cutting in metal, wood and wood composites",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CORDLESS RECIPROCATING SAWS",
          "Show me 22V and 36V cordless reciprocating saws designed for performing light- and heavy-duty demolition in metal, wood and wood composites",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CORDLESS JIG SAWS",
          "Show me 22V cordless jig saws designed for performance and user comfort when cutting in metal and wood",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CORDLESS BAND SAWS",
          "Show me 22V cordless band saws designed for performing cutting a wide range of materials",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CORDLESS CUT-OUT SAWS",
          "Show me 22V cordless cut-out saws designed for performance in cutting drywall",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CORDLESS SHEARS AND NIBBLERS",
          "Show me 22V sheet metal shears and nibblers for faster cutting through metal",
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
          "SC 4WL-22 CORDLESS CIRCULAR SAW",
          "Cordless circular saw with maximized run time per charge for fast, straight cuts in wood up to 57 mm│2-1/4” depth (Nuron battery platform)",
          categories[0],
          259.0,
          3,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SC 5ML-22 CORDLESS CIRCULAR SAW FOR METAL",
          "Cold-cutting cordless metal saw for fast, precise cuts up to 57 mm│2-¼” depth (Nuron battery platform)",
          categories[0],
          339,
          6,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SC 30WL-22 CORDLESS WORM DRIVE-STYLE SAW",
          `Cordless, brushless worm drive-style 7-1/4 in. circular saw for precise, heavy-duty cuts up to 2-3/8" depth (Nuron battery platform)`,
          categories[0],
          369,
          1,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SR 4-22 ONE-HANDED RECIPROCATING SAW",
          "Compact and light cordless one-handed brushless reciprocating saw for everyday demolition and fast, precise cutting (Nuron battery platform)",
          categories[1],
          199,
          2,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SR 6-22 RECIPROCATING SAW",
          "Cordless reciprocating saw for heavy-duty demolition and cutting with better comfort and speed (Nuron battery platform)",
          categories[1],
          289,
          9,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SJD 6-A22 CORDLESS JIGSAW",
          "Powerful 22V cordless jigsaw with top D-handle for a comfortable grip and superior control during curved cuts",
          categories[2],
          269,
          17,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SJD 6-22 CORDLESS JIGSAW",
          "Powerful top-handle cordless jigsaw with optional on-board dust collection for precise straight or curved cuts (Nuron battery platform)",
          categories[2],
          269,
          17,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SJT 6-22 CORDLESS JIGSAW",
          "Powerful barrel-grip cordless jigsaw with longer run time for precise straight or curved cuts (Nuron battery platform)",
          categories[2],
          309,
          12,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SB 4-22 PORTABLE BAND SAW",
          "Cordless portable band saw for precise, low-noise, low-spark cuts through metal up to 63.5 mm│2-1/2” cutting depth (Nuron battery platform)",
          categories[3],
          279,
          18,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SB 4-A22 CORDLESS BAND SAW",
          `22V cordless band saw with LED light and a maximum cutting depth of 63.5 mm (2 1/2")`,
          categories[3],
          299,
          20,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SCO 6-22 CUT-OUT TOOL",
          "Cordless brushless drywall cut-out tool for quick, clean and accurate cuts in board and thin sheet metal (Nuron battery platform)",
          categories[4],
          249,
          15,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SCO 6-A22 CORDLESS CUT-OUT TOOL",
          "22V cordless cut-out tool with brushless motor",
          categories[4],
          299,
          20,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SPN 6-22 CN CORDLESS NIBBLER",
          "High-capacity cordless nibbler for cutting sheet metal and profiles with more speed and minimal distortion (Nuron battery platform)",
          categories[5],
          619,
          16,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SPN 6-22 RN CORDLESS NIBBLER",
          "High-capacity cordless nibbler for cutting metal profiles with more speed and minimal distortion (Nuron battery platform)",
          categories[5],
          619,
          7,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SSH 6-22 CORDLESS SHEARS",
          "High-capacity cordless double-cut shear for fast cuts in sheet metal, profiles and HVAC duct up to 2.5 mm│12 Gauge (Nuron battery platform)",
          categories[5],
          619,
          7,
          callback
        );
      },
    ],
    // optional callback
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
      console.log("Items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
