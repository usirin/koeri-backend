var express = require('express'), 
    routes = require('./routes'),
    user = require('./routes/user'), 
    http = require('http'), 
    path = require('path'),
    request = require('request'),
    db = require('./db'),
    Earthquake = require('./Earthquake'),
    Fetcher = require('./Fetcher');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.json({});
});

app.get('/latest', function(req, res) {
    Earthquake.find({}).limit(100).sort('-timestamp').exec(function(err, data) {
        if (err)
            res.send(500);

        res.json(data);
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
