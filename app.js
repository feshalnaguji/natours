const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP header
app.use(helmet());

// Development logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // for getting request data in log
}

// limiting too many request from same IP => prevent DOS and brute force attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // bodyParser

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize()); // filter out all of the $ signs and dots from req body, query and params

// Data sanitization against XSS
app.use(xss()); // converts html symbols to normal entity

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// accessing static files like html css images etc.
app.use(express.static(`${__dirname}/public`));

// custom middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

// custom test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter); // creating sub routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling all the unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error handling Middleware : takes 4 arguments which makes it error handling middleware
app.use(globalErrorHandler);

module.exports = app;
