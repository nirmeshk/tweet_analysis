var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var port = 3000;

var geoData = require('./lib/geoData');
var textData = require('./lib/textData');
var wordData = require('./lib/wordData');
//var timeseriesData = require('./lib/tsData');

var gData = new geoData("dummy");
gData.getCountryJson();

var tData = new textData("dummy");

var wData = new wordData("dummy");

//var tsData = new timeSeriesData("dummy");
//tsData.getTimeSeriesData();

server.listen(3000);
console.log("Socket.io server listening at http://127.0.0.1: " + port);

// Initializa a socket-io object
var sio = require('socket.io').listen(server); 

sio.sockets.on('connection', function(socket){

	// After connection with client
	console.log('Web client connected');

    // After the client is disconnected
	socket.on('disconnect', function(){
		console.log('Web client disconnected');
	});

	 // Geo-space UI API calls
     setInterval(function(){
         socket.emit('country-json', gData.getUpdatedCountryJson());
      }, 4000+Math.round(100*Math.random())
     );

     setInterval(function(){
         gData.getCountryJson();
      }, 2000+Math.round(100*Math.random())
     );

	 // Tweet Text UI API Calls
     setInterval(function(){
         socket.emit('tweet-json', tData.getUpdatedTextJson());
      }, 1000
     );

     setInterval(function(){
         tData.getTextJson();
      }, 980
	 );
	
	 // Tweet Words UI API Calls
      setInterval(function(){
         socket.emit('word-json', wData.getUpdatedWordJson());
	      }, 3000
      );

	  setInterval(function(){
	      wData.getWordJson();
	     }, 2000
	  );

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
