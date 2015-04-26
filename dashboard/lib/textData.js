var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

var textData = function(dummy){
    this.dummy = dummy;
}

rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

var tweetCount = 0;
var tweet_json = "";

textData.prototype.getTextJson = function(){

	rclient.lrange('Tweets', tweetCount, tweetCount, function(err, chats){
	    if(err) throw err;
        chats.forEach(function(msg){
			tweet_json = msg;
		});
	});
}

textData.prototype.getUpdatedTextJson = function(){
	tweetCount += 1;
	var tweetJson = {};
    tweetJson.text = tweet_json;
	tweetJson.count = tweetCount;
	return tweetJson;
}

module.exports = textData;
