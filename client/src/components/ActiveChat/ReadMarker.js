import React from "react";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import { Box, Avatar } from "@material-ui/core";

const theme = createTheme();

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    padding: theme.spacing(),
  },
  avatar: {
    height: 25,
    width: 25,
    marginTop: 6,
  },
}));

const ReadMarker = (props) => {
  const classes = useStyles();
  const { otherUser } = props;
  return (
    <Box className={classes.root}>
      <Avatar
        alt={otherUser.username}
        src={otherUser.photoUrl}
        className={classes.avatar}
      />
    </Box>
  );
};

export default ReadMarker;
