import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 8080

app.use(express.static('public'))

app.get('/config.json', (req, res) => res.send({
    repeatColors: (process.env.REPEAT_COLORS == 'true' || false),
    debugMode: (process.env.DEBUG_MODE == 'true' || false),
}))

server.listen(port, () => {
    console.log(`> Server listening on port: ${port}`)
})
