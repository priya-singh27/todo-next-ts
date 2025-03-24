"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = require("express");
var helmet_1 = require("helmet");
var dotenv_1 = require("dotenv");
var db_1 = require("./config/db");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
var user_1 = require("./routes/user");
app.use('/user', user_1.default);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
db_1.AppDataSource.initialize()
    .then(function () {
    console.log('Database connection established...');
    app.listen(PORT, function () {
        console.log("Listening on http://localhost:".concat(PORT, "..."));
    });
})
    .catch(function (error) {
    console.error('Error connecting to database:', error);
});
