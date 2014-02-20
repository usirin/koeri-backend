var Earthquake = require('./Earthquake'),
    request = require('request'),
    Fetcher = {};


/**
 * Fetch interval time.
 * @type {Number}
 */
Fetcher.FETCH_INTERVAL = 60 * 1000; // a minute


/**
 * Go the koeri's list page, and parse all the earthquakes.
 */
Fetcher.fetch = function() {
    request('http://www.koeri.boun.edu.tr/scripts/lst6.asp', function(err, resp, body){
        if (err) {
            opt_errorCallback && opt_errorCallback();
            return;
        }

        // And the magic.
        var regex = /^(\d+\.\d+\.\d+)\s+(\d+:\d+:\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(.\..)\s+(\d+\.\d+)\s+(.\..)\s+(\w+(\s\w+)?-?(\w+)?(\s+)?(\(.+\))?)/gm,
            results = body.match(regex),
            earthquakes = [];

        earthquakes = results.map(function(result) {
            var newEarthquake = new Earthquake();
            newEarthquake.mapFromRawData(result);
            newEarthquake.saveIfNotExists();
            return newEarthquake;
        });

        console.log('Fetching done -', new Date());
    });
}


/**
 * Fetch once and then start the interval.
 */
Fetcher.start = function() {
    if (Fetcher.interval)
        clearInterval(Fetcher.interval);

    Fetcher.interval = setInterval(Fetcher.fetch, Fetcher.FETCH_INTERVAL);
    Fetcher.fetch();
};


Fetcher.start();
module.exports = Fetcher;
