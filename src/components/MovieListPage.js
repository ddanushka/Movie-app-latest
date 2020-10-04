import React, { Suspense } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import Toolbar from "@material-ui/core/Toolbar";
//import MovieItem from './MovieItem';
import SidePanel from "./SidePanel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";

const MovieItem = React.lazy(() => import("./MovieItem"));

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    display: "flex",
  },
  GridListWrap: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    minWidth: "calc(100vw - 290px)",
    minheight: "calc(100vh - 120px)",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  spinner: {
    margin: "10px auto",
    textAlign: "center",
  },
  floatingBtnWrap: {
    '& > *': {
      margin: 5,
    },
    position: "fixed",
    right: 15,
    zIndex: 999,
  },
}));

function MovieListPage({ match }) {
  const classes = useStyles();
  const getGenre =
    match.params.id === "all" || match.params.id == null
      ? "null"
      : match.params.id;
  return (
    <div className={classes.pageWrapper}>
      <SidePanel />
      
      <main className={classes.content}>
        <Toolbar />
        <div className={classes.floatingBtnWrap}>
        <Link to={`/AddNewMovie`}>

      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      </Link>
    </div>
        <div className={classes.GridListWrap}>
          <GridList cellHeight={180} className={classes.gridList}>
            <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
              <ListSubheader component="div">List View </ListSubheader>
            </GridListTile>
            <Suspense
              fallback={
                <div className={classes.spinner}>
                  <div className={classes.spinner}>
                    <CircularProgress />
                  </div>
                </div>
              }
            >
              <Query
                query={gql`
                  {
                    movies(where: {movie_genres: {genre_id: {_eq: ${getGenre}}}}) {
                      id
                      title
                      thumbnail
                      synopsis
                      released
                      
                    }
                  }
                `}
              >
                {({ loading, error, data }) => {
                  if (loading)
                    return (
                      <div className={classes.spinner}>
                        <div className={classes.spinner}>
                          <CircularProgress />
                        </div>
                      </div>
                    );
                  if (error) return <p>An Error Occured!</p>;

                  return data.movies.map((movieList) => (
                    <MovieItem key={movieList.id} movie={movieList} />
                  ));
                }}
              </Query>
            </Suspense>
          </GridList>
        </div>
      </main>
    </div>
  );
}

export default MovieListPage;
