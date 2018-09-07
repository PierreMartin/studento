import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openTchatboxAction } from '../actions/tchat';
import { fetchCoursesByFieldAction } from '../actions/courses';
import { Header, Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UserSingle from '../components/UserSingle/UserSingle';
import CoursesList from '../components/CoursesList/CoursesList';
import io from 'socket.io-client';

class User extends Component {
	constructor(props) {
		super(props);
		this.handleOpenChatBox = this.handleOpenChatBox.bind(this);
		this.socket = io('', { path: '/api/tchat' });
	}

	componentDidMount() {
		// TODO REFACTO CA :
		// fetchUserAction(userFront._id).then(() {  fetchCoursesByFieldAction('uId', userFront._id)  })
		// et supprimer componentDidUpdate() + supprimer call requete dans la route
		const { fetchCoursesByFieldAction, userFront } = this.props;
		if (userFront._id) {
			fetchCoursesByFieldAction('uId', userFront._id); // 'uId' => name of field in Model to find
		}
	}

	componentDidUpdate(prevProps) {
		const { fetchCoursesByFieldAction, userFront } = this.props;

		// Because sometime the component is mounted before to get the data... :( :
		if (prevProps.userFront._id !== userFront._id) {
			if (userFront._id) fetchCoursesByFieldAction('uId', userFront._id);
		}
	}

	getMetaData() {
		return {
			title: 'User profile',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	handleOpenChatBox() {
		const { openTchatboxAction, userMe, userFront, channelsListOpen } = this.props;
		openTchatboxAction(userMe, userFront, channelsListOpen, this.socket);
	}

	render() {
		const { userFront, userMe, courses } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="user circle" content="profile" />
						<UserSingle userFront={userFront} userMe={userMe} handleOpenChatBox={this.handleOpenChatBox} />
					</Container>
				</Segment>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="student" content="courses" />
						<CoursesList courses={courses} />
					</Container>
				</Segment>

			</LayoutPage>
		);
	}
}

User.propTypes = {
	openTchatboxAction: PropTypes.func,
	fetchCoursesByFieldAction: PropTypes.func,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	userFront: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	channelsListOpen: PropTypes.shape({
		id: PropTypes.string,
		users: PropTypes.object // populate
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		category_info: (PropTypes.shape({
			description: PropTypes.string,
			key: PropTypes.string,
			name: PropTypes.string,
			picto: PropTypes.string
		})),
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	}))
};

const mapStateToProps = (state) => {
	return {
		userFront: state.users.one,
		userMe: state.userMe.data,
		channelsListOpen: state.tchat.channelsListOpen,
		courses: state.courses.all
	};
};

export default connect(mapStateToProps, { openTchatboxAction, fetchCoursesByFieldAction })(User);
