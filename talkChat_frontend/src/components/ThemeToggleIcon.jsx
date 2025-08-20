import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"

const ThemeToggleIcon = ({ mode }) => {
  return mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />
}

export default ThemeToggleIcon