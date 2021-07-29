import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import { Link } from "react-router-dom";
import "../../App.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

function HomeButton() {
  return (
    <Link to={"/MovieListPage/all"}>
      <Typography variant="h6" noWrap>
        Movie Gallery
      </Typography>
    </Link>
  );
}
function backHomeButton() {
  //const classesBtn = useStyles();

  return (
    <Link to={"/MovieListPage/all"}>
      <Typography variant="h6" noWrap>
        <IconButton className={"icon-white"}>
          <ChevronLeft />
        </IconButton>
      </Typography>
    </Link>
  );
}
function Header() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Switch>
          <Route path="/MovieListPage" exact component={HomeButton} />
          <Route path="/MovieListPage/:id" exact component={HomeButton} />
          <Route path="/" component={backHomeButton} />
        </Switch>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
