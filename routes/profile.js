var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                database.getLogin(loginId, function(login) {
                    if (req.query.login) {
                        if (login.priviledge >= 1) {
                            database.getLogin(req.query.login, function(profile) {
                                if (citation) {
                                    res.render('profile', {login: login, profile: profile});
                                } else {
                                    res.redirect('/');
                                }
                            });
                        } else {
                            res.render('profile', {login: login, profile: null});
                        }
                    } else {
                        res.render('profile', {login: login, profile: login});
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