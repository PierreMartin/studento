import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { checkIfUserOwnerCourseRequest } from './api';
import App from './pages/App';
import LayoutMainWeb from './components/layouts/LayoutMainWeb/LayoutMainWeb';
import LayoutMainApp from './components/layouts/LayoutMainApp/LayoutMainApp';
import LayoutSettings from './components/layouts/LayoutSettings/LayoutSettings';
import Home from './pages/Home';
import About from './pages/About';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SettingsProfile from './pages/SettingsProfile';
import SettingsAvatar from './pages/SettingsAvatar';
import SettingsAccount from './pages/SettingsAccount';
import Login from './pages/Login';
import Users from './pages/Users';
import User from './pages/User';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Course from './pages/Course';
import NotePage from './pages/NotePage';
import Test from './pages/Test';


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
				<Route path="/user/:id" component={User} />
				<Route path="/about" component={About} />
				<Route path="/terms" component={TermsOfService} />
				<Route path="/privacy-policy" component={PrivacyPolicy} />
				<Route path="/courses/:category/:subcategory" component={Courses} />

				<Route path="/settings" component={LayoutSettings} onEnter={requireAuth} >
					<IndexRoute component={SettingsProfile} onEnter={requireAuth} />
					<Route path="profile" component={SettingsProfile} onEnter={requireAuth} />
					<Route path="avatar" component={SettingsAvatar} onEnter={requireAuth} />
					<Route path="account" component={SettingsAccount} onEnter={requireAuth} />
				</Route>

				<Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
				<Route path="/course/:id" component={Course} />

				<Route path="/login" component={Login} />
				<Route path="/signup" component={Login} />
			</Route>

			<Route component={LayoutMainApp}>
				<Route path="/testDev" component={Test} onEnter={requireAuth} />
				<Route path="/course/:action/:id" component={NotePage} onEnter={requireAuthEditor} />
				<Route path="/courseMd/:action/:id" component={NotePage} onEnter={requireAuthEditor} />
			</Route>
		</Route>
  );
};
