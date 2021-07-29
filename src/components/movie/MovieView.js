import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import DeleteSharp from "@material-ui/icons/DeleteTwoTone";
import ShareIcon from "@material-ui/icons/EditTwoTone";
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles((theme) => ({
    movieView: {
        maxWidth: 600,
  },
  media: {
    height: 0,
    paddingTop: "68%",
    backgroundSize: "contain"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  flexRight:{
    justifyContent: "flex-end"
  }
}));

function MovieView(props) {
  const classes = useStyles();

  return (
      <div>
          <Toolbar/>
          <Toolbar/>
            <Paper className={classes.movieView}>
            <CardHeader
                title={props.movie.title}
                subheader={props.movie.released}
            />
            <CardMedia
                className={classes.media}
                image={props.movie.thumbnail}
                title={props.movie.title}
            />
            <CardContent>
                <h3 variant="body1" color="textSecondary" component="p">
                    {props.movie.synopsis}
                </h3>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.movie.description}
                </Typography>
                <div variant="body1" color="textSecondary" component="p">
                    <span>Genre : </span>
                {props.movie.movie_genres.map(genre =>(
                    <span key={genre.genre.id}>{genre.genre.title}, </span>
                ))}
                
                </div>
            </CardContent>
            <CardActions className={classes.flexRight}  disableSpacing>
                    <IconButton onClick={props.getClick} aria-label="Delete">
                    <DeleteSharp />
                    </IconButton>
                <Link to={`/MovieAddEdit/${props.movie.id}`}>
                    <IconButton aria-label="Edit">
                    <ShareIcon />
                    </IconButton>
                </Link>
            </CardActions>
            </Paper>
    </div>
  );
}

export default MovieView;