import { useState } from 'react';
import { Autocomplete, TextField, Button, Card, CardContent, Typography } from '@mui/material';

const FindUser = ({ 
  findUsername,
  setFindUsername,
  handleFindUser,
  foundUser,
  setFoundUser,
  handleNewChat
}) => {
  const [options, setOptions] = useState([])

  // Search suggestions
  const handleInputChange = async (event, value) => {
    setFindUsername(value)
    setFoundUser('')

    if (value.length >= 2) {
      // const results = await userService.searchSuggestions(value);
      const results = [value]; // Returns username
      setOptions(results);
    } else {
      setOptions([]);
    }
  }

  return (
    <div>
      <form onSubmit={handleFindUser}>
        <Autocomplete
          freeSolo
          options={options}
          inputValue={findUsername}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField {...params} label="Search for user" variant="outlined" fullWidth />
          )}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Search</Button>
      </form>

      {foundUser && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Username <em>{foundUser}</em> found
            </Typography>
            <Button variant="contained" onClick={handleNewChat} sx={{ mt: 1 }}>
              Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FindUser;
