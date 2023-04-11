const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from the server side',
    app: 'natours',
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

// start a server
port = 3000;
app.listen(port, () => {
  console.log(`App running or port ${port}`);
}); // callback function is called as soon as server starts listening
