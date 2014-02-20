var mongoose = require('mongoose');


/**
 * Earthquake entity.
 * @type {mongoose}
 */
var EarthquakeSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    depth: Number,
    ML: Number,
    location: String,
    timestamp: { 
        type: Number, 
        index: {unique: true, dropDups: true}
    }
});



/**
 * Map data from raw data.
 * @param {string} rawData Raw earthquake line from 
 * http://www.koeri.boun.edu.tr/scripts/lst8.asp
 * 9 data is expected: Date, time, latitude, longitude, depth, 
 * MD, ML, Mw and Location.
 *
 * Example: 
 * 2013.10.12 14:07:48  36.3737   34.1703        5.0      -.-  2.2  -.-   NARLIKUYU-SILIFKE (MERSIN)
 */
EarthquakeSchema.methods.mapFromRawData = function (rawData) {
    // Remove multiple whitespaces and unnecessary revision parts.
    rawData = rawData.replace(/ REVIZE(.)+/g, '');
    rawData = rawData.replace(/ +(?= )/g, '');
    datas = rawData.split(' ');

    // Handle date and the time.
    var date = datas[0].split('.')
        time = datas[1].split(':');
    this.timestamp = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]).getTime();

    // Numbers.
    this.latitude = datas[2];
    this.longitude = datas[3];
    this.depth = datas[4];
    // this.MD = datas[5];
    this.ML = datas[6];
    // this.Mw = datas[7];

    // And location
    var location = '';
    for (var i = 8; i < datas.length; i++) {
        location += datas[i];
        if (i != datas.length - 1)
            location += ' ';
    }
    this.location = location;
};


/**
 * Saves earthquake to db if not exists.
 */
EarthquakeSchema.methods.saveIfNotExists = function() {
    var objectData = this.toObject();
    delete objectData._id;
    this.model('Earthquake').update({timestamp: objectData.timestamp}, 
        objectData, {upsert: true}, function(err, data) {
            // Nothing?
    });
};


var Earthquake = mongoose.model('Earthquake', EarthquakeSchema);
module.exports = Earthquake;
