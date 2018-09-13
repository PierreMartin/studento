import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserAction } from '../actions/user';
import { fetchCoursesByFieldAction } from '../actions/courses';
import { openTchatboxAction } from '../actions/tchat';
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

		this.state = {
			paginationIndexPage: 1
		};
	}

	componentDidMount() {
		this.props.fetchUserAction(this.props.params.id); // call fetchCoursesByFieldRequest()
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

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, courses, userMe } = this.props;
		const { paginationIndexPage } = this.state;
		const directionIndex = activePage - paginationIndexPage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		this.setState({ paginationIndexPage: activePage });

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, currentCourseId, directionIndex });
	}


	render() {
		const { userFront, userMe, courses, coursesPagesCount } = this.props;
		const { paginationIndexPage } = this.state;

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
						<CoursesList
							courses={courses}
							coursesPagesCount={coursesPagesCount}
							handlePaginationChange={this.handlePaginationChange}
							paginationIndexPage={paginationIndexPage}
						/>
					</Container>
				</Segment>

			</LayoutPage>
		);
	}
}

User.propTypes = {
	fetchUserAction: PropTypes.func,
	fetchCoursesByFieldAction: PropTypes.func,
	openTchatboxAction: PropTypes.func,
	coursesPagesCount: PropTypes.number,

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
		courses: state.courses.all,
		coursesPagesCount: state.courses.pagesCount
	};
};

export default connect(mapStateToProps, { fetchUserAction, fetchCoursesByFieldAction, openTchatboxAction })(User);
