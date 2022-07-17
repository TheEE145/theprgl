const RunHandler = require("../../../run-handler");

module.exports = function(value) {
    delete(RunHandler.Runtime.sessionVars[value]);
};