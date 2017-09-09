var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                res.redirect('/cite');
            } else {
                req.session.reset();
                res.render('login', {error: req.query.error});
            }
        });
    } else {
        res.render('login', {referralCode: req.query.referral, error: req.query.error});
    }
});

router.post('/', function(req, res, next) {
    if (req.body.name && req.body.password && req.body.account) {
        if (req.body.account === "new" || req.body.account === "referral") {
            database.checkLogin(req.body.name, null, function(loginId) {
                if (loginId) {
                    res.redirect('/login?error=exists');
                } else {
                    database.createLogin(req.body.name, req.body.password, req.body.referralCode, function(loginId) {
                        database.createSession(loginId, function(session) {
                            req.session.session = session;
                            res.redirect('/cite');
                        });
                    });
                }
            });
        } else if (req.body.account === "existing") {
            database.checkLogin(req.body.name, req.body.password, function (loginId) {
                if (loginId) {
                    database.createSession(loginId, function (session) {
                        req.session.session = session;
                        res.redirect('/cite');
                    })
                } else {
                    res.redirect('/login?error=invalid');
                }
            });
        } else {
            console.log("login.js - Error: Account value '" + req.body.account + "' invalid.");
        }
    } else {
        res.redirect('/login?error=missing');
    }
});

module.exports = router;