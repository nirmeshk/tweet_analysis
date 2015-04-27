// Establishing the socket.io connection with the server
var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
var incr = 0;

server.on('tweet-count', function(result){
		addDataPoint(result);
});

function updateTable(result){
	var JSONLength = Object.keys(result.tweets).length;
	if(JSONLength >= 1){
		var c = $("#myTable tr:first td").length;
			$("#myTable tr:first").append("<th>"+result.tweets[JSONLength-1].slot+"</th>");
			$("#myTable tr:eq(1)").append("<td>"+result.tweets[JSONLength-1].count+"</td>");
			$("#myTable tr:eq(2)").append("<td>"+result.tweets[JSONLength-1].count+"</td>");
			$("#myTable tr:eq(3)").append("<td>"+result.tweets[JSONLength-1].count+"</td>");

		/*if(JSONLength >= 13){
			$('table tr:first').find('th:eq(0)').remove();
			$("#myTable tr:eq(1)").find('td:eq(0)').remove();
			$("#myTable tr:eq(2)").find('td:eq(0)').remove();
			$("#myTable tr:eq(3)").find('td:eq(0)').remove();
		}*/
		$('.visualize').trigger('visualizeRefresh');
	}
}

/*result.tweets.forEach(function(column)
	{
        	console.log(result.tweets.slot);
		console.log(result.tweets.count);
		
});*/

/**
       * Add a new datapoint to the graph
       */
function addDataPoint(results) {
	// add a new data point to the dataset
        var now = vis.moment();

	console.log("addDataPoint: " + now);
	var JSONLength = Object.keys(results.tweets).length;
	//var now = Date {Sat Apr 15 2015 01:54:43 GMT-0400 (EDT)};
        dataset.add({
          x: results.tweets[JSONLength-1].slot,
          y: results.tweets[JSONLength-1].count,
          group: 1
        });

	dataset.add({
          x: results.tweets[JSONLength-1].slot,
          y: results.tweets[JSONLength-1].positive,
          group: 2
        });

	dataset.add({
          x: results.tweets[JSONLength-1].slot,
          y: results.tweets[JSONLength-1].negative,
          group: 3
        });

        // remove all data points which are no longer visible
        var range = graph2d.getWindow();
        var interval = range.end - range.start;
        var oldIds = dataset.getIds({
          filter: function (item) {
            return item.x < range.start - interval;
          }
        });
	//renderStep(results.tweets[JSONLength-1].slot);
        //dataset.remove(oldIds);
	
}

function renderStep() {
        // move the window (you can think of different strategies).
        var now = 1427329787738 + incr;
	incr += 1100;
	console.log("renderStep: " + now);
        var range = graph2d.getWindow();
        var interval = range.end - range.start;
        switch (strategy.value) {
          case 'continuous':
            // continuously move the window
            graph2d.setWindow(now - interval, now, {animate: false});
            requestAnimationFrame(renderStep);
            break;
      
          case 'discrete':
            graph2d.setWindow(now - interval, now, {animate: false});
            setTimeout(renderStep, DELAY);
            break;
      
          default: // 'static'
            // move the window 90% to the left when now is larger than the end of the window
            if (now > range.end) {
              graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
            }
            setTimeout(renderStep, DELAY);
            break;
        }
}
