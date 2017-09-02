var database = require('database');

var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.deleteSession(req.session.session, function() {});
    }
    req.session.reset();
    res.redirect('/');
});

module.exports = router;