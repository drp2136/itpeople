const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

let usersRouter = require('./routes/users');
let todosRouter = require('./routes/todos');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log("err======app=====", err);
  if (err.error && err.error.isJoi) {
    res.status(400).json({
      code: 400,
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      data: err.error.details.map(e => {
        console.log(e);
        if (e.path.length > 0) {
          let eP = e.path.join('.');
          let eM = e.message.split(' ');
          eM.shift();
          return eP + ' ' + eM.join(' ');
        }
        return e.message;
      }),
      message: err.error.message,
    });
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.code || 500);
    res.json({
      message: err.message,
      code: err.code,
    });
  }
});

try {
  mongoose.connect(
    encodeURI('mongodb+srv://ranjan:ranjan@treads.te4da.mongodb.net/itpeople?retryWrites=true&w=majority'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true, // DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
  });
  mongoose.connection.on('open', (ref) => {
    console.log('Connected to mongo server.');
  });
} catch (e) {
  console.log(e);
}

module.exports = app;
