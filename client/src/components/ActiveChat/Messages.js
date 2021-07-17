import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import ReadMarker from "./ReadMarker";

const Messages = (props) => {
  const { conversation, userId } = props;
  const { messages, otherUser, user1, user1ReadCount, user2ReadCount } =
    conversation;

  let otherReadCount;
  if (user1 === null) {
    otherReadCount = user2ReadCount;
  } else {
    otherReadCount = user1ReadCount;
  }

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        return (
          <>
            {message.senderId === userId ? (
              <SenderBubble key={message.id} text={message.text} time={time} />
            ) : (
              <OtherUserBubble
                key={message.id}
                text={message.text}
                time={time}
                otherUser={otherUser}
              />
            )}
            {otherReadCount === index + 1 && (
              <ReadMarker key={index} otherUser={otherUser} />
            )}
          </>
        );
      })}
    </Box>
  );
};

export default Messages;
