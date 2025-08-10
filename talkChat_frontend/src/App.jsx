import {useEffect, useState} from 'react'
import MessageDisplay from "./components/MessageDisplay.jsx";
import MessageForm from "./components/MessageForm.jsx";
import { io } from 'socket.io-client'



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
    <>
      <div>
          <h2>Messages</h2>
          <MessageDisplay messages={messages} />
          <h2>Send a message</h2>
          <MessageForm addMessage={addMessage} />
      </div>
    </>
  )
}

export default App