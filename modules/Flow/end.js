const RunHandler = require("../../bin/run-handler");

module.exports = function() {
    RunHandler.Runtime.end = true;
};