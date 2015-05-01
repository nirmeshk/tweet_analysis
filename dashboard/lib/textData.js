//Initializing redis server and client
var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

//Initializing class handler
var textData = function(dummy){
    this.dummy = dummy;
}

//Redis client on error callback
rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});


//Initializing tweetjsons
var tweetCount = 0;
var tweet_json = "";

//Get tweets from REdis to display on UI
textData.prototype.getTextJson = function(){

	rclient.lrange('Tweets', tweetCount, tweetCount, function(err, chats){
	    if(err) throw err;
        chats.forEach(function(msg){
			tweet_json = msg;
		});
	});
}

//Get updated Json for UI
textData.prototype.getUpdatedTextJson = function(){
	tweetCount += 1;
	var tweetJson = {};
    tweetJson.text = tweet_json;
	tweetJson.count = tweetCount;
	return tweetJson;
}

module.exports = textData;
