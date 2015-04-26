var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);

$(document).ready(function(){

	var countries = getCountryTweetJson();
	var colorFills = getColorFillJson();
	var map = new Datamap({
	 						element: document.getElementById("worldmap"),
							height: 500, 
							fills : colorFills ,
							data : countries,
					        geographyConfig: {
					            popupTemplate: function(geo, data) {
					                return ['<div class="hoverinfo"><strong>',
                    					    ' ' + geo.properties.name,
					                        '<br/> Tweets: ' + data.t_count ,
											'<br/> Pos Sentiment ' + data.s_pos,
											'<br/> Neg Sentiment ' + data.s_neg,
                    					    '</strong></div>'].join('');
            				}	
   	 }

   });

	map.legend();
	socket.on('country-json', function(data) {
		map.updateChoropleth(data);
	});

	socket.on('tweet-json', function(data){
		var countHtml = "<span style='font-weight: bold;color:#000066'> #" + data.count +": </span>";
		var tweetHtml = "<span style='color:#3366FF'> " + data.text +"<span> <br/>";
		$('#tweet_log').prepend(countHtml + tweetHtml);	
	});

});

