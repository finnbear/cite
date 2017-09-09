var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                database.getLoginName(loginId, function(loginName) {
                    var login = {id: loginId, name: loginName};

                    database.createReferral(loginId, function(referralCode) {
                        res.render('referral', {login: login, referralCode: referralCode});
                    });
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