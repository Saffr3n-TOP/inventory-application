import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/', function (req, res, next) {
  res.render('index', { title: 'Inventory Application' });
});

export default indexRouter;
