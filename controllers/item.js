import createError from 'http-errors';
import Item from '../models/item.js';

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

export function itemCreateGet(req, res, next) {
  res.send('NOT IMPLEMENTED: Item create GET');
}

export function itemCreatePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Item create POST');
}

export function itemUpdateGet(req, res, next) {
  res.send('NOT IMPLEMENTED: Item update GET');
}

export function itemUpdatePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Item update POST');
}

export function itemDeleteGet(req, res, next) {
  res.send('NOT IMPLEMENTED: Item delete GET');
}

export function itemDeletePost(req, res, next) {
  res.send('NOT IMPLEMENTED: Item delete POST');
}
