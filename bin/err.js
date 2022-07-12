module.exports = function(message) {
    console.log(`\x1b[31mError: ${message}!\x1b[0m`);
    process.exit(1);
};