var express = require('express');
var redis = require('redis');
var bodyParser = require('body-parser')
var assetsController = require('./Controllers/assetsController');

var app = express();

app.use(bodyParser());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function(req, res){
  res.send('hello world');
});

assetsController.registerEndpoints(app);

app.listen(8080);