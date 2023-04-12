const express = require('express');

const tourController = require('./../controllers/tourController.js');

const router = express.Router();

// Param middleware : this will only run if request url contain id as given in middleware
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
