import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UserSingle from '../components/UserSingle/UserSingle';


class User extends Component {
	getMetaData() {
		return {
			title: 'User profile',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	componentDidMount() {
		// this.props.fetchCoursesByUserIdAction(this.props.user._id);
	}

	render() {
		const { user, userMeId } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="user circle" content="User profile" />
						<UserSingle user={user} userMeId={userMeId} />
					</Container>
				</Segment>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="student" content="User courses" />
						Coming soon
						{/*<CoursesList courses={courses} />*/}
					</Container>
				</Segment>

			</LayoutPage>
		);
	}
}

User.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	userMeId: PropTypes.string
};

const mapStateToProps = (state) => {
	return {
		user: state.users.one,
		userMeId: state.userMe.data._id
	};
};

export default connect(mapStateToProps, null)(User);
