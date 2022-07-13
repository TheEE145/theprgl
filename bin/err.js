module.exports = class {
    static error = function(message) {
        console.log(`\x1b[31mError: ${message}!\x1b[0m`);
        process.exit(1);
    };

    static warn = function(message) {
        console.log(`\x1b[33mWarning: ${message}!\x1b[0m`);
    };
}