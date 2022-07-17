const RunHandler = require("../../../run-handler");

module.exports = function(line, value) {
    if(new Function(`return ${value}`)()) {
        RunHandler.Runtime.line = line - 1;     
    };
};