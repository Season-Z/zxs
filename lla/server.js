const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const usocket = [];

app.get('/', function(req, res) {
  // res.send('<h1>hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('join', function(name) {
    usocket[name] = socket;
    io.emit('join', name);
  });

  socket.on('message', function(msg) {
    io.emit('message', msg); //将新消息广播出去
  });
});

http.listen(3000, function() {
  console.log('listen on 3000');
});
