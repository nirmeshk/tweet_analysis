// Initializing country- alpha3 codes
var country = ['DZA', 'AGO', 'EGY', 'BGD', 'NER', 'LIE', 'NAM', 'BGR', 'BOL', 'GHA',
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

// Creating Initial Json to load Map of countries
function getCountryTweetJson(){
		
	var country_tweet = {};
	var s_tweet = { fillKey : 'defaultFill', tweets: 0 };
	for(var i=0; i < country.length; i++){
		country_tweet[country[i]] = s_tweet;
	}
	return country_tweet;
}

// Initializing heat map colors
var heatColors = [ "#ffff4d","#ffff19","#ffdb00", "#ffc800", "#ffb600","#ffa400", "#ff9200", "#ff8000", "#ff6d00", 
				  "#ff5b00", "#ff4900", "#ff3700", "#ff2400"];


// Initializing json for coloring the map, with default and other heatmap colors
function getColorFillJson(){
		
	var colorFill = {};
	for(var i=0; i < heatColors.length; i++){
		var key = 'Level_' + (i+1);
		colorFill[key] = heatColors[i];
	}
	colorFill['UNKNOWN'] = '#a9a9a9';	
	colorFill['defaultFill'] = '#a9a9a9';	
	return colorFill;
}



