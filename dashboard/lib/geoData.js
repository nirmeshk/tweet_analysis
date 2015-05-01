// Loading Redis module and creating redis client
var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

// Initializing class handler
var geoData = function(dummy){
    this.dummy = dummy;
}

//Redis on error function callback
rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

// initializing countries with alpha-3 codes
var countries = ['DZA', 'AGO', 'EGY', 'BGD', 'NER', 'LIE', 'NAM', 'BGR', 'BOL', 'GHA',
			   'CCK', 'PAK', 'CPV', 'JOR', 'LBR', 'LBY', 'MYS', 'IOT', 'PRI', 'MYT',
			   'PRK', 'PSE', 'TZA', 'BWA', 'KHM', 'UMI', 'TTO', 'PRY', 'HKG', 'SAU',
			   'LBN', 'SVN', 'BFA', 'SVK', 'MRT', 'HRV', 'CHL', 'CHN', 'KNA', 'JAM',
			   'SMR', 'GIB', 'DJI', 'GIN', 'FIN', 'URY', 'VAT', 'STP', 'SYC', 'NPL',
			   'CXR', 'LAO', 'YEM', 'BVT', 'ZAF', 'KIR', 'PHL', 'SXM', 'ROU', 'VIR',
			   'SYR', 'MAC', 'NIC', 'MLT', 'KAZ', 'TCA', 'PYF', 'NIU', 'DMA', 'GBR',
			   'BEN', 'GUF', 'BEL', 'MSR', 'TGO', 'DEU', 'GUM', 'LKA', 'SSD', 'FLK',
			   'PCN', 'BES', 'GUY', 'CRI', 'COK', 'MAR', 'MNP', 'LSO', 'HUN', 'TKM',
			   'SUR', 'NLD', 'BMU', 'HMD', 'TCD', 'GEO', 'MNE', 'MNG', 'MHL', 'MTQ',
			   'BLZ', 'NFK', 'MMR', 'AFG', 'BDI', 'VGB', 'BLR', 'BLM', 'GRD', 'TKL',
			   'GRC', 'GRL', 'SHN', 'AND', 'MOZ', 'TJK', 'THA', 'HTI', 'MEX', 'ZWE',
			   'LCA', 'IND', 'LVA', 'BTN', 'VCT', 'VNM', 'NOR', 'CZE', 'ATF', 'ATG',
			   'FJI', 'HND', 'MUS', 'DOM', 'LUX', 'ISR', 'FSM', 'PER', 'REU', 'IDN',
			   'VUT', 'MKD', 'COD', 'COG', 'ISL', 'GLP', 'ETH', 'COM', 'COL', 'NGA',
			   'TLS', 'TWN', 'PRT', 'MDA', 'GGY', 'MDG', 'ATA', 'ECU', 'SEN', 'ESH',
			   'MDV', 'ASM', 'SPM', 'CUW', 'FRA', 'LTU', 'RWA', 'ZMB', 'GMB', 'WLF',
			   'JEY', 'FRO', 'GTM', 'DNK', 'IMN', 'MAF', 'AUS', 'AUT', 'SJM', 'VEN',
	           'PLW', 'KEN', 'TUR', 'ALB', 'OMN', 'TUV', 'ALA', 'BRN', 'TUN', 'RUS',
			   'BRB', 'BRA', 'CIV', 'SRB', 'GNQ', 'USA', 'QAT', 'WSM', 'AZE', 'GNB',
			   'SWZ', 'TON', 'CAN', 'UKR', 'KOR', 'AIA', 'CAF', 'CHE', 'CYP', 'BIH',
			   'SGP', 'SGS', 'SOM', 'UZB', 'CMR', 'POL', 'KWT', 'ERI', 'GAB', 'CYM',
			   'ARE', 'EST', 'MWI', 'ESP', 'IRQ', 'SLV', 'MLI', 'IRL', 'IRN', 'ABW',
			   'SLE', 'PAN', 'SDN', 'SLB', 'NZL', 'MCO', 'ITA', 'JPN', 'KGZ', 'UGA',
			   'NCL', 'PNG', 'ARG', 'SWE', 'BHS', 'BHR', 'ARM', 'NRU', 'CUB'];

// Binding countries in class variable
geoData.prototype.countries = this.countries;

// Initalizing uodate Json
var country_json = {};

//Function to get updated country Json
geoData.prototype.getCountryJson = function(){

	var queries = countries.slice();
	processCountryUpdate(queries);
}

//Internal helper recursive function to create helper json
function processCountryUpdate(queries){
	var country;
	if (queries.length == 0) {
	        // All queries complete
	//	  console.log(country_json);
		  return;
    }

	country = queries.pop();
	var c_hash = "country:" + country;
    rclient.hgetall( c_hash, function (err, obj) {
			//Check if any country has non-zero tweet and sentiment counts
	      if(obj != null){
		  		if(obj.s_pos == null || obj.s_pos === undefined){
					obj.s_pos = 0;
				}
		  		if(obj.s_neg == null || obj.s_neg === undefined){
					obj.s_neg = 0;
				}
		  		if(obj.s_neu == null || obj.s_neu === undefined){
					obj.s_neu = 0;
				}
	            country_json[obj.c_code] = obj;
		   }
		   processCountryUpdate(queries); 
	});
}

//Function to call for updated json for UI
geoData.prototype.getUpdatedCountryJson = function(){

	var total_count = 0;
	for (var prop in country_json) {
	        var country = country_json[prop];
			total_count += parseInt(country.t_count);
	}
	console.log("Total Tweet Counts " + total_count);

	//Assigining Heat map color based on tweet count
	for (var prop in country_json) {
	        var country = country_json[prop];
			country.fillKey = getHeatMapColor(country.t_count, total_count);
			//console.log(country);
			country_json[prop] = country;
	}

	return country_json;
}

//Initializing heat map colors
var heatColors = 13;

//Generating heat map color level as log of tweet counts
function getHeatMapColor(count, total_count){
		
	color_index = Math.ceil(Math.log(count)) + 1;
	return "Level_" + color_index;
}

module.exports = geoData;
