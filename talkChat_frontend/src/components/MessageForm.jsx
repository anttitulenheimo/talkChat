import { useState } from 'react'

import {Box, Button, TextField } from "@mui/material"

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
            <Box component="form" onSubmit={handleSubmit}>

                <Box mb={2}>
                    Sender:
                    <input //TODO: REMOVE THIS AFTER IMPLEMETING THE LOGIN
                        type="text"
                        placeholder="sender"
                        value={sender}
                        onChange={(event) => setSender(event.target.value)}
                    />
                </Box>

                <TextField
                    label="Write a message"
                    variant="outlined"
                    value={messageContent}
                    onChange={(event) => setMessageContent(event.target.value)}
                    fullWidth
                />

                    <Button type="submit" variant="contained">
                        Send
                    </Button>
            </Box>
    )
}

export default MessageForm