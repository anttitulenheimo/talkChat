import { List, ListItem, ListItemAvatar, Avatar, Paper, Typography, Box } from '@mui/material'

const MessageDisplay = ({ messages, signedUser }) => {

    if (!messages) {
        return (
            <div>No messages to display</div>
        )
    }

  return (
    <List>
      {messages.map((message, index) => {
        const isSignedUser = message.username === signedUser

        return (
          <ListItem
            key={`${message.username}-${index}`}
            alignItems="flex-start"
            sx={{
              display: "flex",
              justifyContent: isSignedUser ? "flex-end" : "flex-start", // Right side : Left side
            }}
          >
            {/*Other senders are on the left side */}
            {!isSignedUser && (
              <>
                <ListItemAvatar>
                  <Avatar>{message.username.substring(0, 2).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <Box display="flex" flexDirection="column" maxWidth="70%">
                  <Typography variant="subtitle2" color="textSecondary">
                    {message.username}
                  </Typography>
                  <Paper
                    elevation={2}
                    sx={{
                      p: "8px 16px",
                      borderRadius: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <Typography variant="body1">{message.messageContent}</Typography>
                  </Paper>
                </Box>
              </>
            )}

            {/* Signed user on the right side*/}
            {isSignedUser && (
              <>
                <Box
                  display="flex"
                  flexDirection="column"
                  maxWidth="70%"
                  alignItems="flex-end"
                >
                  <Typography variant="subtitle2" color="textSecondary">
                    You
                  </Typography>
                  <Paper
                    elevation={2}
                    sx={{
                      p: "8px 16px",
                      borderRadius: "12px",
                      border: "1px solid #ccc",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    <Typography variant="body1">{message.messageContent}</Typography>
                  </Paper>
                </Box>
                <ListItemAvatar>
                  <Avatar>{message.username.substring(0, 2).toUpperCase()}</Avatar>
                </ListItemAvatar>
              </>
            )}
          </ListItem>
        )
      })}
    </List>
  )
}

export default MessageDisplay