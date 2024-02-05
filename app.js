import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';
import mongoose from 'mongoose';

import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import * as path from 'path';
import { fileURLToPath } from 'url';

import categoryRouter from './routes/category.js';
import itemRouter from './routes/item.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 60
});

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DB_URI, { dbName: 'inventory-application' })
  .catch((err) => console.log(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net']
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/category/list'));
app.use('/category', categoryRouter);
app.use('/item', itemRouter);

app.use(function (req, res, next) {
  next(createError(404, 'Page Not Found'));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: err.message,
    errStatus: res.statusCode,
    errStack: req.app.get('env') === 'development' && err.stack
  });
});

export default app;
