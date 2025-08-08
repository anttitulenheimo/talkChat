const MessageDisplay = ({ messages }) => {
    return(
        <div>
            {messages.map(message =>
                <p key={message.sender}>Sender: {message.sender} Message: {message.messageContent}</p>
            )}
        </div>
    )
}

export default MessageDisplay