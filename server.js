const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching uncaught exceptions => for synchronous code
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception! Shutting down...');
  console.log(err.name, err.message);
  // Shut down or crash the app
  process.exit(1);
});

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

// start a server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // callback function is called as soon as server starts listening
  console.log(`App running or port ${port}...`);
});

// Handling unhandled rejection : for errors outside express / mongo => for asynchronous code
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(err.name, err.message);
  // Shut down or crash the app
  server.close(() => {
    process.exit(1);
  });
});
