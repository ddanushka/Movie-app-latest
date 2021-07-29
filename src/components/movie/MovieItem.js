import React from "react";
import {Link} from "react-router-dom";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { makeStyles } from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  movieDes:{
    color: "rgb(187 187 187)",
  },
  movieSpan:{
    display: "block",
    whiteSpace: "pre-wrap",
  },
  movieSynap:{
    height: "82px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "block",
    whiteSpace: "pre-wrap",
  },
  movieTile:{
    height: "50%",
  },
  MovieTileWrap:{
    marginBottom: -5,
  }
}));

function MovieItem(props) {
  const classes = useStyles();

  return (
    <GridListTile  key={props.movie.id}>
      <Link to={`/MovieDetails/${props.movie.id}`}>
        <img src={props.movie.thumbnail} alt={props.movie.synopsis} />
        <GridListTileBar
          className={classes.movieTile}
          title={props.movie.title}
          subtitle={
          <div className={classes.movieDes}>
            <span className={classes.movieSpan}>({props.movie.released})</span>
            <span className={classes.movieSynap}>{props.movie.synopsis}</span>
            </div>
            }
          actionIcon={
            <IconButton
              aria-label={`info about ${props.movie.title}`}
              className={classes.icon}
            >
              <ChevronRight />
            </IconButton>
          }
        />
      </Link>
    </GridListTile>
  );
}

export default MovieItem;
