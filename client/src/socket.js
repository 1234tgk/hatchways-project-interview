import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { readMessage, updateUserReadCount } from "./store/utils/thunkCreators";

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
    store.dispatch(
      setNewMessage(
        data.message,
        data.sender,
        data.totalMessageCount,
        data.user1ReadCount,
        data.user2ReadCount
      )
    );
    store.dispatch(readMessage(data.conversationId));
  });

  socket.on("user-read-message", (data) => {
    store.dispatch(updateUserReadCount(data.conversationId));
  });
});

export default socket;
