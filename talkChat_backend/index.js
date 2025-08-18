const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose  = require('mongoose')
const config = require('./utils/config')

const Message = require('./models/message')
const Chat = require('./models/chat')


const app = express()
app.use(express.json())
app.use(cors())

// Rate limiter for getAllChats endpoint
const getAllChatsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

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

// Works. Get needs chatId not messageId as a param...
app.get('/api/messages/:chatId', async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.chatId)) {
      return response.status(400).json({ error: 'Invalid chatId format' })
    }

    const chatId = new mongoose.Types.ObjectId(request.params.chatId)

    const messages = await Message
      .find({ chatId })
      .populate('senderId', 'username')

    response.json(messages)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/getAllChats/:userId', getAllChatsLimiter, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.userId)) {
      return response.status(400).json({ error: 'Invalid userId format' })
    }

    const userId = new mongoose.Types.ObjectId(request.params.userId)

    const chats = await Chat
      .find({ participants: userId })
      .populate('participants', 'username')
    response.json(chats)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/chats', async (request, response) => {   // Creating a chat with another user
  const { senderId, receiverId } = request.body

  try {
    const chat = new Chat({
      participants: [receiverId, senderId]
    })
    const savedChat = await chat.save()
    response.status(201).json(savedChat)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})



httpServer.listen(config.PORT, () => {
  console.log(`listening on ${config.PORT}`)
})

