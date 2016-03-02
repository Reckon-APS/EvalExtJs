var exec = require("cordova/exec");

var AppVersion = function() {
};

AppVersion.getAppVersion = function (successCallback, errorCallback) {
    exec(successCallback, errorCallback, "AppVersion", "getVersionNumber", []);
};

module.exports = AppVersion;