import MessageDisplay from "./MessageDisplay.jsx"
import {Box} from "@mui/material";
import MessageForm from "./MessageForm.jsx"

const ChatDisplay = ({ messages, addMessage, username }) => {
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
            <MessageForm addMessage={addMessage} username={username} />

        </Box>
    )
}

export default ChatDisplay