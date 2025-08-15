import {useEffect, useState} from 'react'
import { io } from 'socket.io-client'
// Components
import ChatDisplay from "./components/ChatDisplay.jsx"
import ChatList from "./components/ChatList.jsx"
import FindUser from './components/FindUser.jsx'
// Services
import loginService from "./services/loginService.js"
import userService from './services/userService.js'
// Styling
import {Typography, Box, Collapse, Button, TextField, ThemeProvider, createTheme} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useColorScheme } from '@mui/material/styles'

const darkTheme = createTheme({
  colorSchemes: {
    light: 'true',
    dark: 'true',
  },
})

// This is wrong because messages have a different schema
const exampleMessages = [
    {
        username: "Hessu",
        messageContent: "Sup mates"
    },
    {
        username: "Mikki",
        messageContent: "Test"
    }
]

// Changes the themes between dark and light
function ThemeToggleButton() {
  const { mode, setMode } = useColorScheme()

  const handleToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="outlined" onClick={handleToggle}>
      {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
}

function App() {

  const [messages, setMessages] = useState(exampleMessages)
  const [socket, setSocket] = useState(null)

  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [findUsername, setFindUsername] = useState('')  // For the username search
  const [foundUser, setFoundUser] = useState('') // Saving the username when its found via search

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


    // Searches for the possible token
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        const loggedUsernameJson = window.localStorage.getItem('loggedUsername')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            const username = JSON.parse(loggedUsernameJson)
            setUser(user)
            setUsername(username)
        }
    }, [])


    // Sends a message
    const addMessage = (newMessage) => {
        if (socket && socket.connected) {
            console.log('Sending Message:', newMessage)
            socket.emit('chat message', newMessage)
        } else {
            console.error('Socket not connected')
        }
    }


    const handleLogout = (event) => {
        event.preventDefault()
        console.log('logging out', user)
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('loggedUsername')
        location.reload()
    }


    const handleUsernameSubmit = (event) => {
        event.preventDefault()
        if (username.trim()) {
            setStep(2)
        }
    }


    const handlePasswordSubmit = async (event) => {
        event.preventDefault()
        console.log('loggin in with', username, password)
        try {
            const userData = await loginService.login({ username, password })
            setUser(userData)
            window.localStorage.setItem('loggedUser', JSON.stringify(userData))
            window.localStorage.setItem('loggedUsername', JSON.stringify(username))
            setPassword('')
        } catch (error) {
            console.log('Error when logging in', error)
        }
    }

    const handleFindUser = async (event) => {
        event.preventDefault()
        try {
            const findingUser = await userService.search(findUsername)
            //console.log(`Found username: ${JSON.stringify(findingUser)}`)
            setFoundUser(findingUser.username)
            //console.log(findUsername)
        } catch (error) {
            console.log('Find user not working :(')
        }
    }

    // Shows the login part of the app
    const loginForm = () => (
            <Box
                component="form"
                onSubmit={step === 1 ? handleUsernameSubmit : handlePasswordSubmit}
                sx={{ width: 300, margin: 'auto', mt: 5 }}
            >
                <Collapse in={step === 1}>
                    {step === 1 && (
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                                Continue
                            </Button>
                            <Button variant="outlined" fullWidth onClick={() => console.log('pressed sign up')}>
                            Sign up
                            </Button>

                        </Box>
                    )}
                </Collapse>

                <Collapse in={step === 2}>
                    {step === 2 && (
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                                Log in
                            </Button>
                            <Button variant="outlined" fullWidth onClick={() => setStep(1)}>
                            Back
                            </Button>

                        </Box>
                    )}
                </Collapse>
            </Box>
        )

  // Shows the chat part of the app
  const chatForm = () => (
      <div>
         <Typography variant="h4" gutterBottom>
                  Conversations
         </Typography>
         <FindUser 
            findUsername={findUsername}
            setFindUsername={setFindUsername}
            handleFindUser={handleFindUser}
            foundUser={foundUser}
            setFoundUser={setFoundUser}
          />
         <ChatList></ChatList>
         <ChatDisplay messages={messages} addMessage={addMessage}  username={username} />
         <button onClick={handleLogout}>log out</button>
     </div>
    )


  return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {!user && loginForm()}
          {user && chatForm()}

          <ThemeToggleButton />
      </ThemeProvider>
  )
}

export default App