import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import store from "../../store";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
  chats: {
    height: "70vh",
    overflow: "auto",
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      <Box className={classes.chats}>
        {conversations
          .filter((conversation) =>
            conversation.otherUser.username.includes(searchTerm)
          )
          .map((conversation) => {
            return (
              <Chat
                conversation={conversation}
                key={conversation.otherUser.username}
                isActive={
                  store.getState().activeConversation === conversation.id
                }
              />
            );
          })}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps)(Sidebar);
