// Require External module 'express'
var express = require('express');

var redis = require("redis"),
        client = redis.createClient(), client2 = redis.createClient();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.get('/views', function(req, res){
  res.render('index.html');
});
var server = require('http').createServer(app);

// Port for application to run
var port = 3000;

// Establishing socket.io connection with the web broswer client
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

//Create Web Socket Object and connect it to http server
var sio = require('socket.io').listen(server);

var viewData = { 
    tweets : [] 
};
/*
var items = [];
for(){
	var j = {};
	j.x = _;
	j.y = _;
	item.push(j);
} 
stringfy item;
*/

var slot_number	=-1;

sio.sockets.on('connection', function(socket){

	console.log('Web client connected');

	//make_graph();

	setInterval(function(){ make_graph();}, 400);

	setInterval(function(){socket.emit('tweet-count', viewData);}, 400);

	socket.on('disconnect', function(){
		console.log('Web client disconnected');
	});
});

function getTime(unix_timestamp){
	var time_int = parseInt(unix_timestamp);
	
	if(time_int <10000000000) time_int  *= 1000;

	var date = new Date(time_int);
		
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

	return formattedTime;
}

function make_graph(){
	
	slot_number = slot_number + 1;

	client.sort("cricinfo", "by", "*->slot_no","limit",slot_number,1,function(err,replies){
		replies.forEach(function (reply, i) {
		    	client2.hgetall(reply, function(err,slot_info){
				if(slot_info != null){
					console.log("Slot: "+ slot_info.slot_no);
					var jsonData = {};
					jsonData['slot'] = Number(slot_info.end_ts);
					
					if(slot_info.t_count == null || slot_info.t_count === undefined)
						jsonData['count'] = Number(0);
					else
						jsonData['count'] = Number(slot_info.t_count);

					if(slot_info.s_neg == null || slot_info.s_neg === undefined)
						jsonData['negative'] = Number(0);
					else
						jsonData['negative'] = Number(slot_info.s_neg);

					if(slot_info.s_pos == null || slot_info.s_pos === undefined)
						jsonData['positive'] = Number(0);
					else
						jsonData['positive'] = Number(slot_info.s_pos);

					viewData.tweets.push(jsonData);
				}
				else{
					console.dir(i);
					console.log(slot_info);
				}
			});
		});
	});

}

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
