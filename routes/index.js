var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function (loginId) {
            if (loginId) {
                res.redirect('/cite');
            } else {
                req.session.reset();
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;