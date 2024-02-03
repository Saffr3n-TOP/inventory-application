import { Router } from 'express';
import {
  categoryList,
  categoryDetails,
  categoryCreateGet,
  categoryCreatePost,
  categoryUpdateGet,
  categoryUpdatePost,
  categoryDeleteGet,
  categoryDeletePost
} from '../controllers/category.js';

const categoryRouter = Router();

categoryRouter.get('/list', categoryList);
categoryRouter.get('/create', categoryCreateGet);
categoryRouter.post('/create', categoryCreatePost);
categoryRouter.get('/:id', categoryDetails);
categoryRouter.get('/:id/update', categoryUpdateGet);
categoryRouter.post('/:id/update', categoryUpdatePost);
categoryRouter.get('/:id/delete', categoryDeleteGet);
categoryRouter.post('/:id/delete', categoryDeletePost);

export default categoryRouter;
