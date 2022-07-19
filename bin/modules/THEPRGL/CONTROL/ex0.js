const RunHandler = require("../../../run-handler");

module.exports = function() {
    RunHandler.Runtime.end = true;
};