import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateConversation,
} from "./store/conversations";
import { readMessage } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    // read message for other user if conversationId and activeConversation is equal to one another
    if (data.message.conversationId === store.getState().activeConversation) {
      store.dispatch(readMessage(data.message.conversationId));
    }
  });
  socket.on("read-message", (data) => {
    store.dispatch(updateConversation(data));
  });
});

export default socket;
