const err = require("../../bin/err");
const RunHandler = require("../../bin/run-handler");

module.exports = function(line, value) {
    value = value.split(' ');

    for(let i = 0; i < value.length; i++) {
        if(value[i].startsWith('@')) {
            value[i] = RunHandler.Runtime.sessionVars[value[i].substring(1)];
        };
    };

    if(eval(value.join(' '))) {
        RunHandler.Runtime.line = line - 1;      
    };
};