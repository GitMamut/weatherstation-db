const express = require('express')
const firebase = require("firebase");
const config = require("./config");

console.log("Initializing DB...");
firebase.initializeApp(config.db);
console.log("DB started");


const server = express();

server.get('/', (req, res) => {
    console.log("DB >");

    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
        const dateKey = Object.keys(snapshot.val())[0]
        const values = snapshot.val()[dateKey]
        res.set({"Content-type": "text/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Max-Age": 2592000,
        "X-Reading-Time": dateKey})
        res.send({date: dateKey, values: values})
    })
    .catch(e => console.log(e));
})


server.get('/lametric/out/now', (req, res) => {
    console.log("DB >");

    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
        const temp_outside = values.outdoor_temperature
        res.send({
            frames: [
                {
                    text: temp_outside + "°",
                    icon: "i7066"
                }
            ]
        })
    })
    .catch(e => console.log(e));
})

server.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}!`))