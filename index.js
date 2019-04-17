const express = require('express')
const firebase = require("firebase");
const config = require("./config");

console.log("Initializing Firebase DB...");
firebase.initializeApp(config.db);
console.log("Firebase DB started");


const server = express();
server.get('/', (req, res) => {
    console.log("DB > ref('/hello/')");

    firebase.database().ref('/hello/').once('value')
    .then(snapshot => res.send(snapshot.val()))
    .catch(e => console.log(e));
})

server.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`))