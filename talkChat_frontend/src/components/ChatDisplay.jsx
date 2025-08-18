import MessageDisplay from "./MessageDisplay.jsx"
import {Box, Button} from "@mui/material";
import MessageForm from "./MessageForm.jsx"

const ChatDisplay = ({ messages, addMessage, username, onBack, currentChatId }) => {
    return (
        <Box
            border={1}
            borderColor="grey.400"
            borderRadius={2}
            p={2}
            maxHeight="400px"
            overflow="auto"
        >
            <MessageDisplay messages={messages}/>
            <MessageForm addMessage={addMessage} username={username} currentChatId={currentChatId} />
            <Button variant="outlined" onClick={onBack}>Back</Button>

        </Box>
    )
}

export default ChatDisplay