import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchCoursesRequest, fetchUsersRequest, fetchUserRequest } from './api';
import App from './pages/App';
import Home from './pages/Home';
import About from './pages/About';
import LayoutSettings from './components/layouts/LayoutSettings/LayoutSettings';
import SettingsProfile from './pages/SettingsProfile';
import SettingsAvatar from './pages/SettingsAvatar';
import SettingsAccount from './pages/SettingsAccount';
import Login from './pages/Login';
import Users from './pages/Users';
import User from './pages/User';


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
      <Route path="/users" component={Users} fetchData={fetchUsersRequest} onEnter={requireAuth} />
      <Route path="/user/:id" component={User} fetchData={fetchUserRequest} onEnter={requireAuth} />
      <Route path="/about" component={About} />

      <Route path="/settings" component={LayoutSettings} >
        {/* <IndexRoute component={Thrillers} /> */}
        <IndexRoute />
        <Route path="profile" component={SettingsProfile} />
        <Route path="avatar" component={SettingsAvatar} />
        <Route path="account" component={SettingsAccount} onEnter={requireAuth} />
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Login} />
    </Route>
  );
};
