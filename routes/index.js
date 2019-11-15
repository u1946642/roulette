var express = require('express');
var router = express.Router();
var redis = require("redis");
  var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});



/* GET home page. */
router.get('/', function(req, res, next) {	
const prova =1;
	client.set("prova", prova, redis.print);
	client.incr("prova");
	client.get("prova", function(err, reply) {
    // reply is null when the key is missing
    res.send({'prova':reply});
});
});
router.post('/:number',function(req,res,next){
	console.log(req.params.number);
	client.lpush("mylist", req.params.number,redis.print);
	client.lrange("mylist", 0,3,function(err, reply) {
    // reply is null when the key is missing
    res.send({'mylist':reply});
});
});
  

module.exports = router;
