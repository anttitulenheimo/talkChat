import { List, ListItem, ListItemAvatar, Avatar, Paper, Typography, Box } from '@mui/material'

const MessageDisplay = ({ messages }) => {

    if (!messages) {
        return (
            <div>No messages to display</div>
        )
    }

    return(

            <List>
                {messages.map( (message, index) =>
                    <ListItem key={`${message.username}-${index}`} alignItems="flex-start">

                        <ListItemAvatar>
                            <Avatar>{message.username.substring(0, 2).toUpperCase()}</Avatar>
                        </ListItemAvatar>

                          <Box display="flex" flexDirection="column" maxWidth="70%">

                            <Typography variant="subtitle2" color="textSecondary">
                              {message.username}
                            </Typography>

                            <Paper elevation={2} style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #ccc' }}>

                              <Typography variant="body1">{message.messageContent}</Typography>

                            </Paper>
                          </Box>
                    </ListItem>
                )}
            </List>


    )
}

export default MessageDisplay