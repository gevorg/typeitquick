// Enable CoffeeScript.
require('coffee-script/register');

// Configs.
var configs = require('./server/configs');

// Init express.
var express = require('express');
var app = express();

// Setup servers.
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Setup application.
require('./server/app')(app, express, io);

// Start listening on port.
http.listen(configs.PORT, function() {
    console.log("Listening on " + configs.PORT);
});