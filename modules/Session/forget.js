const RunHandler = require("../../bin/run-handler");

module.exports = function(value) {
    delete(RunHandler.Runtime.sessionVars[value]);
};