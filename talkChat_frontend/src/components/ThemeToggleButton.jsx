import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import {IconButton} from "@mui/material";

const ThemeToggleButton = ({ mode, setMode }) => {
    return (
        <IconButton
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          color="inherit"
        >
          {mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
      )
}

export default ThemeToggleButton