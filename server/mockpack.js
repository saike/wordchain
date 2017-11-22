let express = require('express');
let exphbs = require('express-handlebars');

const app = express();

app.engine('html', exphbs());
app.set('view engine', 'html');
app.set('views', './client');

//static server
app.use(express.static('./client'));

app.get('/', function (req, res) {
  res.render('index', {});
});

app.listen(3000, function () {
  console.log('server is running now');
});