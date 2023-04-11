const app = require('./app');

// start a server
port = 3001;
app.listen(port, () => {
  console.log(`App running or port ${port}...`);
}); // callback function is called as soon as server starts listening
