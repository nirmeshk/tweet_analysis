
var redis = require('redis');
var rclient = redis.createClient( 6379, '127.0.0.1');
var dummy;

var geoData = function(dummy){
    this.dummy = dummy;
}

rclient.on('error', function(err){
    console.log('Error' + err);
	 exit(1);
});

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

geoData.prototype.countries = this.countries;

var country_json = {};

geoData.prototype.getCountryJson = function(){

	var queries = countries.slice();
	processCountryUpdate(queries);
}

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
	      if(obj != null){
	            country_json[obj.c_code] = obj;
		   }
		   processCountryUpdate(queries); 
   
	});
}

geoData.prototype.getUpdatedCountryJson = function(){

	var total_count = 0;
	for (var prop in country_json) {
	        var country = country_json[prop];
			total_count += parseInt(country.t_count);
	}
	console.log("Total Tweet Counts " + total_count);

	for (var prop in country_json) {
	        var country = country_json[prop];
			country.fillKey = getHeatMapColor(country.t_count, total_count);
			//console.log(country);
			country_json[prop] = country;
	}

	return country_json;
}

var heatColors = 15;


function getHeatMapColor(count, total_count){
		
	var ratio = count/total_count;
	color_index = Math.ceil(ratio * heatColors);
	
	return "HEAT_" + color_index;
}

module.exports = geoData;
