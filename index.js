const express = require('express')

const app = express();
const PORT = process.env.PORT || 5000

const NAME = proc.env.NAME || "Unknown"

app.get('/', (req, res) => res.send(`Hello ${NAME}!`))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))