import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Settings';
import {Link} from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  spinner:{
    margin: '10px auto',
    textAlign: 'center',
  }
  
}));

function SidePanel(props) {
  


  const classes = useStyles();

  return (
  
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
              <ListItem>
                <ListItemText primary="Genre" />
              <Link to={"/GenreAddEdit"}>
              <Button><EditIcon/></Button>
              </Link>
              </ListItem>
          </List>
          <Divider />
          <List>
              <Link to={"/MovieListPage/all"}>
              <ListItem button>
                <ListItemText primary="All movies" />
              </ListItem>
              </Link>
              <Query query={gql`
                  {
                    genres {
                      id
                      title
                    }
                  }
                `}>

                  {({loading, error, data}) =>{
                    if (loading) return <div className={classes.spinner}><CircularProgress /></div>;
                    if (error) return <ListItem><ListItemText primary={"An Error Occured!"} /></ListItem>;

                    return data.genres.map(({id, title})=> (
                      <Link key={id} to={`/MovieListPage/${id}`}><ListItem button key={id}>
                        <ListItemText primary={title} />
                        </ListItem>
                      </Link>
                      
                    ))
                  }}
              </Query>
          </List>
        </div>
      </Drawer>
  )
};

export default SidePanel;
