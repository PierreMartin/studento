import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import NavMain from '../../navigations/NavMain/NavMain';
import Chat from '../../Tchat/TchatContainer';
import { Grid, Header, List, Segment, Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import styles from '../../../css/main.scss';

const cx = classNames.bind(styles);
const socket = io('', { path: '/api/tchat' });

const renderTchatBoxs = (channelsListOpen) => {
	if (Object.keys(channelsListOpen).length > 0) {
		return Object.values(channelsListOpen).map((channelOfBoxOpen, index) => {
			return (channelOfBoxOpen.id && <Chat key={index} socket={socket} channelId={channelOfBoxOpen.id} position={index} />);
		});
	}
};

const App = ({ children, channelsListOpen }) => {
  return (
    <div className={cx('myClass', 'myOtherClass')}>
      <NavMain />
      {children}
			<ToastContainer />
			{ renderTchatBoxs(channelsListOpen) }

			<Segment inverted vertical style={{ padding: '5em 0em' }}>
				<Container text>
					<Grid divided inverted stackable>
						<Grid.Row>
							<Grid.Column width={3}>
								<Header inverted as="h4" content="About" />
								<List link inverted>
									<List.Item as="a">Sitemap</List.Item>
									<List.Item as="a">Contact Us</List.Item>
									<List.Item as="a">Religious Ceremonies</List.Item>
									<List.Item as="a">Gazebo Plans</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={3}>
								<Header inverted as="h4" content="Services" />
								<List link inverted>
									<List.Item as="a">Banana Pre-Order</List.Item>
									<List.Item as="a">DNA FAQ</List.Item>
									<List.Item as="a">How To Access</List.Item>
									<List.Item as="a">Favorite X-Men</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={7}>
								<Header as="h4" inverted>Footer Header</Header>
								<p>Extra space for a call to action inside the footer that could help re-engage users.</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object,

	channelsListOpen: PropTypes.shape({
		id: PropTypes.string,
		users: PropTypes.object // populate
	})
};

function mapStateToProps(state) {
	return {
		channelsListOpen: state.tchat.channelsListOpen
	};
}

export default connect(mapStateToProps, null)(App);
