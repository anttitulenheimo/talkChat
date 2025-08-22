const http = require('http')
const { Server } = require('socket.io')

const mongoose  = require('mongoose')
const config = require('./utils/config')

const Message = require('./models/message')

const app = require('./app')



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

