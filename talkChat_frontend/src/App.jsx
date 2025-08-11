import {useEffect, useState} from 'react'
import ChatDisplay from "./components/ChatDisplay.jsx"
import ChatList from "./components/ChatList.jsx"
import loginService from "./services/loginService.js"
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


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



    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
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


    const handleLogin = async (event) => {
      event.preventDefault()
      console.log('loggin in with', username, password)
      try {
          const user = await loginService.login({
              username, password
          })
          setUser(user)
          window.localStorage.setItem('loggedUser', JSON.stringify(user))
          setUsername('')
          setPassword('')
      } catch (error) {
          console.log('Error when logging in', error)
      }
    }


    const handleLogout = (event) => {
        event.preventDefault()
        console.log('logging out', user)
        window.localStorage.removeItem('loggedUser')
        location.reload()
    }



  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const chatForm = () => (
      <div>
         <Typography variant="h4" gutterBottom>
                  Conversations
         </Typography>
         <ChatList></ChatList>
         <ChatDisplay messages={messages} addMessage={addMessage} />
         <button onClick={handleLogout}>log out</button>
     </div>
    )


  return (
      <div>
          {!user && loginForm()}
          {user && chatForm()}
      </div>
  )
}

export default App