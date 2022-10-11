const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res, next) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Inventory App Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_list = (req, res, next) => {
  Item.find({}, "name category")
    .sort({ name: 1 })
    .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item_list", { title: "Item list", item_list: list_items });
    });
};

exports.item_detail = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_detail", {
        title: item.name,
        item: item,
        price: item.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      });
    });
};

exports.item_create_get = (req, res, next) => {
  Category.find().exec(function (err, categories) {
    if (err) {
      return next(err);
    }
    res.render("item_form", { title: "Create item", categories: categories });
  });
};

exports.item_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be numeric.").notEmpty().isNumeric().escape(),
  body("in_stock", "Number in stock must be numeric.")
    .notEmpty()
    .isNumeric()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      in_stock: req.body.in_stock,
    });

    if (!errors.isEmpty()) {
      Category.find().exec(function (err, categories) {
        if (err) {
          return next(err);
        }
        res.render("Item_form", {
          title: "Create Item",
          categories: categories,
          item,
          errors: errors.array(),
        });
      });
      return;
    }
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    if (item == null) {
      res.redirect("/catalog/items");
    }
    res.render("item_delete", { title: "Delete item", item: item });
  });
};

exports.item_delete_post = (req, res, next) => {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    Item.findByIdAndRemove(req.body.itemid, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/items");
    });
  });
};

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_form", {
        title: "Update Item",
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

exports.item_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be numeric.").notEmpty().isNumeric().escape(),
  body("in_stock", "Number in stock must be numeric.")
    .notEmpty()
    .isNumeric()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      in_stock: req.body.in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Category.find().exec(function (err, categories) {
        if (err) {
          return next(err);
        }
        res.render("item_form", {
          title: "Update Item",
          categories: categories,
          item,
          errors: errors.array(),
        });
      });
      return;
    }
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
      if (err) {
        return next(err);
      }
      res.redirect(theitem.url);
    });
  },
];
