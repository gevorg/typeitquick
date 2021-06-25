require('dotenv').config()

// Configs.
const configs = require('./server/configs');

// Init express.
const express = require('express');
const app = express();

// Setup servers.
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Setup application.
require('./server/app')(app, express, io);

// Start listening on port.
http.listen(configs.PORT, () => {
    console.log(`Listening on ${configs.PORT}`);
});