var express = require('express');
var path = require('path');

var app = express();

var server = require('http').Server(app);
var port = process.env.PORT || '3000';
app.set('port', port);
server.listen(port, function(){
  console.log('listening on: ' + this.address().port);
});

app.locals.delimiters = '<% %>';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
app.use(router);
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.post('/adduser', function (req ,res) {
  console.log(req.body);
  res.send(req.body);
});

var io = require('socket.io')(server);
var userIDs = [];
var allClients = [];

io.on('connection', function (socket) {
  allClients.push(socket);
  userIDs.push(socket.id);
  console.log('user connect ' + socket.id);
  socket.emit('initial-connection', { id: socket.id });
  socket.on('recieved-connection',function (data) {  console.log(data.message); });
  socket.on('disconnect',function() { 
    var disconnectedIndex = allClients.indexOf(socket);
    console.log('user disconnect ' + userIDs[disconnectedIndex]);
    userIDs.splice(disconnectedIndex, 1);
    allClients.splice(disconnectedIndex, 1);
  });
});







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
