const RunHandler = require("../../../run-handler");

module.exports = function(value, update) {
    RunHandler.Runtime.sessionVars[value] = 
        Math.floor(RunHandler.Runtime.sessionVars[value]) + update;
};