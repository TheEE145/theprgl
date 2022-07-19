const RunHandler = require("../../../run-handler");

module.exports = function(line, a, b) {
    if(new Function(`return '${a}' == '${b}'`)()) {
        RunHandler.Runtime.line = line - 1;     
    };
};