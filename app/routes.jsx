import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchCourseRequest } from './api';
import App from './pages/App';
import LayoutMainWeb from './components/layouts/LayoutMainWeb/LayoutMainWeb';
import LayoutMainApp from './components/layouts/LayoutMainApp/LayoutMainApp';
import LayoutSettings from './components/layouts/LayoutSettings/LayoutSettings';
import Home from './pages/Home';
import About from './pages/About';
import SettingsProfile from './pages/SettingsProfile';
import SettingsAvatar from './pages/SettingsAvatar';
import SettingsMail from './pages/SettingsMail';
import SettingsPassword from './pages/SettingsPassword';
import Login from './pages/Login';
import Users from './pages/Users';
import User from './pages/User';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import CourseAddOrEdit from './pages/CourseAddOrEdit';


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
			<Route component={LayoutMainWeb}>
				<IndexRoute component={Home} />
				<Route path="/users" component={Users} onEnter={requireAuth} />
				<Route path="/user/:id" component={User} onEnter={requireAuth} />
				<Route path="/about" component={About} />

				<Route path="/settings" component={LayoutSettings} onEnter={requireAuth} >
					<IndexRoute component={SettingsProfile} onEnter={requireAuth} />
					<Route path="profile" component={SettingsProfile} onEnter={requireAuth} />
					<Route path="avatar" component={SettingsAvatar} onEnter={requireAuth} />
					<Route path="mail" component={SettingsMail} onEnter={requireAuth} />
					<Route path="password" component={SettingsPassword} onEnter={requireAuth} />
				</Route>

				<Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
				<Route path="/course/:id" component={Course} fetchData={fetchCourseRequest} />

				<Route path="/login" component={Login} />
				<Route path="/signup" component={Login} />
			</Route>

			<Route component={LayoutMainApp}>
				<Route path="/course/:action/:id" component={CourseAddOrEdit} fetchData={fetchCourseRequest} onEnter={requireAuth} />
			</Route>
		</Route>
  );
};
