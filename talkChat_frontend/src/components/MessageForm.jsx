import { useState } from 'react'

import {Box, Button, TextField } from "@mui/material"

const MessageForm = ({ addMessage, username, currentChatId }) => {

    const [messageContent, setMessageContent] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (messageContent) {
            addMessage({ username, messageContent }, currentChatId)
            setMessageContent('')
        }
    }

    return (
            <Box component="form" onSubmit={handleSubmit}>

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