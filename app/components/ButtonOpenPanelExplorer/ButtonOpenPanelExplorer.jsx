import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/buttonOpenPanelExplorer.scss';

const cx = classNames.bind(styles);

const ButtonOpenPanelExplorer = ({ handleOpenPanel, isPanelOpen	}) => {
	const classNameActionOpeningMenuPanel = isPanelOpen ? 'opening-animation' : 'closing-animation';

	return (
		<button className={cx('menu-button')} onClick={handleOpenPanel}>
			<span className={cx(classNameActionOpeningMenuPanel)} />
		</button>
	);
};

ButtonOpenPanelExplorer.propTypes = {
	handleOpenPanel: PropTypes.func,
	isPanelOpen: PropTypes.bool
};

export default ButtonOpenPanelExplorer;
