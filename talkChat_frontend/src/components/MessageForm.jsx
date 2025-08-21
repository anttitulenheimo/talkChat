import { useState } from 'react'

import {Box, IconButton, TextField} from "@mui/material"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: '4px 8px'
        }}
      >
        <TextField
          label="Write a message"
          variant="outlined"
          value={messageContent}
          onChange={(event) => setMessageContent(event.target.value)}
          fullWidth
          sx={{ flex: 1, mr: 1 }}
        />

        <IconButton type="submit">
          <SendOutlinedIcon />
        </IconButton>
      </Box>
    )
}

export default MessageForm