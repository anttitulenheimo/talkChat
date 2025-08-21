import MessageDisplay from "./MessageDisplay.jsx"
import {Box, AppBar, Toolbar, IconButton, Typography} from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MessageForm from "./MessageForm.jsx"

const ChatDisplay = ({ messages, addMessage, username, onBack, currentChatId }) => {
    return (
            <Box>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={onBack}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Back
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box
                p={2}
                maxHeight="auto"
                overflow="auto"
                >
                    <MessageDisplay messages={messages} signedUser={username}/>
                    <MessageForm addMessage={addMessage} username={username} currentChatId={currentChatId} />
                </Box>
        </Box>
    )
}

export default ChatDisplay