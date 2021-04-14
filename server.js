import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

server.listen(8080, () => {
    console.log(`> Server listening on port: 8080`)
})
