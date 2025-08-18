import {useEffect, useState} from "react"
import messageService from "../services/messageService.js"
import userService from "../services/userService.js"
import chatService from "../services/chatService.js"
import ChatDisplay from "./ChatDisplay.jsx";
import {Button} from "@mui/material";

const ChatList = ({ userId, addMessage, username, socket }) => {
    const [chats, setChats] = useState([])
    const [currentMessages, setCurrentMessages] = useState(null)
    const [chatId, setCurrentChatId] = useState(null)

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




    // For the chats
    useEffect(() => {
        //const realUserIdFromMongo = '689a3649b0d044b9d62ddb8e';

        chatService.getChats(userId)
            .then(async rawDatabaseChats => {
                const parsedChats = await Promise.all(
                    rawDatabaseChats.map(async chat => {
                        try {

                            const anotherUser = chat.participants.find(participant =>
                                participant._id !== userId
                            )

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
            })
            .catch(error => {
                console.error('Error fetching chats:', error)
            })
    }, [])



    // For the messages
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

    const chatListComponent = () => {
        return (
        <div>
            {chats.map(chat => (
              <div key={chat.id}>
                  <Button variant="contained" onClick={(event) => handleUsernameClick(event, chat.id)}>{chat.anotherUserName}</Button>
              </div>
            ))}
        </div>
    )
    }

    const chatDisplayComponent = () => {
        return (
            <div>
                <ChatDisplay messages={currentMessages}
                             addMessage={addMessage}
                             username={username}
                             onBack={handleBackToChats}
                             currentChatId={chatId}
                ></ChatDisplay>
            </div>
        )
    }

    return (
        <div>
            {!currentMessages && chatListComponent()}
            {currentMessages && chatDisplayComponent()}
        </div>
    )
}

export default ChatList