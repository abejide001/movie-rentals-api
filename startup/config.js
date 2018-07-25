const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        console.error('jwt is not defined');
        process.exit(1);
    }
}