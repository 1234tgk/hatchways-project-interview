import React, { useEffect, useRef, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  CssBaseline,
  Button,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";
import { theme as defaultTheme } from "../themes/theme";

const styles = {
  root: {
    height: "95vh",
  },
};

const useDarkMode = () => {
  const [theme, setTheme] = useState(defaultTheme);

  const {
    palette: { type },
  } = theme;
  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: !type || type === "light" ? "dark" : "light",
      },
    };

    setTheme(updatedTheme);
  };

  return [theme, toggleDarkMode];
};

const Home = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [theme, toggleDarkMode] = useDarkMode();

  const themeConfig = createTheme(theme);

  const { fetchConversations } = props;

  const prevPropsRef = useRef({ user: { id: 0 } });

  useEffect(() => {
    if (props.user.id !== prevPropsRef.current.user.id) {
      setIsLoggedIn(true);
    }
    prevPropsRef.current = props;
  }, [props]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleLogout = async () => {
    await props.logout(props.user.id);
  };

  const { classes } = props;
  if (!props.user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }
  return (
    <ThemeProvider theme={themeConfig}>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Button className={classes.setDark} onClick={toggleDarkMode}>
        Set Light/Dark Mode
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
