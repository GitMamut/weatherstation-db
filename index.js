const express = require('express')
const firebase = require("firebase");
const config = require("./config.js");
const sensors = require("./sensors.js");
const lm_temperature = require("./lametric.temperature.js");
const lm_pm = require("./lametric.pm.js");
const airly = require("./airly.js");

const log = require('simple-node-logger').createSimpleLogger('project.log');

log.info("Initializing DB...");
firebase.initializeApp(config.db);
log.info("DB started");

const server = express();

server.get(config.PREFIX + '/', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => {
            const { dateKey, values } = sensors.getReading(snapshot);
            res.set(sensors.prepareHeaders(dateKey));
            res.send({ date: dateKey, values: values })
        })
        .catch(e => log.error(e));
})

server.get(config.PREFIX + '/lametric/pm/now', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_pm.framesNow(snapshot)) })
        .catch(e => log.error(e));
})

server.get(config.PREFIX + '/lametric/out/now', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => { res.send(lm_temperature.framesNow(snapshot)) })
        .catch(e => log.error(e));
})

server.get(config.PREFIX + '/lametric/out/history', (req, res) => {
    logIncomingRequest(req);
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(36).once('value')
        .then(snapshot => { res.send(lm_temperature.framesHistory(snapshot)) })
        .catch(e => log.error(e));
})

server.get(config.PREFIX + "/airly", (req, res) => {
    logIncomingRequest(req);
    const airlyUrl = airly.getUrl();
    log.info(airlyUrl);
    const airlyRequest = airly.request();
    log.info(airlyRequest);
    fetch(airlyUrl, airlyRequest)
        .then(airlyResponse => {
            log.info({
                "remaining-day": airlyResponse.headers.get("x-ratelimit-remaining-day"),
                "remaining-minute": airlyResponse.headers.get("x-ratelimit-remaining-minute")
            });
            return airlyResponse.json();
        })
        .then(json => {
            res.send(airly.framesNow(json));
        })
        .catch(e => log.error(e));
});

server.listen(config.PORT, () => log.info(`Listening on port ${config.PORT}!`))
log.info('Using prefix: ' + config.PREFIX);

function logIncomingRequest(req) {
    log.info(req.url + ": " + (req.header('x-forwarded-for') || req.connection.remoteAddress));
}
