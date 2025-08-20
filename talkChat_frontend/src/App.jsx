import {useEffect, useState} from 'react'
import { io } from 'socket.io-client'
// Components
import ChatList from "./components/ChatList.jsx"
import FindUser from './components/FindUser.jsx'
import ThemeToggleIcon from "./components/ThemeToggleIcon.jsx"

// Services
import loginService from "./services/loginService.js"

import userService from './services/userService.js'
// Styling
import {
    Typography,
    Box,
    Collapse,
    Button,
    TextField,
    ThemeProvider,
    BottomNavigationAction,
    BottomNavigation
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from "./theme.jsx"
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'

import chatService from './services/chatService.js'


function App() {
  // Sets the default theme when opening the app
  const [mode, setMode] = useState('dark')

  const [navValue, setNavValue] = useState(0) // 0 == chats, 1 == Search user, 2 == Settings


  const [socket, setSocket] = useState(null)

  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [register, setRegister] = useState(false)

  const [findUsername, setFindUsername] = useState('')  // For the username search
  const [foundUser, setFoundUser] = useState('') // Saving the username when it's found via search

  const [newUser, setNewUser] = useState('') // For SignUp form to save new user details
  const [newName, setNewName] = useState('') //
  const [newUserPassword, setNewUserPassword] = useState('')

  const [id, setId] = useState('') // For the chatlist component

  const [receiverUserId, setReceiverUserId] = useState(null) // This is for creating new chat connection with a user

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

        return () => {
            newSocket.close()
        }
    }, [])


    // Searches for the possible token
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        const loggedUsernameJSON = window.localStorage.getItem('loggedUsername')
        const loggedUserIdJSON = window.localStorage.getItem('loggedUserId')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            const username = JSON.parse(loggedUsernameJSON)
            const id = JSON.parse(loggedUserIdJSON)
            setUser(user)
            setUsername(username)
            setId(id)
        }
    }, [])



    // Sends a message
    const addMessage = (newMessage, chatId) => {
        if (socket && socket.connected && chatId) {
            const messageData = {
                text: newMessage.messageContent,
                sender: id,
                chatId: chatId
            }
            console.log('Sending Message:', messageData)
            socket.emit('chat message', messageData)
        } else {
            console.error('Socket not connected or missing chatId')
        }
    }


    const handleLogout = (event) => {
        event.preventDefault()
        console.log('logging out', user)
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('loggedUsername')
        window.localStorage.removeItem('loggedUserId')
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
            const userData = await loginService.login({ username, password, id })
            setUser(userData)
            setId(userData.id)
            window.localStorage.setItem('loggedUser', JSON.stringify(userData))
            window.localStorage.setItem('loggedUsername', JSON.stringify(username))
            window.localStorage.setItem('loggedUserId', JSON.stringify(userData.id))
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
            setReceiverUserId(findingUser.id) // save searched users Id for creating a chat.
            //console.log(receiverUserId)

        } catch (error) {
            console.log('Find user not working :(')
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const userObject = {
                username: newUser,
                name: newName,
                password: newUserPassword
            }
            await userService.register(userObject)
            console.log(`Added a new user to database\n${JSON.stringify(userObject)}`)
            setNewUser('')
            setNewName('')
            setNewUserPassword('')
            setRegister(false)
        } catch (err) {

            console.error("Caught error:", err)
        }
    }


    const handleNewChat = async () => {
        const getLoggedUserId = JSON.parse(window.localStorage.getItem('loggedUserId'))
        try {
             
            const chatObject = {
                senderId: getLoggedUserId,
                receiverId: receiverUserId
            }
            await chatService.newChat(chatObject)
        } catch (error) {
            console.log(error)

        }
    }

    const SignUpForm = () => {
        return (
            <Box sx={{ width: 300, margin: 'auto', mt: 5 }}>
                <Box component='form' onSubmit={handleRegister}>
                        <Typography variant="h3" component="h4" color='primary' align='center'>
                            Sign up
                        </Typography>
                    <Box>
                        <TextField sx={{ width: '100%' }} type='text' placeholder='Enter your username' value={newUser} onChange={({ target }) => setNewUser(target.value)} />
                    </Box>
                    <Box>
                        <TextField sx={{ width: '100%' }} type='text' placeholder='Enter your name' value={newName} onChange={({ target }) => setNewName(target.value)} />
                    </Box>
                    <Box>
                        <TextField sx={{ width: '100%' }} type='password' placeholder='Enter your password' value={newUserPassword} onChange={({ target }) => setNewUserPassword(target.value)} />
                    </Box>
                    <Button sx={{ width: '50%', borderRadius: 2 }} variant="outlined" onClick={() => setRegister(false)}>Back</Button>
                    <Button sx={{ width: '50%', borderRadius: 2 }} variant="contained"  type='submit'>Register</Button>
                </Box>
            </Box>
        )
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

                            <Button variant="contained"
                                    type="submit"
                                    fullWidth
                                    sx={{ mt: 2 }}>
                                Continue
                            </Button>
                            <Button variant="outlined" fullWidth onClick={() => setRegister(true)}>
                            Sign up
                            </Button >

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
         <ChatList userId={id} addMessage={addMessage} username={username} socket={socket}></ChatList>
         <Button variant="outlined" onClick={handleLogout}>log out</Button>
     </div>
    )

    const navigationForm = () => (
      <BottomNavigation
        showLabels
        value={navValue}
        onChange={ (event, newValue) => setNavValue(newValue)}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          zIndex: 1000,
        }}
      >
      <BottomNavigationAction
          label="Chats"
          icon={<ChatBubbleOutlineOutlinedIcon />}
      />
      <BottomNavigationAction
          label="Search user"
          icon={<SearchOutlinedIcon />}
      />
      <BottomNavigationAction
          label="Settings"
          icon={<SettingsOutlinedIcon />}
      />
      <BottomNavigationAction
        label="Theme"
        icon={<ThemeToggleIcon mode={mode} />}
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      />
      </BottomNavigation>
    )


  return (
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
          <CssBaseline />

          {!user && (
            <>
            {loginForm()}
            {register ? (SignUpForm()) : (<Box></Box>)}
            </>)}

          {user && (
              <>
                {navValue === 0 && chatForm()}
                {navValue === 1 && (
                    <FindUser
                        findUsername={findUsername}
                        setFindUsername={setFindUsername}
                        handleFindUser={handleFindUser}
                        foundUser={foundUser}
                        setFoundUser={setFoundUser}
                        handleNewChat={handleNewChat}
                    />
                )}
                  {navValue === 3 && (
                      <div>
                      </div>
                  )}
                {navigationForm()}
              </>
            )}

      </ThemeProvider>
  )
}

export default App