const err = require('../../../err')
module.exports = function() {
    err.error([...arguments].join(', '));
};