import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";
import { darkTheme, lightTheme } from "../themes/theme";

const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";
const TOGGLE_THEME = "TOGGLE_THEME";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT,
  };
};

export const toggleTheme = () => {
  return {
    type: TOGGLE_THEME,
  };
};

const appReducer = combineReducers({
  user,
  conversations,
  activeConversation,
});
const rootReducer = (state, action) => {
  if (action.type === CLEAR_ON_LOGOUT) {
    // set state to initial state
    state = undefined;
  } else if (action.type === TOGGLE_THEME) {
    const isDark =
      localStorage.getItem("dark-mode") &&
      localStorage.getItem("dark-mode") === "true";
    localStorage.setItem("dark-mode", isDark ? "false" : "true");
    return { ...state, theme: isDark ? lightTheme : darkTheme };
  }
  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
);
