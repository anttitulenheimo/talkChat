const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose  = require('mongoose')
const config = require('./utils/config')


const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

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

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch ((error) => {
        console.log(`Error connecting to MongoDB\nmessage: ${error.message}`)
    })

const PORT = 8080
httpServer.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

