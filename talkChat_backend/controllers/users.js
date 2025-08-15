const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

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
usersRouter.get('/:username', async (request, response) => {

    try {
      const { username } = request.params
      const user = await User.findOne({ username: username})
      response.json(user)
    } catch (error) {
        return response.status(404).json({error: 'Username not found'})
    }
})



module.exports = usersRouter