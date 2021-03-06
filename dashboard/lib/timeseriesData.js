
//Initializing mutiple redis client
var redis = require('redis'),
rclient1 = redis.createClient(),
rclient2 = redis.createClient();

var dummy;

// Initializing class handler
var timeseriesData = function(dummy){
    this.dummy = dummy;
}

//Redis client on error callback
rclient1.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

//Initalizing timeseries json array
var tsJsonArray = {
    tweets : []
};

//Initalizing slot number
var slot_number =-1;

//Initalizing summary Json for summary analytics wrt timeseries data
var summaryJson = {};
summaryJson.t_count = 0;
summaryJson.s_pos = 0;
summaryJson.s_neg = 0;

//Getting timeseries data from redis, and storing in local JSON
timeseriesData.prototype.getTimeSeriesJson = function(){
	
	slot_number = slot_number + 1;

	//Fetching sorted slot numbers from redis 
    rclient1.sort("cricinfo", "by", "*->slot_no","limit", slot_number, 1, function(err,replies){
        replies.forEach(function (reply, i) {
                rclient2.hgetall(reply, function(err,slot_info){
	                if(slot_info != null){
    	                console.log(slot_info);
        	            var jsonData = {};
            	        jsonData['slot'] = Number(slot_info.end_ts);

                	    if(slot_info.t_count == null || slot_info.t_count === undefined)
                    	    jsonData['count'] = Number(0);
	                    else
    	                    jsonData['count'] = Number(slot_info.t_count);
						
						//Summary Stats
						summaryJson.t_count += jsonData['count'];

        	            if(slot_info.s_neg == null || slot_info.s_neg === undefined)
            	            jsonData['negative'] = Number(0);
                	    else
                    	    jsonData['negative'] = Number(slot_info.s_neg);

						//Summary Stats
						summaryJson.s_neg += jsonData['negative'];

	                    if(slot_info.s_pos == null || slot_info.s_pos === undefined)
    	                    jsonData['positive'] = Number(0);
        	            else
            	            jsonData['positive'] = Number(slot_info.s_pos);

						
						//Summary Stats
						summaryJson.s_pos += jsonData['positive'];

                    tsJsonArray.tweets.push(jsonData);
                
				}else{
                    console.dir(i);
                    console.log(slot_info);
                }
            });
        });
    });
}

//Function to get updated timeseries json for UI display
timeseriesData.prototype.getUpdatedTimeSeriesJson = function(){
	
	//console.log(wordFreqArray);
	return tsJsonArray;	
}


//Function to get updated Summary json for UI display
timeseriesData.prototype.getSummaryJson = function(){
	
	//console.log(wordFreqArray);
	return summaryJson;	
}

//Helper function, to get time from unix timestamp
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


module.exports = timeseriesData;
