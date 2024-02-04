import createError from 'http-errors';
import { body, validationResult } from 'express-validator';
import Category from '../models/category.js';
import Item from '../models/item.js';

export async function categoryList(req, res, next) {
  const categories = await Category.find()
    .sort({ name: 1 })
    .exec()
    .catch(() => {});

  if (!categories) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  const itemCounts = await Promise.all(
    categories.map((category) =>
      Item.countDocuments({ category: category.id }).exec()
    )
  ).catch(() => {});

  if (!itemCounts) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  categories.forEach((category, id) => {
    category.itemCount = itemCounts[id];
  });

  res.render('category-list', {
    title: 'Product Categories',
    categories
  });
}

export async function categoryDetails(req, res, next) {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec()
  ]).catch(() => []);

  if (category === undefined) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  if (category === null) {
    const err = createError(404, 'Category Not Found');
    return next(err);
  }

  res.render('category-details', {
    title: category.name,
    category,
    items
  });
}

export function categoryCreateGet(req, res, next) {
  res.render('category-create', { title: 'Create New Category' });
}

export const categoryCreatePost = [
  body('name', 'Category name is required').trim().notEmpty().escape(),
  body('description').trim().escape(),

  async function (req, res, next) {
    const validationErrors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!validationErrors.isEmpty()) {
      return res.render('category-create', {
        title: 'Create New Category',
        category,
        errors: validationErrors.array()
      });
    }

    const saved = await category.save().catch(() => {});

    if (!saved) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    res.redirect(category.url);
  }
];

export async function categoryUpdateGet(req, res, next) {
  const category = await Category.findById(req.params.id)
    .exec()
    .catch(() => {});

  if (category === undefined) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  if (category === null) {
    const err = createError(404, 'Category Not Found');
    return next(err);
  }

  res.render('category-create', {
    title: `Update "${category.name}" Category`,
    category
  });
}

export function categoryUpdatePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Category update POST');
}

export function categoryDeleteGet(req, res, next) {
  res.send('NOT IMPLEMENTED: Category delete GET');
}

export function categoryDeletePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Category delete POST');
}
