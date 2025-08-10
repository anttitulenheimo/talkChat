import {useEffect, useState} from 'react'
import ChatDisplay from "./components/ChatDisplay.jsx"
import ChatList from "./components/ChatList.jsx"
import { io } from 'socket.io-client'

import { Typography } from '@mui/material'



const exampleMessages = [
    {
        sender: "Hessu",
        messageContent: "Sup mates"
    },
    {
        sender: "Mikki",
        messageContent: "Test"
    }
]

function App() {

  const [messages, setMessages] = useState(exampleMessages)
  const [socket, setSocket] = useState(null)

    //TODO: Contain the websocket handling to /services/chatSocketService.js
    useEffect(() => {
        const newSocket = io('http://localhost:8080')
        setSocket(newSocket)

        // Socket connection handlers
        newSocket.on('connect', () => {
            console.log('Connected to server with ID:', newSocket.id)
            console.log('Socket connected:', newSocket.connected)
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server')
        })

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error)
        })

        newSocket.on('chat message', newMessage => {
            console.log('Received message:', newMessage)
            setMessages(prevMessages => [...prevMessages, newMessage])
        })

        return () => {
            newSocket.close()
        }
    }, [])


    const addMessage = (newMessage) => {
        if (socket && socket.connected) {
            console.log('Sending Message:', newMessage)
            socket.emit('chat message', newMessage)
        } else {
            console.error('Socket not connected')
        }
    }


  return (
      //TODO: Create different chat boxes that are rendered conditionally this means every chat needs an id
    <>
      <div>
          <Typography variant="h4" gutterBottom>
              Conversations
          </Typography>
          <ChatList></ChatList>
          <ChatDisplay messages={messages} addMessage={addMessage} />
      </div>
    </>
  )
}

export default App