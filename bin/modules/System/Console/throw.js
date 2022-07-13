const err = require('../../../err')
module.exports = function() {
    err([...arguments].join(', '));
};