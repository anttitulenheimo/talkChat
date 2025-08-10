const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const httpServer = http.createServer(app)

const ioServer = new Server(httpServer, {
    cors: {origin: "*"}
})

ioServer.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (data) => { // Custom event name = chat message. Fails if the event name is message!!
        console.log('id', socket.id)
        console.log('chat message', data)
        ioServer.emit('chat message', data)
    })
})

const PORT = 8080
httpServer.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

