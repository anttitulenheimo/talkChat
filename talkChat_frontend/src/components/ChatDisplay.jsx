import MessageDisplay from "./MessageDisplay.jsx"
import {Box, AppBar, Toolbar, IconButton, Typography} from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MessageForm from "./MessageForm.jsx"

const ChatDisplay = ({ messages, addMessage, username, onBack, currentChatId }) => {
    return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: 'calc(100vh - 70px)',
                position: 'relative',
                overflow: 'hidden',
                pb: 2
            }}>
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
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: '120px'
                    }}
                >
                    <Box sx={{ p: 2, flex: 1 }}>
                        <MessageDisplay messages={messages} signedUser={username}/>
                    </Box>
                </Box>
                
                <Box sx={{ 
                    position: 'fixed', 
                    bottom: '70px',
                    left: 0,
                    right: 0,
                    padding: '8px 16px 16px 16px',
                    backgroundColor: 'background.paper',
                    boxShadow: '0px -4px 6px -1px rgba(0,0,0,0.2)',
                    zIndex: 999,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                    <MessageForm addMessage={addMessage} username={username} currentChatId={currentChatId} />
                </Box>
        </Box>
    )
}

export default ChatDisplay