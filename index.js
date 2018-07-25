const express = require('express');
const app = express();

require('./startup/route')(app);
require('./startup/prod')(app);
require('./startup/connection')();
require('./startup/config')();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;


console.log(app.get('env'));

