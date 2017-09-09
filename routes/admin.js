var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                database.getLogin(loginId, function(login) {
                    if (login.priviledge >= 1) {
                        database.getLogins(function(logins) {
                            res.render('admin', {login: login, logins: logins});
                        });
                    } else {
                        res.redirect('/profile');
                    }
                });
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