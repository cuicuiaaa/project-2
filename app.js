//require the express module
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const chatRouter = require('./route/chatroute');
const loginRouter = require('./route/loginRoute');
const db = require('./models');

//require the http module
const http = require('http').Server(app);

// Creating express app and configuring middleware needed for authentication
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// require the socket.io module
const io = require('socket.io');

const port = 5000;

//bodyparser middleware
app.use(bodyParser.json());

//routes
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);
app.use('/chats', chatRouter);
app.use('/login', loginRouter);

//set the express.static middleware
app.use(express.static(__dirname + '/public'));

//integrating socketio
socket = io(http);

//database connection
const Chat = require('./models/Chat');
const connect = require('./dbconnect');

//setup event listener
socket.on('connection', socket => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  //Someone is typing
  socket.on('typing', data => {
    socket.broadcast.emit('notifyTyping', {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on('stopTyping', () => {
    socket.broadcast.emit('notifyStopTyping');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit('received', { message: msg });

    //save chat to the database
    connect.then(() => {
      console.log('connected correctly to the server');
      const chatMessage = new Chat({ message: msg, sender: 'Anonymous' });

      chatMessage.save();
    });
  });
});

db.sequelize.sync().then(() => {
  http.listen(port, () => {
    console.log('Running on Port: ' + port);
  });
});