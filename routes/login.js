var database = require('database');

var express = require('express');
var router = express.Router();

/* POST login route. */
router.post('/', function(req, res, next) {
    if (req.body.name && req.body.password && req.body.account) {
        if (req.body.account === "new") {
            database.checkLogin(req.body.name, null, function(loginId) {
                if (loginId) {
                    res.redirect('/');
                } else {
                    database.createLogin(req.body.name, req.body.password, function(loginId) {
                        database.createSession(loginId, function(session) {
                            req.session.session = session;
                            res.redirect('/');
                        });
                    });
                }
            });
        } else if (req.body.account === "existing") {
            database.checkLogin(req.body.name, req.body.password, function (loginId) {
                if (loginId) {
                    database.createSession(loginId, function (session) {
                        req.session.session = session;
                        res.redirect('/');
                    })
                } else {
                    res.redirect('/');
                }
            });
        } else {
            console.log("login.js - Error: Account value '" + req.body.account + "' invalid.");
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;