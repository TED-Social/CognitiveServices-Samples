// node variables
var express = require('express'); 
var app = express(); 
var server = require('http').createServer(app); 
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;


server.listen(port);

app.use(express.static(__dirname + '/public'));
