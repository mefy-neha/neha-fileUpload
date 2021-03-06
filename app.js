var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var app = express();
var http = require('http');
app.use(cors());
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://127.0.0.1:27017/neha-fileUpload', { autoIndex: false }, (err, res) => {
  console.log('errrr', err)
  // console.log('resss',res)

});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/****************ROUTING MODULE********/
const doctorRoute = require('./routes/doctorRoute');
app.use('/', index);
app.use('/users', users);
app.use('/doctor', doctorRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', port);
console.log('Server is running', port)
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//on successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to mongodb!!');
});

//on error
mongoose.connection.on('error', (err) => {
  if (err) {
    console.log('Error in db is :' + err);
  }
});
module.exports = app;


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}