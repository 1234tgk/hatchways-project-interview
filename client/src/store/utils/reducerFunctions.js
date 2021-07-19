export const addMessageToStore = (state, payload) => {
  const { message, sender, totalMessageCount, user1ReadCount, user2ReadCount } =
    payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.totalMessageCount = totalMessageCount;
    newConvo.user1ReadCount = user1ReadCount;
    newConvo.user2ReadCount = user2ReadCount;
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.totalMessageCount = totalMessageCount;
      convoCopy.user1ReadCount = user1ReadCount;
      convoCopy.user2ReadCount = user2ReadCount;
      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

// if possible, make a new function to store the read counts
export const updateReadCountToStore = (state, payload) => {
  const { conversationId, totalMessageCount, user1ReadCount, user2ReadCount } =
    payload;

  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = { ...convo };
      newConvo.totalMessageCount = totalMessageCount;
      newConvo.user1ReadCount = user1ReadCount;
      newConvo.user2ReadCount = user2ReadCount;
      return newConvo;
    } else {
      return convo;
    }
  });
};
