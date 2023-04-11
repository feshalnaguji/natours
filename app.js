const fs = require('fs');
const express = require('express');

const app = express();

// middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handlers for routes
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here...',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Get All Tour
app.get('/api/v1/tours', getAllTours);
// Get one tour
app.get('/api/v1/tours/:id', getTour);
// Create New Tour
app.post('/api/v1/tours', createTour);
// Update Tour
app.patch('/api/v1/tours/:id', updateTour);
// Delete Tour
app.delete('/api/v1/tours/:id', deleteTour);

// start a server
port = 3000;
app.listen(port, () => {
  console.log(`App running or port ${port}`);
}); // callback function is called as soon as server starts listening
