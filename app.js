const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from the server side');
});

// start a server
port = 3000;
app.listen(port, () => {
  console.log(`App running or port ${port}`);
}); // callback function is called as soon as server starts listening
