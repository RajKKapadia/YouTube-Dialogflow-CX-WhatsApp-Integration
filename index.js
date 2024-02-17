const express = require('express');

const webApp = express();

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});

const homeRoute = require('./homeRoute');
const twilioRoute = require('./twilioRoute');

webApp.use('/', homeRoute.router);
webApp.use('/twilio', twilioRoute.router);

exports.webhook = webApp;
