import { createTheme } from "@material-ui/core";

const base = {
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold",
    },
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "bold",
      },
    },
  },
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#B0B0B0" },
  },
};

export const lightTheme = createTheme(base);
export const darkTheme = createTheme({
  ...base,
  palette: { ...base.pallete, type: "dark" },
});
