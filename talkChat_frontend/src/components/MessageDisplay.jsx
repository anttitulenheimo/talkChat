const MessageDisplay = ({ messages }) => {

    return(
        <div>
            {messages.map( (message, index) =>
                <p key={index}>
                    Sender: {message.sender} Message: {message.messageContent}
                </p>
            )}
        </div>
    )
}

export default MessageDisplay