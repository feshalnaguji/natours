const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

console.log(process.env.NODE_ENV);
// GLOBAL MIDDLEWARES
// middlewares
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

app.use(express.json()); // bodyParser
app.use(express.static(`${__dirname}/public`)); // accessing static files like html css images etc.

// custom middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter); // creating sub routers
app.use('/api/v1/users', userRouter);

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
