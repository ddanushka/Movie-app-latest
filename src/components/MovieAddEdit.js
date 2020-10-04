import React from "react";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from "@material-ui/core/CardActions";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { Beforeunload } from 'react-beforeunload';

const useStyles = makeStyles((theme) => ({
  movieView: {
    padding: 40,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

function MovieAddEdit({ match }) {
  const classes = useStyles();

  const GetMovie = gql`
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
  `;
  const GetAllGenre = gql`
    {
      genres {
        id
        title
      }
    }
  `;
  const UpdateMovie = gql`
    mutation UpdateMovie($id: Int!, $title: String! $synopsis: String, $description: String, $thumbnail: String, $released: date!) {
        update_movies_by_pk(pk_columns: {id: ${match.params.id}}, _set: {title: $title, synopsis:$synopsis ,description: $description,thumbnail: $thumbnail, released: $released  }) {
          id
          updated_date
        }
      }
    
  `;
  //const match = this.match;
  const {
    loading: queryLoading,
    error: queryError,
    data: movieData,
  } = useQuery(GetMovie);
  const {
    loading: GenreLoading,
    error: GenreError,
    data: genreData,
  } = useQuery(GetAllGenre);
  const [
    updateMovie,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UpdateMovie);

  const genArry = [];
  if (queryLoading || GenreLoading)
    return (
      <div>
        <Toolbar />
        <Toolbar />
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />

        <CircularProgress />
      </div>
    );
  if (queryError || GenreError) return <p>Error :(</p>;

  return (
    <div>
      {movieData.movies.map(
        ({
          id,
          title,
          synopsis,
          description,
          thumbnail,
          released,
          movie_genres,
        }) => (
          //let input;

          <div key={id}>
            <Toolbar />
            <Toolbar />

            <Container key={id}>
              <Paper className={classes.movieView}>
                <h1>Update Details</h1>
                <Grid>
                  {mutationLoading && (
                    <div>
                      <Toolbar />
                      <Toolbar />
                      <CircularProgress />
                    </div>
                  )}
                  {mutationError && <p>Error :( Please try again</p>}
                </Grid>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMovie({
                      variables: {
                        id,
                        title: title,
                        synopsis: synopsis,
                        description: description,
                        thumbnail: thumbnail,
                        released: released,
                      },
                    });
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <label className="form-label">Title </label>
                      <input
                        required
                        defaultValue={title}
                        type="text"
                        onChange={(e) => {
                          title = e.target.value;
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <label className="form-label">Synopsis </label>
                      <TextareaAutosize
                        rowsMin={4}
                        defaultValue={synopsis}
                        onChange={(e) => {
                          synopsis = e.target.value;
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <label className="form-label">Description </label>
                      <TextareaAutosize
                        rowsMin={6}
                        defaultValue={description}
                        onChange={(e) => {
                          description = e.target.value;
                        }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <label className="form-label">Thumbnail(URL)</label>
                      <input
                        type="text"
                        defaultValue={thumbnail}
                        onChange={(e) => {
                          thumbnail = e.target.value;
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <label className="form-label">Released date </label>
                      <input
                        required
                        defaultValue={released}
                        type="date"
                        onChange={(e) => {
                          released = e.target.value;
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Grid item lg>
                        <label className="form-label">Genre : </label>
                        {movie_genres.map((genre) =>
                          genArry.push(genre.genre.id)
                        )}
                        <select multiple={true} defaultValue={genArry}>
                          {genreData.genres.map((genre) => (
                            <option value={genre.id} key={genre.id}>
                              {genre.title}
                            </option>
                          ))}
                        </select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item lg>
                        <CardActions disableSpacing>
                          <Link to={`/MovieDetails/${match.params.id}`}>
                            <IconButton aria-label="Back">
                              <BackIcon />
                            </IconButton>
                          </Link>

                          <IconButton type="submit" aria-label="Save">
                            <SaveIcon />
                          </IconButton>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          </div>
        )
      )}
    </div>
  );
}
export default MovieAddEdit;
