//Initalizing redis server and redis client
var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

//Initializing class handler
var wordData = function(dummy){
    this.dummy = dummy;
}

//Redis client on error callback
rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

//Initializing word freq array json for word cloud 
var wordFreqArray = "";

//Getting top-k words from redis with freq as scores
wordData.prototype.getWordJson = function(){
	var args = [ 'top-k', 0, -1, 'withscores'];
	var wordArray = [];
	var scoreArray = [];
	//Adding fetched words in word Array
	rclient.zrange(args, function(err, members){
	    if(err) throw err;
        members.forEach(function(member, index){
			if(index % 2 == 1){
				scoreArray.push(Math.floor(Math.sqrt(member)));
			}else{
				wordArray.push(member);
			}
		});

		//Creating word-freq key value element and pushing in wordFreqArray
		wordFreqArray = [];
		for(var i=0; i < wordArray.length; i++) {
			var wordList= [];
			wordList.push(wordArray[i]);
			wordList.push(scoreArray[i]);
			wordFreqArray.push(wordList);
		}
	});

}

//Function to get updated wordFreq Array for UI
wordData.prototype.getUpdatedWordJson = function(){
	
	//console.log(wordFreqArray);
	return wordFreqArray;	
}

module.exports = wordData;
