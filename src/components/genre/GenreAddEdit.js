import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from "@material-ui/core/CardActions";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import "../../App.css";
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
}));

function GenreAddEdit({ match }) {
  const classes = useStyles();

  const [Gid, setId] = useState();
  const [Gtitle, setTitle] = useState();
  const [Gupdated_date, setUpdatedDate] = useState();
  var [addOrUpdateSwitch, setAddorUpdate] = useState(0);

  const setQid = addOrUpdateSwitch === 1 ? Gid : 0;
  const GetGenre = gql`
  {
        genres_by_pk(id: ${setQid}) {
            title
            updated_date
            id
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
  const UpdateGenre = gql`
    mutation UpdateGenre($Gid: Int!, $Gtitle: String!) {
      update_genres_by_pk(pk_columns: { id: $Gid }, _set: { title: $Gtitle }) {
        id
      }
    }
  `;
  const InsertGenre = gql`
    mutation InsertGenre($Gid: Int!, $Gtitle: String!) {
      insert_genres_one(
        object: { id: $Gid, title: $Gtitle }
        on_conflict: { constraint: genres_pkey, update_columns: id }
      ) {
        id
      }
    }
  `;

  const onCompete = () => {
    refetchGenre();
  };

  const addOrUpdate = addOrUpdateSwitch === 1 ? UpdateGenre : InsertGenre;
  //const match = this.match;
  const {
    loading: queryLoading,
    error: queryError,
    data: getEachData,
  } = useQuery(GetGenre);

  const {
    loading: GenreLoading,
    error: GenreError,
    data: genreData,
    refetch: refetchGenre,
  } = useQuery(GetAllGenre);
  const [
    updateGenre,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(addOrUpdate, {
    onCompleted: onCompete,
  });

  const toAddGenre = (e) => {
    setAddorUpdate(0);
    setId(0);
    setTitle("");
  };

  //Genre delete
  const DeleteGenre = gql`
mutation DeleteGenre($id: Int!) {
    delete_genres_by_pk(id: ${setQid}) {
    id
  }
}
`;

  const [deleteGenre, { loading: deleting, error: deleteerror }] = useMutation(
    DeleteGenre,
    {
      onCompleted: onCompete,
    }
  );

  const getdeleteGenre = () => {
    deleteGenre({
      variables: {
        id: setQid,
      },
    });
  };

  if (queryLoading || GenreLoading || deleting)
    return (
      <div>
        <Toolbar />
        <Toolbar />
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
        <CircularProgress />
      </div>
    );
  if (queryError || GenreError || deleteerror) return <p>Error :(</p>;

  return (
    <div>
      //let input;
      <div>
        <Toolbar />
        <Toolbar />

        <Container>
          <Paper className={classes.movieView}>
            {addOrUpdateSwitch === 1 ? <h1>Edit Genre</h1> : <h1>Add Genre</h1>}
            <Grid>
              {mutationLoading && (
                <div>
                  <CircularProgress />
                </div>
              )}
              {mutationError && <p>Error :( Please try again</p>}
            </Grid>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateGenre({
                  variables: {
                    Gid,
                    Gtitle: Gtitle,
                  },
                  onCompleted: () => console.log("done"),
                });
              }}
            >
              <Grid container spacing={3} justify="space-between">
                {addOrUpdateSwitch === 1 ? (
                  <Grid item xs={4}>
                    <label className="form-label">Genre Id</label>
                    <input
                      required
                      defaultValue={getEachData.genres_by_pk.id}
                      type="number"
                      readOnly
                      disabled
                    />
                    <label className="form-label m-top-20">Title</label>
                    <input
                      required
                      defaultValue={getEachData.genres_by_pk.title}
                      type="text"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    {Gid === null || Gid == "" ? (
                      ""
                    ) : (
                      <label className="form-label m-top-20">
                        Last Updated on{" "}
                      </label>
                    )}
                    <label>{getEachData.genres_by_pk.updated_date}</label>
                  </Grid>
                ) : (
                  <Grid item xs={4}>
                    <label className="form-label">Genre Id</label>
                    <input
                      required
                      defaultValue={null}
                      type="number"
                      onChange={(e) => {
                        setId(e.target.value);
                      }}
                    />
                    <label className="form-label m-top-20">Title</label>
                    <input
                      required
                      defaultValue={null}
                      type="text"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Grid item lg>
                    <label className="form-label">All Genres</label>
                    <div>
                      {genreData.genres.map((genre) => (
                        <Button
                          id={genre.id}
                          key={genre.id}
                          onClick={(e) => {
                            setId(genre.id);
                            setAddorUpdate(1);
                          }}
                        >
                          {genre.title}
                        </Button>
                      ))}
                      {addOrUpdateSwitch === 1 ? (
                        <Button
                          key={"addGrbtn"}
                          fontSize="small"
                          onClick={toAddGenre}
                        >
                          <AddIcon />
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item lg>
                    <CardActions disableSpacing>
                      <Link to={`/`}>
                        <IconButton aria-label="Back">
                          <BackIcon />
                        </IconButton>
                      </Link>

                      <IconButton type="submit" aria-label="Save">
                        <SaveIcon />
                      </IconButton>
                      {addOrUpdateSwitch === 1 ? (
                        <IconButton
                          type="submit"
                          aria-label="Save"
                          onClick={getdeleteGenre}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        ""
                      )}
                    </CardActions>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
export default GenreAddEdit;
