let express = require('express');
let exphbs = require('express-handlebars');
let socket = require('socket.io');
let http = require('http');

//1. создаем экземпляр експресс-приложения
const app = express();
//2. создаем экзепляр http-сервера
const server = http.Server(app);
//3. подключаем сокеты к серверу
const io = socket(server);

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

  socket.emit('wordchain:list', WordChain);

  socket.on('wordchain:create', function (word) {

    if(word && word.length > 0) {
      WordChain.push(word);
      io.sockets.emit('wordchain:list', WordChain);
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
