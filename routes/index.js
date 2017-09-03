var database = require('database');

var http = require('http');
var https = require('https');
//var jsdom = require("jsdom");
//$ = require("jquery")(jsdom.jsdom().defaultView);

var $ = require("jquery")(require('jsdom').jsdom().defaultView);

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.session) {
        database.checkSession(req.session.session, function(loginId) {
            if (loginId) {
                database.getLoginName(loginId, function(name) {
                    var login = {id: loginId, name: name};
                    if (req.query.stage && req.query.url) {
                        var citation = {url: req.query.url, valid: true};
                        if (req.query.stage == "url") {
                            var prefix = req.query.url.match(/.*?:\/\//g);
                            req.query.url = req.query.url.replace(/.*?:\/\//g, "");

                            var options = {
                                host: req.query.url.substring(0, req.query.url.indexOf('/')),
                                path: req.query.url.substring(req.query.url.indexOf('/'))
                            };

                            if (options.host == "") {
                                options.host = options.path;
                                options.path = "/";
                            }

                            var processPage = function (page) {
                                var dom = $(page);

                                citation.sourceAuthor = dom.filter("meta[name=author]").attr("content") || "";
                                citation.sourceContainerTitle = dom.filter("title").text();

                                res.render('index', {login: login, citation: citation});
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

                            if (prefix !== undefined && prefix !== null && prefix[0] === "https://") {
                                options.port = 443;
                                https.get(options, function (result) {
                                    processResult(result);
                                }).on('error', function (e) {
                                    citation.valid = false;
                                    citation.error = "loadurl";
                                    res.render('index', {login: login, citation: citation});
                                });
                            } else {
                                options.port = 80;
                                http.get(options, function (result) {
                                    processResult(result);
                                }).on('error', function (e) {
                                    citation.valid = false;
                                    citation.error = "loadurl";
                                    res.render('index', {login: login, citation: citation});
                                });
                            }
                        } else if (req.query.stage == "final") {
                            citation.text = "This is your citation.";
                            res.render('index', {login: login, citation: citation})
                        }
                    } else {
                        res.render('index', {login: login, citation: null});
                    }
                });
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
