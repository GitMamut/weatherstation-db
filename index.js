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


server.get('/lametric/pm/now', (req, res) => {
    console.log("DB >");

    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
        const dateKey = Object.keys(snapshot.val())[0]
        const values = snapshot.val()[dateKey]
        const pm10 = values.espeasy_PM10
        const pm10_iconIndex = Math.min(parseInt(pm10 / config.pm10_scale * 4.0), 4)
        const pm2_5 = values.espeasy_PM2_5
        const pm2_5_iconIndex = Math.min(parseInt(pm2_5 / config.pm2_5_scale * 4.0), 4)
        res.send({
            frames: [
                {
                    text: pm10,
                    icon: config.pm10_icons[pm10_iconIndex],
                    index: 0
                },
                {
                    text: pm2_5,
                    icon: config.pm2_5_icons[pm2_5_iconIndex],
                    index: 1
                }
            ]
        })
    })
    .catch(e => console.log(e));
})

server.get('/lametric/out/now', (req, res) => {
    console.log("DB >");

    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
        const dateKey = Object.keys(snapshot.val())[0]
        const values = snapshot.val()[dateKey]
        const temp_outside = values.outdoor_temperature
        res.send({
            frames: [
                {
                    text: temp_outside + "°",
                    icon: "i7066",
                    index: 0
                }
            ]
        })
    })
    .catch(e => console.log(e));
})


server.get('/lametric/out/history', (req, res) => {
    console.log("DB >");

    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(36).once('value')
    .then(snapshot => {
        const values = Object.keys(snapshot.val())
            .map(dateKey => snapshot.val()[dateKey]["outdoor_temperature"])
            .map(floatValue => parseInt(floatValue * 10));
        const minValue = values.reduce((prev, curr) => {
            return curr < prev ? curr : prev;
        }, values[0]);
        var processedValues =values;
        if (minValue < 0 ) {
            processedValues = values.map(value => value - minValue);
        }
        const temp_outside = values[values.length - 1] / 10;
        res.send({
            frames: [
                {
                    text: temp_outside + "°",
                    icon: "i7066",
                    index: 0
                },
                {
                    chartData: processedValues,
                    index: 1
                }
            ]
        })
    })
    .catch(e => console.log(e));
})

server.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}!`))