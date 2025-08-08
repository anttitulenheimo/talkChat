import { useState } from 'react'

const MessageForm = ({ addMessage }) => {
    const [sender, setSender] = useState('')
    const [messageContent, setMessageContent] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (sender && messageContent) {
            addMessage({ sender, messageContent })
            setSender('')
            setMessageContent('')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    Sender:
                    <input
                        type="text"
                        placeholder="sender"
                        value={sender}
                        onChange={(event) => setSender(event.target.value)}
                    />
                </div>
                <div>
                    Message:
                    <input
                        type="text"
                        placeholder="message"
                        value={messageContent}
                        onChange={(event) => setMessageContent(event.target.value)}
                    />
                    <button type="submit">Send</button>
                </div>
            </form>
        </div>
    )
}

export default MessageForm