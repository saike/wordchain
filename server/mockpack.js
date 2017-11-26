let express = require('express');
let exphbs = require('express-handlebars');
let socket = require('socket.io');
let http = require('http');
let mongoose = require('mongoose');

let WordController = require('./controllers/words');

//1. создаем экземпляр експресс-приложения
const app = express();
//2. создаем экзепляр http-сервера
const server = http.Server(app);
//3. подключаем сокеты к серверу
const io = socket(server);

//MONGODB configurations
//Set up default mongoose connection
let mongoDB = 'mongodb://127.0.0.1/mockpack';
mongoose.connect(mongoDB, {
  useMongoClient: true
}, (err) => {

  if (err) throw err;

  console.log('mongo connected');

});

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//render engine
app.engine('html', exphbs());
app.set('view engine', 'html');
app.set('views', './client');

//static server
app.use(express.static('./client'));

app.get('/', function (req, res) {
  res.render('index', {});
});

let WordChain = [
  'nastya',
  'afdsfasdf',
  'asdfasdfasd',
  'ahahaha',
  'netenet',
  'ewirtuweorgh',
  'fsadfasdf'
];

//sockets configurations
io.on('connection', function(socket){

  WordController.list().then((words) => {
    socket.emit('wordchain:list', words);
  });

  socket.on('wordchain:create', function (word) {

    if(word && word.length > 0) {

      WordController.create(word).then(() => {

        WordController.list().then((words) => {
          io.sockets.emit('wordchain:list', words);
        });

      });

    }
    else {

      socket.emit('wordchain:error', 'Ты че ахуел присылать пустое слово?');

    }

  });

  console.log('a user connected', socket.id);

});

server.listen(3000, function () {
  console.log('server is running now');
});
