

module.exports = function(req, res, next) {
    //check for the admin user
    if (!req.user.isAdmin) return res.status(403).send('forbidden, access denied')
    next()
}