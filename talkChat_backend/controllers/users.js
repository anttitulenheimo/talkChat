const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const mongoose = require('mongoose')

// Create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// Get username from database by username
usersRouter.get('/username/:username', async (request, response) => {

  try {
    const { username } = request.params
    const user = await User.findOne({ username: username })
    response.json(user)
  } catch (error) {
    return response.status(404).json({ error: error.message })
  }
})

// Get username from database by userId
usersRouter.get('/id/:userId', async (request, response) => {

  try {
    const { userId } = request.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.status(400).json({ error: 'Invalid userId format' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(user)
  } catch (error) {

    return response.status(500).json({ error: error.message })
  }
})




module.exports = usersRouter