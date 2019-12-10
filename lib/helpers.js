const redis = require("redis");
const client = redis.createClient();
const fs = require("fs");

//Carrega les dades bàsiques a la base de dades per començar la ruleta
const populateDB = () => {
    client.flushall("ASYNC", (err, succeeded) => {
        client.set("tirada", 1, redis.print);
        client.get("indexUsuari", (err, reply) => {
            if (!reply) client.set("indexUsuari", 1001, redis.print);
        });

        let dbJson = {};
        dbJson = JSON.parse(fs.readFileSync("./lib/db.json"));
        dbJson.numbers.forEach(element => {
            client.hmset("numbers:" + element.number, [
                "number",
                element.number,
                "color",
                element.color,
                "mult",
                element.mult
            ]);
        });
    });
};

//Actualitza els saldos dels usuaris que han fet apostes guanyadores
const actualitzarSaldos = (tirada, numero) => {
    const key = "tirada:*_" + tirada + "_" + numero;
    getMultiplicador(numero).then(mult => {
        client.keys(key, (err, reply) => {
            if (err) reject(err);
            reply.forEach(element => {
                const usuariId = element.substring(
                    element.indexOf(":") + 1,
                    element.indexOf("_")
                );
                const usuariKey = "usuaris:" + usuariId;
                getQuantitat(element).then(quant => {
                    client.hget(usuariKey, "saldo", (err, reply) => {
                        const saldoOld = parseInt(reply);
                        const saldoNew = saldoOld + mult * quant;
                        client.hmset(usuariKey, ["saldo", saldoNew]);
                    });
                });
            });
        });
    });
};
//Obté el valor del factor multiplicador del numero seleccionat
const getMultiplicador = num => {
    const key = "numbers:" + num;
    return new Promise((resolve, reject) => {
        client.hget(key, "mult", (err, reply) => {
            if (err) reject(err);
            else resolve(parseInt(reply));
        });
    });
};
//Obté la quantitat apostada per un usuari i un número en una tirada
const getQuantitat = key => {
    return new Promise((resolve, reject) => {
        client.hget(key, "quantity", (err, reply) => {
            if (err) reject(err);
            else resolve(parseInt(reply));
        });
    });
};

module.exports = {
    populateDB: () => populateDB(),
    actualitzarSaldos: (tirada, numero) => actualitzarSaldos(tirada, numero)
};
