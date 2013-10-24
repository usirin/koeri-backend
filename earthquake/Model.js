var EarthquakeEntity = require('./Entity'),
	request = require('request');

/**
 * Constructor.
 */
var Model = function() {

};

/**
 * @type {Array}
 */
Model.earthquakes = [];


/**
 * Go the koeri's list page, and parse all the earthquakes.
 * @param  {Function=} opt_successCallback
 * @param  {Function=} opt_errorCallback
 */
Model.fetch = function(opt_successCallback, opt_errorCallback) {
	request('http://www.koeri.boun.edu.tr/scripts/lst6.asp', function(err, resp, body){
		if (err) {
			opt_errorCallback && opt_errorCallback();
			return;
		}

		// And the magic.
	    var regex = /^(\d+\.\d+\.\d+)\s+(\d+:\d+:\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(.\..)\s+(\d+\.\d+)\s+(.\..)\s+(\w+(\s\w+)?-?(\w+)?(\s+)?(\(.+\))?)/gm,
	        results = body.match(regex);

        if (results.length == 0) {
        	opt_successCallback && opt_successCallback(Model.earthquakes);
        	return;
        }

	    Model.earthquakes = results.map(function(result) {
	        return new EarthquakeEntity(result);
	    });

	    opt_successCallback && opt_successCallback(Model.earthquakes);
	});
};


/**
 * Retuns all the earthquakes.
 * @return {Array}
 */
Model.getAll = function() {
	return Model.earthquakes;
};

module.exports = Model;
