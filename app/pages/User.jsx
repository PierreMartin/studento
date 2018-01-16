import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isBoxOpenAction, addNewChannelAction } from '../actions/tchat';
import { Header, Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UserSingle from '../components/UserSingle/UserSingle';


class User extends Component {
	constructor(props) {
		super(props);
		this.handleOpenChatBox = this.handleOpenChatBox.bind(this);
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
		const { channelsList, userFront, userMeId } = this.props;

		// Get channel / create new channel :
		let channel = null;
		if (channelsList && channelsList.length > 0) {
			for (let i = 0; i < channelsList.length; i++) {
				const chan = channelsList[i];
				if (chan.userFrontId === userFront._id) {
					channel = chan;
					break;
				}
			}
		}

		// if channel already exist :
		if (channel) {
			console.log('Channel already exist!');
			// this.props.fetchMessagesByChannelIdAction(channel.channelId);
		} else {
			console.log('Channel must to be create!');
			this.props.addNewChannelAction(userFront._id, userMeId);
		}

		this.props.isBoxOpenAction(true);
	}

	render() {
		const { userFront, userMeId } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						<Header as="h2" icon="user circle" content="User profile" />
						<UserSingle userFront={userFront} userMeId={userMeId} handleOpenChatBox={this.handleOpenChatBox} />
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
	userFront: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}).isRequired,

	channelsList: PropTypes.arrayOf(PropTypes.shape({
		channelId: PropTypes.string,
		userFrontId: PropTypes.string
	})),

	isBoxOpenAction: PropTypes.func,
	addNewChannelAction: PropTypes.func,
	userMeId: PropTypes.string
};

const mapStateToProps = (state) => {
	return {
		userFront: state.users.one,
		userMeId: state.userMe.data._id,
		channelsList: state.userMe.data.channelsList // TODO changer en 'userMe' (userMe.channelsList)
	};
};

export default connect(mapStateToProps, { isBoxOpenAction, addNewChannelAction })(User);
