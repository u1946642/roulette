var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();
const {getTime,setTimer} = require('../timerCont');



client.on("error", function (err) {
    console.log("Error " + err);
});


const usersRouter = require('./users');
router.use('/users', usersRouter);


router.get('/timer', function (req, res, next) {
    res.send((getTime()-2).toString());

});

module.exports = router;
