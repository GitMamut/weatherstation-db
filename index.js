const express = require('express')
const firebase = require("firebase");
const config = require("./config.js");
const sensors = require("./sensors.js");
const lm_temperature = require("./lametric.temperature.js");
const lm_pm = require("./lametric.pm.js");
const airly = require("./airly.js");

console.log("Initializing DB...");
firebase.initializeApp(config.db);
console.log("DB started");

const server = express();

server.get(config.PREFIX + '/', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => {
            const { dateKey, values } = sensors.getReading(snapshot);
            res.set(sensors.prepareHeaders(dateKey));
            res.send({ date: dateKey, values: values })
        })
        .catch(e => console.log(e));
})

server.get(config.PREFIX + '/lametric/pm/now', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_pm.framesNow(snapshot)) })
        .catch(e => console.log(e));
})

server.get(config.PREFIX + '/lametric/out/now', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_temperature.framesNow(snapshot)) })
        .catch(e => console.log(e));
})

server.get(config.PREFIX + '/lametric/out/history', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(36).once('value')
        .then(snapshot => { res.send(lm_temperature.framesHistory(snapshot)) })
        .catch(e => console.log(e));
})

server.get(config.PREFIX + "/airly", (req, res) => {
    logIncomingRequest(req);
    fetch(airly.getUrl(), airly.request())
        .then(airlyResponse => {
            console.log({
                "remaining-day": airlyResponse.headers.get("x-ratelimit-remaining-day"),
                "remaining-minute": airlyResponse.headers.get("x-ratelimit-remaining-minute")
            });
            return airlyResponse.json();
        })
        .then(json => {
            res.send(airly.framesNow(json));
        })
        .catch(e => console.error(e));
});

server.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}!`))

function logIncomingRequest(req) {
    console.log(req.url + ": " + (req.header('x-forwarded-for') || req.connection.remoteAddress));
}

