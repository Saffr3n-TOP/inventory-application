import createError from 'http-errors';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import Item from '../models/item.js';
import Category from '../models/category.js';

const upload = multer({
  dest: 'public/images/',
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpe?g|png/;
    const correctMimeType = allowedExtensions.test(file.mimetype);
    const correctExtension = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (!correctMimeType || !correctExtension) {
      return cb(null, false);
    }

    cb(null, true);
  }
}).single('image');

export async function itemList(req, res, next) {
  const items = await Item.find()
    .sort({ category: 1, name: 1 })
    .exec()
    .catch(() => {});

  if (!items) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  res.render('item-list', {
    title: 'All Products',
    items
  });
}

export async function itemDetails(req, res, next) {
  const item = await Item.findById(req.params.id)
    .populate('category')
    .exec()
    .catch(() => {});

  if (item === undefined) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  if (item === null) {
    const err = createError(404, 'Item Not Found');
    return next(err);
  }

  res.render('item-details', {
    title: item.name,
    item
  });
}

export async function itemCreateGet(req, res, next) {
  const categories = await Category.find()
    .sort({ name: 1 })
    .exec()
    .catch(() => {});

  if (!categories) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  res.render('item-create', { title: 'Create New Product', categories });
}

export const itemCreatePost = [
  function (req, res, next) {
    upload(req, res, (err) => {
      if (err) {
        req.body.image = null;
      }
      next();
    });
  },

  body('name', 'Product name is required').trim().notEmpty().escape(),
  body('description').trim().escape(),
  body('category', 'Category is required').trim().notEmpty().escape(),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .escape()
    .isNumeric()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('stock')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required')
    .escape()
    .isNumeric()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  body(
    'image',
    'Only jpg, jpeg and png files up to 1MB are allowed for image'
  ).custom((image) => image === undefined),

  async function (req, res, next) {
    const validationErrors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock
    });
    if (req.file) item.image = `/images/${req.file.filename}`;

    if (!validationErrors.isEmpty()) {
      const categories = await Category.find()
        .sort({ name: 1 })
        .exec()
        .catch(() => {});

      if (!categories) {
        const err = createError(500, 'No Database Response');
        return next(err);
      }

      return res.render('item-create', {
        title: 'Create New Product',
        categories,
        item,
        errors: validationErrors.array()
      });
    }

    const saved = await item.save().catch(() => {});

    if (!saved) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    res.redirect(item.url);
  }
];

export async function itemUpdateGet(req, res, next) {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec()
  ]).catch(() => []);

  if (item === undefined) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  if (item === null) {
    const err = createError(404, 'Item Not Found');
    return next(err);
  }

  res.render('item-create', {
    title: `Update "${item.name}"`,
    item,
    categories
  });
}

export const itemUpdatePost = [
  function (req, res, next) {
    upload(req, res, (err) => {
      if (err) {
        req.body.image = null;
      }
      next();
    });
  },

  body('name', 'Product name is required').trim().notEmpty().escape(),
  body('description').trim().escape(),
  body('category', 'Category is required').trim().notEmpty().escape(),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .escape()
    .isNumeric()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('stock')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required')
    .escape()
    .isNumeric()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  body(
    'image',
    'Only jpg, jpeg and png files up to 1MB are allowed for image'
  ).custom((image) => image === undefined),

  async function (req, res, next) {
    const validationErrors = validationResult(req);
    const item = await Item.findById(req.params.id)
      .exec()
      .catch(() => {});

    if (!item) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    item.name = req.body.name;
    item.description = req.body.description;
    item.category = req.body.category;
    item.price = req.body.price;
    item.stock = req.body.stock;

    if (req.file) {
      if (item.image) {
        const oldImage = item.image.split('/images/')[1];
        const deleted = await fs
          .unlink(`public/images/${oldImage}`)
          .catch(() => null);

        if (deleted === null) {
          const err = createError(500, 'Unknown Error');
          return next(err);
        }
      }

      item.image = `/images/${req.file.filename}`;
    }

    if (!validationErrors.isEmpty()) {
      const categories = await Category.find()
        .sort({ name: 1 })
        .exec()
        .catch(() => {});

      if (!categories) {
        const err = createError(500, 'No Database Response');
        return next(err);
      }

      return res.render('item-create', {
        title: `Update "${item.name}"`,
        item,
        categories,
        errors: validationErrors.array()
      });
    }

    const saved = await Item.findByIdAndUpdate(req.params.id, item)
      .exec()
      .catch(() => {});

    if (!saved) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    res.redirect(item.url);
  }
];

export async function itemDeleteGet(req, res, next) {
  const item = await Item.findById(req.params.id)
    .exec()
    .catch(() => {});

  if (item === undefined) {
    const err = createError(500, 'No Server Response');
    return next(err);
  }

  if (item === null) {
    const err = createError(404, 'Item Not Found');
    return next(err);
  }

  res.render('item-delete', {
    title: `Delete "${item.name}"`,
    item
  });
}

export async function itemDeletePost(req, res, next) {
  const item = await Item.findByIdAndDelete(req.params.id)
    .exec()
    .catch(() => {});

  if (item === undefined) {
    const err = createError(500, 'No Server Response');
    return next(err);
  }

  if (item === null) {
    const err = createError(404, 'Item Not Found');
    return next(err);
  }

  if (item.image) {
    const oldImage = item.image.split('/images/')[1];
    const deleted = await fs
      .unlink(`public/images/${oldImage}`)
      .catch(() => null);

    if (deleted === null) {
      const err = createError(500, 'Unknown Error');
      return next(err);
    }
  }

  res.redirect('/item/list');
}
