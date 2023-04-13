const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // for getting request data in log
}

app.use(express.json()); // bodyParser
app.use(express.static(`${__dirname}/public`)); // accessing static files like html css images etc.

// custom middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter); // creating sub routers
app.use('/api/v1/users', userRouter);

// Handling all the unhandled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
