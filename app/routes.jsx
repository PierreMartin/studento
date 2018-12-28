import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchCourseRequest, checkIfUserOwnerCourseRequest } from './api';
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
import Courses from './pages/Courses';
import Course from './pages/Course';
import CourseAddOrEdit from './pages/CourseAddOrEdit';
import CourseAddOrEditMd from './pages/CourseAddOrEditMd';


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

  const requireAuthEditor = (nextState, replace, callback) => {
    const { userMe, authentification: { authenticated }} = store.getState();

    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
			callback();
			return;
    }

		// No redirection for the news courses:
		if (nextState.params && nextState.params.action === 'create') {
			callback();
			return;
		}

    const userMeId = userMe.data && userMe.data._id;
    const courseIdToFind = nextState.params && nextState.params.id;

		checkIfUserOwnerCourseRequest(userMeId, courseIdToFind)
			.then((res) => {
				if (!res.data.isUserOwnerCourse) replace({ pathname: '/dashboard' });
				callback();
			}).catch(() => {
				replace({ pathname: '/dashboard' });
				callback();
			});
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
				<Route path="/courses/:category/:subcategory" component={Courses} />

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
				<Route path="/course/:action/:id" component={CourseAddOrEdit} fetchData={fetchCourseRequest} onEnter={requireAuthEditor} />
				<Route path="/courseMd/:action/:id" component={CourseAddOrEditMd} fetchData={fetchCourseRequest} onEnter={requireAuthEditor} />
			</Route>
		</Route>
  );
};
