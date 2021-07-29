import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./components/layout/Header";
import MovieListPage from "./components/movie/MovieListPage";
import MovieDetails from "./components/movie/MovieDetails";
import MovieAddEdit from "./components/movie/MovieAddEdit";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import AddNewMovie from "./components/movie/AddNewMovie";
import GenreAddEdit from "./components/genre/GenreAddEdit"


const client = new ApolloClient({
  uri: "https://ax-fe-test-tgoy.herokuapp.com/v1/graphql",
});

function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <Header />
          <CssBaseline />
          <Switch>
            <Route path="/" render={() => (<Redirect to="/MovieListPage" />)} exact component={MovieListPage} />
            <Route path="/MovieDetails" exact component={MovieDetails} />
            <Route path="/MovieDetails/:id" component={MovieDetails} />
            <Route path="/MovieListPage" exact component={MovieListPage} />
            <Route path="/MovieListPage/:id" exact component={MovieListPage} />
            <Route path="/MovieAddEdit/:id" exact component={MovieAddEdit} />
            <Route path="/AddNewMovie" exact component={AddNewMovie} />
            <Route path="/GenreAddEdit" exact component={GenreAddEdit}/>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
