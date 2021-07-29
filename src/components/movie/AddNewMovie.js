import React, { useState } from "react";
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
import "../../App.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { Beforeunload } from "react-beforeunload";

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
  inputerror: {
    color: "white",
    marginTop: "5px",
    background: "#ff6767",
    display: "block",
    padding: "2px 5px",
    fontSize: "12px"
  }
}));

function AddNewMovie() {
  const classes = useStyles();
  const [id, setId] = useState(100000);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState();
  const [description, setDescription] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [released, setReleased] = useState();
  const [multiGenre, setMultiGenre] = useState();
  const [idAvailable, setidAvailable] = useState(false);

  const GetAllGenre = gql`
    {
      genres {
        id
        title
      }
    }
  `;

  const AddMovie = gql`
    mutation AddMovie(
      $id: Int!
      $released: date
      $synopsis: String
      $thumbnail: String
      $title: String!
      $description: String
    ) {
      insert_movies_one(
        object: {
          description: $description
          id: $id
          released: $released
          synopsis: $synopsis
          thumbnail: $thumbnail
          title: $title
        }
      ) {
        id
        updated_date
      }
    }
  `;

  const AddGenre = gql`
    mutation AddGenre($genre_id: Int!, $movie_id: Int) {
      insert_movie_genre(
        objects: { genre_id: $genre_id, movie_id: $movie_id }
      ) {
        affected_rows
      }
    }
  `;
  const RemoveGenre = gql`
    mutation RemoveGenre($_eq: Int = 6) {
      delete_movie_genre(where: { movie_id: { _eq: $_eq } }) {
        affected_rows
      }
    }
  `;

  const onCompete = () => {
    if (!(typeof multiGenre === "undefined")) {
      multiGenre.genre.map(
        (genre) => (
          console.log(genre),
          addGenre({
            variables: {
              movie_id: id,
              genre_id: genre,
            },
          })
        )
      );
    }
  };
  const {
    loading: GenreLoading,
    error: GenreError,
    data: genreData,
  } = useQuery(GetAllGenre);

  const [
    addMovie,
    { loading: mutationLoading, error: mutationError, data: feeback },
  ] = useMutation(AddMovie, {
    onCompleted: onCompete,
  });

  const [
    addGenre,
    { loading: mutategenreLoading, error: mutategenreError },
  ] = useMutation(AddGenre);
  const [removeGenre] = useMutation(RemoveGenre);

  const GetAllId = gql`
    {movies_by_pk(id: ${id > 0 ? id : 0}) {
      id
    }}
    `;
  const { data: idData } = useQuery(GetAllId);
  
  const handleChangeMultiselect = (e) => {
    let target = e.target;
    let name = target.name;
    //here
    let value = Array.from(target.selectedOptions, (option) => option.value);
    setMultiGenre({
      genre: value,
    });
  };
  if (GenreLoading || mutategenreLoading)
    return (
      <div>
        <Toolbar />
        <Toolbar />
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
        <CircularProgress />
      </div>
    );
  if (GenreError || mutategenreError) return <p>Error :(</p>;

  return (
    <div>
      <Toolbar />
      <Toolbar />
      <Container>
        <Paper className={classes.movieView}>
          <h1>Add Movie</h1>
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
              if(!(typeof idData === "undefined")){

                if((idData.movies_by_pk === null)){
                  
                 addMovie({
                   variables: {
                     id: id,
                     title: title,
                     synopsis: synopsis,
                     description: description,
                     thumbnail: thumbnail,
                     released: released,
                   },
                 })
                 
              }}
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <label className="form-label">ID </label>
                <input
                  required
                  type="number"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setId(e.target.value);
                    //idData.movies_by_pk.map((id) => console.log(id ) );
                  }}
                />
                {
                  
                  !(typeof idData === "undefined") ? (
                    idData.movies_by_pk === null ? (
                      ""
                    ) : (
                      <span className={classes.inputerror}>{id} ID Already exist</span>
                    )
                  ) : (
                    ""
                  )
                }
              </Grid>
              <Grid item xs={8}>
                <label className="form-label">Title </label>
                <input
                  required
                  type="text"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <label className="form-label">Synopsis </label>
                <TextareaAutosize
                  rowsMin={4}
                  onChange={(e) => {
                    setSynopsis(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <label className="form-label">Description </label>
                <TextareaAutosize
                  rowsMin={6}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={8}>
                <label className="form-label">Thumbnail(URL)</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <label className="form-label">Released date </label>
                <input
                  required
                  type="date"
                  onChange={(e) => {
                    setReleased(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <Grid item lg>
                  <label className="form-label">Genre : </label>
                  <select
                    required
                    multiple={true}
                    onChange={handleChangeMultiselect}
                  >
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
                    <Link to={`/MovieDetails/${id}`}>
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
  );
}
export default AddNewMovie;
