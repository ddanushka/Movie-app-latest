import React from "react";
import { Query, useMutation } from "react-apollo";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import MovieView from "./MovieView";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import "../../App.css";

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    display: "flex",
  },
  GridListWrap: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    width: "100%",
    margin: 20,
  },
  gridList: {
    minWidth: "calc(100vw - 290px)",
    minHeight: "calc(100vh - 120px)",
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
    "& > *": {
      margin: 5,
    },
    position: "fixed",
    right: 15,
    zIndex: 999,
    top: 80,
  },
}));

function MovieDetails({ match }) {
  const classes = useStyles();

  const DeleteMovie = gql`
    mutation UpdateTodo($id: Int!) {
      delete_movies_by_pk(id: $id) {
        id
      }
    }
  `;
  const goToHome = () =>window.location = '/MovieListPage/all';
  const [
    updateTodo,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DeleteMovie,{
    onCompleted : goToHome
  });

  const getClick = () => {
    updateTodo({
      variables: {
        id: match.params.id,
      },
    });
  };
  return (
    <div className={classes.GridListWrap}>
      {mutationLoading && (
        <Grid>
          <Toolbar />
          <p>Deleting...</p>
        </Grid>
      )}
      {mutationError && <p>Error :( Please try again</p>}
      <div className={classes.floatingBtnWrap}>
        <Link to={`/AddNewMovie`}>
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>
      <Query
        query={gql`
              {
                  movies(where: {id: {_eq: ${match.params.id}}}) {
                    description
                    id
                    released
                    synopsis
                    thumbnail
                    title
                    movie_genres {
                      genre {
                        title
                        id
                      }
                    }
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

          return data.movies.map((movieView) => (
            movieView === null?
            console.log("erro"):
            <MovieView
              key={movieView.id}
              getClick={getClick}
              movie={movieView}
            />
          ));
        }}
      </Query>
    </div>
  );
}

export default MovieDetails;
