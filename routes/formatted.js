var database = require('database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                database.getLoginName(loginId, function(loginName) {
                    var login = {id: loginId, name: loginName};

                    if (req.query.citation) {
                        database.getCitationFormatted(loginId, req.query.citation, function(citation) {
                            if (citation) {
                                res.render('formatted', {login: login, citation: citation});
                            } else {
                                res.redirect('/');
                            }
                        });
                    } else {
                        database.getCitationsFormatted(loginId, function(citations) {
                            if (citations) {
                                res.render('formatted', {login: login, citations: citations});
                            } else {
                                res.redirect('/');
                            }
                        });
                    }
                });
            } else {
                req.session.reset();
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;