import {useEffect, useState} from "react"
import messageService from "../services/messageService.js"
import userService from "../services/userService.js"
import chatService from "../services/chatService.js"
import ChatDisplay from "./ChatDisplay.jsx";
import {Avatar, Box, Card, CardContent, Divider, List, ListItemAvatar, ListItemButton, Typography} from "@mui/material";
import _ from "lodash";

const ChatList = ({ userId, addMessage, username, socket }) => {
  const [chats, setChats] = useState([])
  const [currentMessages, setCurrentMessages] = useState(null)
  const [chatId, setCurrentChatId] = useState(null)
  const [loadingChats, setLoadingChats] = useState(true)
  const [latestMessages, setLatestMessages] = useState({})


    useEffect(() => {
      if (!socket || !chatId) return

      let active = true

      const handleMessage = (msg) => {
        if (!active) return


        setCurrentMessages((prev) => (prev ? [...prev, msg] : [msg]))


        setLatestMessages((prev) => ({
          ...prev,
          [chatId]: msg.messageContent
        }))
      }


      socket.on("chat message", handleMessage)
      socket.on("message", handleMessage)

      return () => {
        active = false
        socket.off("chat message", handleMessage)
        socket.off("message", handleMessage)
      }
    }, [socket, chatId])



  // Loads latest chat messages to display previews
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
  }, [chats])

  // Load chats
  useEffect(() => {
    if (!userId) return
    setLoadingChats(true)
    chatService
      .getChats(userId)
      .then(async (rawDatabaseChats) => {
        const parsedChats = await Promise.all(
          rawDatabaseChats.map(async (chat) => {
            try {
              const anotherUser = chat.participants.find(
                (participant) => participant._id !== userId
              )

              if (!anotherUser) {
                console.error("Could not find another user in chat:", chat)
                return null
              }

              return {
                ...chat,
                anotherUser: anotherUser._id,
                anotherUserName: anotherUser.username
              }
            } catch (error) {
              console.error("Error in the Chatlist find chats useEffect", error)
              return null
            }
          })
        )
        setChats(parsedChats.filter((chat) => chat !== null))
        setLoadingChats(false)
      })
      .catch((error) => {
        console.error("Error fetching chats:", error)
        setLoadingChats(false)
      })
  }, [userId])

  // Load messages for a chat
  const fetchMessages = async (chatId) => {
    try {
      const rawDatabaseMessages = await messageService.getMessages(chatId)

      return await Promise.all(
          rawDatabaseMessages.map(async (message) => {
              try {
                  const sender = message.senderId?.id ?? message.senderId
                  const userInfo = sender
                      ? await userService.searchByUserId(sender)
                      : null
                  return {
                      username: userInfo?.username || "Unknown User",
                      messageContent: message.text ?? message.messageContent ?? ""
                  }
              } catch (error) {
                  console.error("Error fetching user:", error)
                  return {
                      username: "Unknown User",
                      messageContent: message.text ?? message.messageContent ?? ""
                  }
              }
          })
      )
    } catch (error) {
      console.error("Error when fetching messages", error)
      return []
    }
  }

  const handleUsernameClick = async (event, clickedChatId) => {
    event.preventDefault()

    // Join the room first to avoid missing early realtime messages
    if (socket) {
      socket.emit("join chat", clickedChatId)
    }

    const fetchedMessages = await fetchMessages(clickedChatId)
    setCurrentMessages(fetchedMessages)
    setCurrentChatId(clickedChatId)
  }

  const handleBackToChats = () => {
    if (socket && chatId) {
      socket.emit("leave chat", chatId)
    }
    setCurrentChatId(null)
    setCurrentMessages(null)
  }

  const truncate = (text, maxLength = 30) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "…" : text
  }

  const chatListComponent = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chats
        </Typography>
        <List>
          {chats.map((chat) => (
            <div key={chat.id}>
              <ListItemButton onClick={(event) => handleUsernameClick(event, chat.id)}>
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
              <Divider />
            </div>
          ))}
          {!loadingChats && chats.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No chats available
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  )

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