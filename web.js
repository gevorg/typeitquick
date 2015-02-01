// Enable CoffeeScript.
require('coffee-script/register');

// Configs.
var configs = require('./server/configs');

// Fetch express app.
var app = require('./server/app');

// Start listening on port.
app.listen(configs.PORT, function() {
    console.log("Listening on " + configs.PORT);
});
