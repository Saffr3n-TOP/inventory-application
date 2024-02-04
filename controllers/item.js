import createError from 'http-errors';
import { body, validationResult } from 'express-validator';
import Item from '../models/item.js';
import Category from '../models/category.js';

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

  async function (req, res, next) {
    const validationErrors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock
    });

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

  async function (req, res, next) {
    const validationErrors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id
    });

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

export function itemDeleteGet(req, res, next) {
  res.send('NOT IMPLEMENTED: Item delete GET');
}

export function itemDeletePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Item delete POST');
}
