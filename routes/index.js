var database = require('database');

var http = require('http');
var https = require('https');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                var login = {id: loginId};
                if (req.query.url) {
                    var citation = {url: req.query.url, valid: true};

                    var prefix = req.query.url.match(/.*?:\/\//g);
                    req.query.url = req.query.url.replace(/.*?:\/\//g, "");

                    var options = {
                        host: req.query.url.substring(0, req.query.url.indexOf('/')),
                        path: req.query.url.substring(req.query.url.indexOf('/'))
                    };

                    var processPage = function (page) {
                        citation.text = page;
                        res.render('index', {citation: citation});
                    };

                    var processResult = function (result) {
                        var data = "";

                        result.on("data", function (chunk) {
                            data += chunk;
                        });

                        result.on("end", function (chunk) {
                            processPage(data);
                        })
                    };

                    if (prefix !== undefined && prefix !== null) {
                        if (prefix[0] === "https://") {
                            options.port = 443;
                            https.get(options, function (result) {
                                processResult(result);
                            }).on('error', function (e) {
                                citation.valid = false;
                                citation.error = "Error loading page.";
                                res.render('index', {login: login, citation: citation});
                            });
                        } else {
                            options.port = 80;
                            http.get(options, function (result) {
                                processResult(result);
                            }).on('error', function (e) {
                                citation.valid = false;
                                citation.error = "Error loading page.";
                                res.render('index', {login: login, citation: citation});
                            });
                        }
                    } else {
                        citation.valid = false;
                        citation.error = "Error processing URL.";
                        res.render('index', {login: login, citation: citation});
                    }
                } else {
                    res.render('index', {login: login, citation: null});
                }
            } else {
                req.session.reset();
                res.redirect('/');
            }
        });
    } else {
        res.render('index', {});
    }
});

module.exports = router;
