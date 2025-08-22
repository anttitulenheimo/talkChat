const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Chat = require('../models/chat')
const Message = require('../models/message')

const api = supertest(app)

const constantTestUser = {
    username: 'Deus',
    name: 'Maximus Decimus Meridius',
    password: 'easy'
}
beforeEach(async () => {
    await User.deleteMany({})
    await Chat.deleteMany({})
    
})

describe('USERTEST1: A new user can be created and the data is send to database', () => {

    test('user can be created', async () => {

    await api
        .post('/api/users/')
        .send(constantTestUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
})

describe('USERTEST2: A new user is created and the user can login', () => {

    test('Created user can login', async () => {

    await api
        .post('/api/users/')
        .send(constantTestUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/login/')
        .send({username: constantTestUser.username, password: constantTestUser.password})
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
})
describe('USERTEST3: User can create a new chat with another user', () => {

    test('Create a new chat', async () => {

        await api   // CREATE USER#1
            .post('/api/users/')
            .send(constantTestUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        await api   // CREATE USER#2
            .post('/api/users/')
            .send({username: "AnotherUser", name: "Your neighbour David", password: 'abc123'})
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const responseUserOne = await api
            .get(`/api/users/username/${constantTestUser.username}`)
            .expect(200)

        const responseUserTwo = await api 
            .get(`/api/users/username/${"AnotherUser"}`)
            .expect(200)

        await api   // Creating a POST request for a new chat
            .post('/api/chats')
            .send({senderId: responseUserOne.body.id, receiverId: responseUserTwo.body.id})
            .expect(201)
    })
})

describe('CHAT-TEST1: A new chat is not created if it already exists between two users', () => {
    test('creating two chats', async () => {
        
        const userOne = await api //Creating two users
            .post('/api/users/')
            .send(constantTestUser)
            .expect(201)

        const userTwo = await api
            .post('/api/users/')
            .send({ username: 'AnotherUser', name: 'David', password: 'abc123' })
            .expect(201)

        const userOneId = userOne.body.id
        const userTwoId = userTwo.body.id

        
        await api   // Create first chat
            .post('/api/chats')
            .send({ senderId: userOneId, receiverId: userTwoId })
            .expect(201)

        
        await api   // This should return 400
            .post('/api/chats')
            .send({ senderId: userOneId, receiverId: userTwoId })
            .expect(400)
    })
})

after(async () => {
  await mongoose.connection.close()
})