import {useEffect, useState} from "react"
import messageService from "../services/messageService.js"
import userService from "../services/userService.js"
import chatService from "../services/chatService.js"
import ChatDisplay from "./ChatDisplay.jsx";
import { Card, CardContent, List, ListItemButton, ListItemAvatar, ListItem, Avatar, Typography, Divider, Box, Button } from "@mui/material";
import ThreeDotsMenu from './ThreeDotsMenu.jsx'

import _ from "lodash";


const ChatList = ({ userId, addMessage, username, socket }) => {
    const [chats, setChats] = useState([])
    const [currentMessages, setCurrentMessages] = useState(null)
    const [chatId, setCurrentChatId] = useState(null)
    const [loadingChats, setLoadingChats] = useState(true)
    const [latestMessages, setLatestMessages] = useState({})

    // Handle chat messages
    useEffect(() => {
        if (socket && chatId) {
            const handleMessage = (newMessage) => {
                console.log('Received message for current chat:', newMessage)
                setCurrentMessages(prevMessages => [...prevMessages, newMessage])
            }

            socket.on('chat message', handleMessage)

            return () => {
                socket.off('chat message', handleMessage)
            }
        }
    }, [socket, chatId])


    // Loads latest chat messages to display
    useEffect(() => {
        const loadLatestMessages = async () => {
            const result = {}
            for (const chat of chats) {
                const messages = await fetchMessages(chat.id)
                if (messages.length > 0) {
                    result[chat.id] = _.last(messages).messageContent
                }
            }
            setLatestMessages(result)
        }
        if (chats.length > 0) {
            loadLatestMessages()
        }
    }, [chats]);



    // Load chats
    useEffect(() => {
        if (!userId) return
        setLoadingChats(true)
        chatService.getChats(userId)
            .then(async rawDatabaseChats => {
                const parsedChats = await Promise.all(
                    rawDatabaseChats.map(async chat => {
                        try {

                            const anotherUser = chat.participants.find(participant => {
                                return participant._id !== userId // _.id works for the mongodb
                                }
                            )

                            if (!anotherUser) {
                                console.error('Could not find another user in chat:', chat)
                                return null
                            }

                            return {
                                ...chat,
                                anotherUser: anotherUser._id,
                                anotherUserName: anotherUser.username,
                            }
                        } catch (error) {
                            console.error('Error in the Chatlist find chats useEffect', error)
                            return null
                        }
                    })
                )
                setChats(parsedChats.filter(chat => chat !== null))
                setLoadingChats(false)
            })
            .catch(error => {
                console.error('Error fetching chats:', error)
                setLoadingChats(false)
            })
    }, [])



    // Load messages for a chat
    const fetchMessages = async (chatId) => {
        try {
            const rawDatabaseMessages = await messageService.getMessages(chatId)

            const parsedMessages = await Promise.all(
                rawDatabaseMessages.map(async message => {
                    try {
                        const userId = message.senderId.id
                        const userInfo = await userService.searchByUserId(userId)
                        return {
                            username: userInfo.username,
                            messageContent: message.text
                        }
                    } catch (error) {
                        console.error('Error fetching user:', error)
                        return {
                            username: 'Unknown User',
                            messageContent: message.text
                        }
                    }
                })
            )
            return parsedMessages
        } catch (error) {
            console.error('Error when fetching messages', error)
            return []
        }
    }

    const handleUsernameClick = async (event, chatId) => {
        event.preventDefault()
        const fetchedMessages = await fetchMessages(chatId)
        setCurrentMessages(fetchedMessages)
        setCurrentChatId(chatId)

        if (socket) {
            socket.emit('join chat', chatId)
        }
    }

    const handleBackToChats = () => {
        setCurrentMessages(null)
    }

    const truncate = (text, maxLength = 30) => { //Makes sure that too long messages are not displayed
      if (!text) return ""
      return text.length > maxLength
          ? text.substring(0, maxLength) + "…"
          : text
    }

    const chatListComponent = () => (
        <Card>
            <CardContent>
            <Typography variant="h6" gutterBottom>Chats</Typography>
            <List>
                {chats.map(chat => (
                <div key={chat.id}>
                    <ListItem
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 0 }}
                    >
                    {/* Left: clickable chat info */}
                    <ListItemButton
                        sx={{ flexGrow: 1, width: "100%"}}
                        onClick={(event) => handleUsernameClick(event, chat.id)}
                    >
                        <ListItemAvatar>
                        <Avatar>{chat.anotherUserName[0].toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <Box>
                        <Typography>{chat.anotherUserName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {truncate(latestMessages[chat.id]) || "No messages yet"}
                        </Typography>
                        </Box>
                    </ListItemButton>

                    {/* Right: three dots */}
                    <ThreeDotsMenu chatId={chat.id} chats={chats} setChats={setChats} />
                    </ListItem>
                    <Divider />
                </div>
                ))}

                {chats.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    No chats available
                </Typography>
                )}
            </List>
            </CardContent>
        </Card>
);

    const chatDisplayComponent = () => (
        <Box>
            <ChatDisplay
                messages={currentMessages}
                addMessage={addMessage}
                username={username}
                onBack={handleBackToChats}
                currentChatId={chatId}
            />
        </Box>
    )

    return (
        <Box sx={{ maxWidth: "auto", margin: "auto" }}>
            {!currentMessages && chatListComponent()}
            {currentMessages && chatDisplayComponent()}
        </Box>
    )
}

export default ChatList