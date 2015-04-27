var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

var wordData = function(dummy){
    this.dummy = dummy;
}

rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

var tweetCount = 0;
var tweet_json = "";
var wordFreqArray = "";

wordData.prototype.getWordJson = function(){
	var args = [ 'top-k', 0, -1, 'withscores'];
	var wordArray = [];
	var scoreArray = [];
	rclient.zrange(args, function(err, members){
	    if(err) throw err;
        members.forEach(function(member, index){
			if(index % 2 == 1){
				scoreArray.push(Math.floor(Math.sqrt(member) + (100 *Math.random())));
			}else{
				wordArray.push(member);
			}
		});

		wordFreqArray = [];
		for(var i=0; i < wordArray.length; i++) {
			var wordList= [];
			wordList.push(wordArray[i]);
			wordList.push(scoreArray[i]);
			wordFreqArray.push(wordList);
		}
	});

}

wordData.prototype.getUpdatedWordJson = function(){
	
	//console.log(wordFreqArray);
	return wordFreqArray;	
}

module.exports = wordData;
