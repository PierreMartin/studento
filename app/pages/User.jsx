import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openTchatboxAction } from '../actions/tchat';
import { Header, Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UserSingle from '../components/UserSingle/UserSingle';
import io from 'socket.io-client';

class User extends Component {
	constructor(props) {
		super(props);
		this.handleOpenChatBox = this.handleOpenChatBox.bind(this);
		this.socket = io('', { path: '/api/tchat' });
	}

	componentDidMount() {
		// this.props.fetchCoursesByUserIdAction(this.props.userFront._id);
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
		const { userFront, userMe } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="user circle" content="User profile" />
						<UserSingle userFront={userFront} userMe={userMe} handleOpenChatBox={this.handleOpenChatBox} />
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

	openTchatboxAction: PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		userFront: state.users.one,
		userMe: state.userMe.data,
		channelsListOpen: state.tchat.channelsListOpen
	};
};

export default connect(mapStateToProps, { openTchatboxAction })(User);
