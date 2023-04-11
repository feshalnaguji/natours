const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// middlewares
app.use(morgan('dev')); // for getting request data in log
app.use(express.json()); // bodyParser

// custom middlewares
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// // Get All Tour
// app.get('/api/v1/tours', getAllTours);
// // Get one tour
// app.get('/api/v1/tours/:id', getTour);
// // Create New Tour
// app.post('/api/v1/tours', createTour);
// // Update Tour
// app.patch('/api/v1/tours/:id', updateTour);
// // Delete Tour
// app.delete('/api/v1/tours/:id', deleteTour);

// Routes

app.use('/api/v1/tours', tourRouter); // mounting a router
app.use('/api/v1/users', userRouter);

// start a server
port = 3000;
app.listen(port, () => {
  console.log(`App running or port ${port}`);
}); // callback function is called as soon as server starts listening

module.exports = app;
