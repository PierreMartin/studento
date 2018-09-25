import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Chat from '../../Tchat/TchatContainer';
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

const LayoutMainApp = ({ children, channelsListOpen }) => {
	return (
		<div>
			<div className={cx('layout-container')}>{children}</div>
			<ToastContainer />
			{ renderTchatBoxs(channelsListOpen) }
		</div>
	);
};

LayoutMainApp.propTypes = {
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

export default connect(mapStateToProps, null)(LayoutMainApp);
