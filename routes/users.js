var express = require("express");
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();

const SALDO_INICIAL = 20000;

const getUsers = () => {
    return new Promise((resolve, reject) => {
        let usuaris = [];
        const importMulti = client.multi();
        client.keys("usuaris:*", (err, reply) => {
            if (err) reject(err);
            reply.forEach(element => {
                importMulti.hgetall(element, (err, reply) => {
                    usuaris.push(reply);
                });
            });
            importMulti.exec((err, replies) => {
                resolve(usuaris);
            });
        });
    });
};

router.post("/", (req, res, next) => {
    client.get("indexUsuari", (err, reply) => {
        reply = reply ? reply : 100000000;
        client.incr("indexUsuari", redis.print);
        const key = "usuaris:" + reply;
        client.hmset(key, [
            "id",
            reply,
            "name",
            req.body.name,
            "saldo",
            SALDO_INICIAL
        ]);
        res.status(201).send({"message":"User created correctly.","user":{"id":reply,"name":req.body.name,"saldo":SALDO_INICIAL}});
    });
});
router.get("/", (req, res, next) => {
    getUsers()
        .then(users => {
            console.log(users);
            res.send({ users: users });
        })
        .then(err => res.status(500).send());
});

router.get("/:userId/saldo", (req, res, next) => {
    console.log(req.params);
    client.hgetall("usuaris:"+req.params.userId,(err,reply) =>{
        if(err)res.status(500).send();
        res.send({"saldo":reply.saldo});
    });
});

module.exports = router;
