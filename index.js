const express = require('express')
const firebase = require("firebase");
const config = require("./config.js");
const sensors = require("./sensors.js");
const lm_temperature = require("./lametric.temperature.js");
const lm_pm = require("./lametric.pm.js");

console.log("Initializing DB...");
firebase.initializeApp(config.db);
console.log("DB started");

const server = express();

server.get('/', (req, res) => {
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => {
            const { dateKey, values } = sensors.getReading(snapshot);
            res.set(sensors.prepareHeaders(dateKey));
            res.send({ date: dateKey, values: values })
        })
        .catch(e => console.log(e));
})

server.get('/lametric/pm/now', (req, res) => {
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_pm.framesNow(snapshot)) })
        .catch(e => console.log(e));
})

server.get('/lametric/out/now', (req, res) => {
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_temperature.framesNow(snapshot)) })
        .catch(e => console.log(e));
})

server.get('/lametric/out/history', (req, res) => {
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(36).once('value')
        .then(snapshot => { res.send(lm_temperature.framesHistory(snapshot)) })
        .catch(e => console.log(e));
})

server.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}!`))

