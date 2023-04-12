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
  })
  .then(() => {
    console.log('DB connection established');
  });

// start a server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running or port ${port}...`);
}); // callback function is called as soon as server starts listening
