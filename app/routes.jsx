import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchCoursesRequest, fetchUsersRequest } from './api';
import App from './pages/App';
import Home from './pages/Home';
import About from './pages/About';
import LayoutFilms from './components/layouts/LayoutFilms/LayoutFilms';
import Thrillers from './pages/Thrillers';
import SeriesUs from './pages/SeriesUs';
import Mangas from './pages/Mangas';
import Login from './pages/Login';
import Users from './pages/Users';


export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { authentification: { authenticated }} = store.getState();
    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  };
  /*
  const redirectAuth = (nextState, replace, callback) => {
    const { authentification: { authenticated }} = store.getState();
    if (authenticated) {
      replace({
        pathname: '/'
      });
    }
    callback();
  };
  */

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} fetchData={fetchCoursesRequest} />
      <Route path="users" component={Users} fetchData={fetchUsersRequest} onEnter={requireAuth} />
      {/*<Route path="users/:id" component={User} fetchData={fetchUserRequest} onEnter={requireAuth} />*/}
      <Route path="about" component={About} />

      <Route path="films" component={LayoutFilms} >
        {/* <IndexRoute component={Thrillers} /> */}
        <IndexRoute />
        <Route path="thrillers" component={Thrillers} />
        <Route path="seriesus" component={SeriesUs} />
        <Route path="mangas" component={Mangas} onEnter={requireAuth} />
      </Route>

      <Route path="login" component={Login} />
      <Route path="signup" component={Login} />
    </Route>
  );
};
