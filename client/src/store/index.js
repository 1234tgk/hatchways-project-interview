import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";

const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";
const READ_ACTIVE_CHAT = "READ_ACTIVE_CHAT";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT,
  };
};

export const readActiveChat = () => {
  return {
    type: READ_ACTIVE_CHAT,
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
  }
  return appReducer(state, action);
};

// export default createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
);
