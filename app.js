const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require("redis");
const client = redis.createClient();
const fs = require('fs');
module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./routes/index');
app.use('/api', apiRouter);


// This conditional is here for testing purposes:
if (!module.parent) {
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
    populateDB();
  });
}



const populateDB = () => {
  client.set("tirada", 1, redis.print);
  client.set("indexUsuari", 1001, redis.print);
  let dbJson = {};
  dbJson = JSON.parse(fs.readFileSync('./db.json'));

  dbJson.numbers.forEach(element => {
    client.hmset("numbers:"+element.number,["number",element.number,"color",element.color,"mult",element.mult]);
  });

};