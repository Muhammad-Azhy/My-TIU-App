import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../Styles/theme";

export default function useTheme() {
  const mode = useSelector((state) => state.theme.mode);
  return mode === "dark" ? darkTheme : lightTheme;
}
