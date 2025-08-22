const express = require('express')
const cors = require('cors')
const mongoose  = require('mongoose')
const config = require('./utils/config')
// ROUTERS
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const messageRouter = require('./controllers/messages')
const chatRouter = require('./controllers/chats')



const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/messages', messageRouter)
app.use('/api/chats', chatRouter)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch ((error) => {
    console.log(`Error connecting to MongoDB\nmessage: ${error.message}`)
  })

module.exports = app