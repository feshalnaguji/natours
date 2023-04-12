const mongoose = require('mongoose');
const dotenv = require('dotenv');

// reading env file
dotenv.config({ path: './config.env' });

const app = require('./app');

// DATABASE connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection established');
  });

// Creating mongoose schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // validator
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Create model from schema
const Tour = mongoose.model('Tour', tourSchema);

// Create tour from model
const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 497,
});

// save tour to database which will return a promise
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR :', err);
  });

// start a server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  // callback function is called as soon as server starts listening
  console.log(`App running or port ${port}...`);
});
