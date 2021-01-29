
const express = require('express');

const validateRouter = require('./routes/ruleValidate');

//ERROR
const AppError = require('./Error/AppError');
const errorCtrl = require('./Error/errorController');

// START EXPRESS
const app = express();

// MIDDLEWARES


// SET SECURITY HEADERS

app.use(express.json({ limit: '10kb' }));

app.use('/', validateRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 400));
});

app.use(errorCtrl);

module.exports = app;
