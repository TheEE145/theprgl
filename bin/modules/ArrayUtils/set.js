const RunHandler = require('../../run-handler');
const STDERR = require('../../err');
let arr;

module.exports = function(array, index, value) {
    if(!Array.isArray(arr = eval(`RunHandler.Runtime.sessionVars.${array}`))) {
        STDERR.error(`${array} is not array`);
    };

    arr[index] = value;
};