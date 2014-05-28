var express = require('express');
var redis = require('redis');

var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(8080);