const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");
const client = redis.createClient();

const { getTime, setTimer } = require("./lib/timerCont.js");
const { populateDB, actualitzarSaldos } = require("./lib/helpers.js");
module.exports = app;

/* Do not change the following line! It is required for testing and allowing
 *  the frontend application to interact as planned with the api server
 */
const PORT = process.env.PORT || 3000;
const ROUND_TIME = 30000;

app.set("socketio", io);

app.use(express.static("public"));

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require("./routes/index");
app.use("/api", apiRouter);

if (!module.parent) {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
        populateDB();
    });
}
//Bucle encarregat de l'elecció d'un nombre aleatori i actualitzar l'estat de la partida dels jugadors
setInterval(() => {
    setTimer(ROUND_TIME / 1000);
    let winningNumber = Math.round(Math.random() * 36);
    client.get("tirada", (err, reply) => {
        const tirada = parseInt(reply);
        if (err) console.error(err);
        else {
            actualitzarSaldos(tirada, winningNumber);
            client.incr("tirada", redis.print);
            const key = "numbers:" + winningNumber;
            client.hgetall(key, (err, reply) => {
                if (err) console.error(err);
                else
                    io.emit(
                        "state",
                        JSON.stringify({
                            number: reply,
                            tirada: tirada + 1,
                            temps: getTime() - 2
                        })
                    );
            });
        }
    });
}, ROUND_TIME);

//Inicialitzem el cronometre.
setTimer(ROUND_TIME / 1000);
