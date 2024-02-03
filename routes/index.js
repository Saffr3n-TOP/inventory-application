import { Router } from 'express';

const router = Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Inventory Application' });
});

export default router;
