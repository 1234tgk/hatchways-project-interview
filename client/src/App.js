import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

import { darkTheme, lightTheme } from "./themes/theme";
import Routes from "./routes";

const Inner = () => {
  const theme = useSelector((state) => state.theme);

  return (
    <MuiThemeProvider
      theme={
        theme ??
        (localStorage.getItem("dark-mode") === "true" ? darkTheme : lightTheme)
      }
    >
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Inner />
    </Provider>
  );
}

export default App;
