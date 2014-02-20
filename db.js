var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/koeri');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
    console.log('Mongo Connection OK.');
});
