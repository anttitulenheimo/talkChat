import { List, ListItem, ListItemAvatar, Avatar, Paper, Typography, Box } from '@mui/material'

const MessageDisplay = ({ messages }) => {


    return(
        <Box
          border={1}
          borderColor="grey.400"
          borderRadius={2}
          p={2}
          maxHeight="400px"
          overflow="auto"
        >
            <List>
                <Typography variant="h5" gutterBottom>
                Current chat
                </Typography>
                {messages.map( (message, index) =>
                    <ListItem key={index} alignItems="flex-start">

                        <ListItemAvatar>
                            <Avatar>{message.sender.substring(0, 2).toUpperCase()}</Avatar>
                        </ListItemAvatar>

                          <Box display="flex" flexDirection="column" maxWidth="70%">

                            <Typography variant="subtitle2" color="textSecondary">
                              {message.sender}
                            </Typography>

                            <Paper elevation={2} style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #ccc' }}>

                              <Typography variant="body1">{message.messageContent}</Typography>

                            </Paper>
                          </Box>
                    </ListItem>
                )}
            </List>
        </Box>

    )
}

export default MessageDisplay