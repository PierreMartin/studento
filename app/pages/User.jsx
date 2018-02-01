import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getChannelsByUserIdAction, openTchatboxAction, createNewChannelAction } from '../actions/tchat';
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

	/**
	 * Get the channel if already created
	 * @return {null | object} null if no matching - the object of the channel if matching
	 **/
	getChannelByUserFrontId() {
		const { channelsList, userFront } = this.props;
		let channel = null;

		if (channelsList && channelsList.length > 0) {
			for (let i = 0; i < channelsList.length; i++) {
				for (let j = 0; j < channelsList[i].users.length; j++) {
					if (channelsList[i].users[j]._id === userFront._id) {
						channel = channelsList[i];
						break;
					}
				}
				if (channel) break;
			}
		}

		return channel;
	}

	/**
	 * Check if the current tchatbox is already opened :
	 * @return {boolean} true if already opened
	 **/
	isTchatboxAlreadyOpened(channel) {
		if (!channel) return true;

		const { boxsOpen } = this.props;
		let isAlreadyOpened = false;

		for (let i = 0; boxsOpen.length > 0 && i < boxsOpen.length; i++) {
			const channelIdFromBoxsOpen = boxsOpen[i];
			if (channel.id === channelIdFromBoxsOpen) {
				isAlreadyOpened = true;
				break;
			}
		}

		return isAlreadyOpened;
	}

	handleOpenChatBox() {
		const { getChannelsByUserIdAction, createNewChannelAction, openTchatboxAction, userMe, userFront } = this.props;

		// 1) REQ - get all channels by userMe
		// 2) matching for get the channel nedeed for open the box
		// 		a) COND REQ - create new channel if doesn't exist
		// 		b) COND REQ - get all channels by (with new channel)
		// 3) open box with the channel

		// TODO tout faire dans une fonction dans action   openTchatboxAction();   et juste dispatcher 'getChannelsByUserIdAction' et 'openTchatboxAction'

		getChannelsByUserIdAction(userMe._id);

		// Get the channel nedeed for open the box :
		let channel = this.getChannelByUserFrontId();

		// if channel doens't exist :
		if (!channel) {
			console.log('Channel must to be create!');
			createNewChannelAction(userFront._id, userMe._id);
			getChannelsByUserIdAction(userMe._id);
			channel = this.getChannelByUserFrontId();
		}

		// open a new instance of tchatbox :
		if (!this.isTchatboxAlreadyOpened(channel)) {
			openTchatboxAction(channel.id);
		}
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

	boxsOpen: PropTypes.array,

	getChannelsByUserIdAction: PropTypes.func,
	openTchatboxAction: PropTypes.func,
	createNewChannelAction: PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		userFront: state.users.one,
		userMe: state.userMe.data,
		boxsOpen: state.tchat.boxsOpen,
		channelsList: state.tchat.channelsList
	};
};

export default connect(mapStateToProps, { getChannelsByUserIdAction, openTchatboxAction, createNewChannelAction })(User);
