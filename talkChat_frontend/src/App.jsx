import {useEffect, useState} from 'react'
import MessageDisplay from "./components/MessageDisplay.jsx";
import MessageForm from "./components/MessageForm.jsx";
import messageService from "./services/messageService.js"

const exampleMessages = [
    {
        sender: "Hessu",
        messageContent: "Sup mates"
    },
    {
        sender: "Mikki",
        messageContent: "Kys"
    }
]

function App() {

  const [messages, setMessages] = useState(exampleMessages)

    useEffect(() => {
      messageService
        .getAll()
        .then(backendMessages => {
          setMessages([...exampleMessages, ...backendMessages])
        })
        .catch(error => {
          console.error('Error loading messages:', error)
        })
    }, [])


  const addMessage = async (newMessage) => {
    try {
      const savedMessage = await messageService.create(newMessage)
      setMessages([...messages, savedMessage])
    } catch (error) {
      console.error('Error saving message:', error)
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