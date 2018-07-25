const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //load the token
    const token = req.header('x-auth-token');
    //check if the token is valid
    if(!token) return res.status(401).send('access denied');
    try {
    //verify the token
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    //set the user
        req.user = decoded;    
        next();
    }
    catch(e) {
        res.status(400).send('invalid token')
    }
}