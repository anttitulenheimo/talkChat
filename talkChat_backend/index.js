const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

// ROUTERS
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const messageRouter = require('./controllers/messages')
const chatRouter = require('./controllers/chats')

const mongoose  = require('mongoose')
const config = require('./utils/config')

const Message = require('./models/message')



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


const httpServer = http.createServer(app)

const ioServer = new Server(httpServer, {
  cors: { origin: '*' }
})

ioServer.on('connection', (socket) => {
  console.log('a user connected to the socket: ', socket.id)

  // Joining a chat
  socket.on('join chat', (chatId) => {
    socket.join(chatId)
    console.log(socket.id, 'joined the', chatId)
  })

  // Sending a chat message
  socket.on('chat message', async (data) => {
    try {
      const savedMessage = await Message.create({
        chatId: new mongoose.Types.ObjectId(data.chatId),
        senderId: new mongoose.Types.ObjectId(data.sender),
        text: data.text
      })

      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('senderId', 'username')

      const formattedMessage = {
        username: populatedMessage.senderId.username,
        messageContent: populatedMessage.text
      }

      ioServer.to(data.chatId).emit('chat message', formattedMessage)
    } catch (error) {
      console.log('Error when sending a chat message', error)
    }
  })
})




httpServer.listen(config.PORT, () => {
  console.log(`listening on ${config.PORT}`)
})

