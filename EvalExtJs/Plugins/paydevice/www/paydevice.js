var exec = require('cordova/exec');

var PayDevice = function() {
};

PayDevice.echo = function() {
    exec(null, null, "PayDevice", "echo", []);
};