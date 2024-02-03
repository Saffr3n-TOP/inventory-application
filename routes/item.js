import { Router } from 'express';
import {
  itemList,
  itemDetails,
  itemCreateGet,
  itemCreatePost,
  itemUpdateGet,
  itemUpdatePost,
  itemDeleteGet,
  itemDeletePost
} from '../controllers/item.js';

const itemRouter = Router();

itemRouter.get('/list', itemList);
itemRouter.get('/create', itemCreateGet);
itemRouter.post('/create', itemCreatePost);
itemRouter.get('/:id', itemDetails);
itemRouter.get('/:id/update', itemUpdateGet);
itemRouter.post('/:id/update', itemUpdatePost);
itemRouter.get('/:id/delete', itemDeleteGet);
itemRouter.post('/:id/delete', itemDeletePost);

export default itemRouter;
