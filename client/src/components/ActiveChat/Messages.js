import React, { useEffect, useRef } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    height: "70vh",
    overflow: "auto",
    paddingRight: 20,
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages[messages.length - 1].senderId === userId) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props, messages, userId]);

  // find the index where read marker should be at
  const len = messages.length;
  let markerIndex = 0;
  for (let i = 0; i < len; i++) {
    if (messages[i].senderId === userId) {
      if (messages[i].readStatus) {
        markerIndex = i;
      } else {
        break;
      }
    }
  }

  return (
    <Box className={classes.root}>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            markerOn={index === markerIndex}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
      <div ref={endOfMessagesRef} />
    </Box>
  );
};

export default Messages;
