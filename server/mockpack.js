let express = require('express');

const app = express();

app.get('/', function (req, res) {
  res.send('Hello mockpack!');
});

app.listen(3000, function () {
  console.log('server is running now');
});