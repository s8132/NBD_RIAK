var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    url = require('url');

var app = module.exports = express();

var riakDBOptions = {
    url: "http://192.168.59.103",
    port: 8098
};

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

/* Get angular app */
app.get("/", function(req, res){
    console.log(req.headers);
    fs.readFile('index.html', function(err, page) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(page);
        res.end();
    });
});

/* Settings */
app.get("/settings", function(req, res){
    res.json(riakDBOptions);
});

app.put('/settings', function(req, res){
    riakDBOptions = req.body;
    res.json(riakDBOptions);
});

/* Riak API proxy */
app.get("/riak/api/*", function(req, res){
    var riakPath = req.url.replace("/riak/api", "");
    request.get(riakDBOptions.url + ":" + riakDBOptions.port + riakPath).pipe(res);
});

app.put("/riak/api/*", function(req, res){
    var riakPath = req.url.replace("/riak/api", "");
    var options = {
        url: riakDBOptions.url + ":" + riakDBOptions.port + riakPath,
        method: 'PUT',
        headers: req.headers,
        json: req.body
    };

    request.put(options).pipe(res);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
