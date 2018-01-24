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

const renderTchatBoxs = (boxsOpen) => {
	if (boxsOpen.length > 0) {
		return boxsOpen.map((channelIdOfBoxOpen, index) => {
			return (channelIdOfBoxOpen && <Chat key={index} socket={socket} channelId={channelIdOfBoxOpen} position={index} />);
		});
	}
};

const App = ({ children, boxsOpen }) => {
  return (
    <div className={cx('myClass', 'myOtherClass')}>
      <NavMain />
      {children}
			<ToastContainer />
			{ renderTchatBoxs(boxsOpen) }

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
	boxsOpen: PropTypes.array
};

function mapStateToProps(state) {
	return {
		boxsOpen: state.tchat.boxsOpen
	};
}

export default connect(mapStateToProps, null)(App);
