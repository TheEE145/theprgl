const err = require("../../err");
const RunHandler = require("../../run-handler");

module.exports = function(line, value) {
    if(eval(value)) {
        RunHandler.Runtime.line = line - 1;      
    };
};