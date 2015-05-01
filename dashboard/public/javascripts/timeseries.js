var incr = 0;

//Function to update timeseries plot incrementally with time
function updateTimeSeriesPlot(results, dataset) {
	//Null checks
	if(results == null || results.tweets == null || results.tweets === undefined){
		return;
	}

	if(dataset === undefined){
		return;
	}
    // add a new data point to the dataset
    var now = vis.moment();

    //console.log("addDataPoint: " + now);

    var JSONLength = Object.keys(results.tweets).length;
	if(JSONLength <= 0){
		return;
	}
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
}

// Function to render the initial plot, when the UI is loaded
function renderInitialPlot() {
    // move the window (you can think of different strategies).
    var now = 1427329787738 + incr; // Currest TS Hard coded
	incr += 6600;
    
	//console.log("renderStep: " + now);
    var range = graph2d.getWindow();
    var interval = range.end - range.start;
    switch (strategy.value) {
         case 'continuous':
            // continuously move the window
            graph2d.setWindow(now - interval, now, {animate: false});
            requestAnimationFrame(renderInitialPlot);
            break;

          case 'discrete':
            graph2d.setWindow(now - interval, now, {animate: false});
            setTimeout(renderInitialPlot, DELAY);
            break;

          default: // 'static'
            // move the window 90% to the left when now is larger than the end of the window
            if (now > range.end) {
              graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
            }
            setTimeout(renderInitialPlot, DELAY);
            break;
        }
}

