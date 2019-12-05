var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();

const SALDO_INICIAL = 20000;

client.on("error", function (err) {
    console.log("Error " + err);
});


const usersRouter = require('./users');
router.use('/users', usersRouter);


router.get('/current-state', function (req, res, next) {
    let response = {};
    client.get("tirada", function (err, reply) {
        // reply is null when the key is missing
        response.tirada = reply;
    });
    client.lpop("numGuanyador",(err,reply) => {
        response.numGuanyador = reply;
    });
    
    res.send(response);

});

module.exports = router;
