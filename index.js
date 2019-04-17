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
        res.send(values)
    })
    .catch(e => console.log(e));
})

server.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`))