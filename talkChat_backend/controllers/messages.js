const messageRouter = require('express').Router()
const Message = require('../models/message')
const mongoose = require('mongoose')

// Works. Get needs chatId not messageId as a param...
messageRouter.get('/:chatId', async (request, response) => {
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


module.exports = messageRouter