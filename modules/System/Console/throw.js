const err = require('../../../bin/err')
module.exports = function() {
    err([...arguments].join(', '));
};