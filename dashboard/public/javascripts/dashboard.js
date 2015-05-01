var graph2d;

$(document).ready(function(){

	var server_name = window.location.href;
	var socket = io.connect(server_name);

	/*************** Chart Initialization Steps ***************************/

	// Time Series Chart Initialization
	var DELAY = 1000; // delay in ms to add new data points
    var names = ['','Total Tweets', 'Positive Sentiment Tweets', 'Negative Sentiment Tweets'];
    var strategy = document.getElementById('strategy');

    // create a graph2d with an (currently empty) dataset
    var container = document.getElementById('timeseries');
    var dataset = new vis.DataSet();

    var groups = new vis.DataSet();
    groups.add({
        id: 1,
        content: names[1],
        options: {
            drawPoints: {
                style: 'circle' // square, circle
            },
            shaded: {
                orientation: 'bottom' // top, bottom
            }
        }});

	groups.add({
        id: 2,
        content: names[2],
        options: {
            drawPoints: {
                style: 'circle' // square, circle
            },
            shaded: {
                orientation: 'bottom' // top, bottom
            }
        }});

    groups.add({
        id: 3,
        content: names[3],
        options: {
            drawPoints: {
                style: 'circle' // square, circle
            },
            shaded: {
                orientation: 'bottom' // top, bottom
            }
        }});

	// Initializing configuration for vis.js timeseries map
    var options = {
      defaultGroup: 'ungrouped',
      legend: true,
      start: vis.moment(1427326200000).add(100, 'seconds'), // Start Time Stamp Hard Coded
      //start: vis.moment('Sun Mar 26 2015 21:30:00 GMT-0400').add(-30, 'seconds'), // changed so its faster
      end: vis.moment(1427329487738),  //End Time Stamp hard coded
      dataAxis: {
        customRange: {
          left: {
            min:0, max: 20000 // For y axis range
          }
        }
      }
    };

	// graph2D initailization
    graph2d = new vis.Graph2d(container, dataset, groups, options);

	//Now Load and Render Data Points
	renderInitialPlot();

  // -------------------------------------------------------------------//
	// Geo-Space Map Initialization
	var countries = getCountryTweetJson();
	var colorFills = getColorFillJson();
	var map = new Datamap({
	 						element: document.getElementById("worldmap"),
							height: 500, 
							fills : colorFills ,
							data : countries,
					        geographyConfig: {
					            popupTemplate: function(geo, data) { 
									// For Rendering on Hover over the countries
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
	
	/*************** Chart Updation Steps ***************************/

	// Updating Map Data
	socket.on('country-json', function(data) {
		map.updateChoropleth(data);
	});

	// Updating Tweet-logs data
	socket.on('tweet-json', function(data){
		var countHtml = "<span style='font-weight: bold;color:#000066'> #" + data.count +": </span>";
		var tweetHtml = "<span style='color:#3366FF'> " + data.text +"<span> <br/>";
		$('#tweet_log').prepend(countHtml + tweetHtml);	
	});

	// Updating Word-cloud data
	socket.on('word-json', function(data){
		$("#w_cloud").html();
		WordCloud(document.getElementById('w_cloud'), { list: data } );
	});
	
	//Updating Time-series Data
	socket.on('time-series-json', function(data){
	    updateTimeSeriesPlot(data, dataset);
	});

	// Updating Tweets Summary data as per time-series
	socket.on('summary-json', function(data){
		var countHtml = "<span class='summary_keys'> Total Tweets: </span> <span class='summary_vals'> " + data.t_count +"<span> <br/>";
		var posHtml = "<span class='summary_keys'> Positive Tweets: </span> <span class='summary_vals'> " + data.s_pos +"<span> <br/>";
		var negHtml = "<span class='summary_keys'> Negative Tweets: </span> <span class='summary_vals'> " + data.s_neg +"<span> <br/>";
		$('#tweet_analysis').html("<br/>" + countHtml + posHtml + negHtml);	
	});


});


// a function to generate data points
function y(x) {
    return (Math.sin(x / 2) + Math.cos(x / 4)) * 5;
}
	
