const chatRouter = require('express').Router()
const Chat = require('../models/chat')
const rateLimit = require('express-rate-limit')
const mongoose  = require('mongoose')


// Rate limiter for getAllChats endpoint
const getAllChatsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
})

chatRouter.get('/:userId', getAllChatsLimiter, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.userId)) {
      return response.status(400).json({ error: 'Invalid userId format' })
    }

    const userId = new mongoose.Types.ObjectId(request.params.userId)

    const chats = await Chat
      .find({ participants: userId })
      .populate('participants', 'username')
    response.status(201).json(chats)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Server error' })
  }
})

chatRouter.post('/', async (request, response) => {   // Creating a chat with another user
  const { senderId, receiverId } = request.body

  try {
    const chatExists = await Chat.findOne({participants: { $all: [senderId, receiverId] }})
    if (chatExists) {
        return response.status(400).json({ error: "Chat already exists" })
    }
    const chat = new Chat({
      participants: [receiverId, senderId]
    })
    const savedChat = await chat.save()
    response.status(201).json(savedChat)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})


module.exports = chatRouter