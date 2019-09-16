import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/buttonOpenPanelSettings.scss';

const cx = classNames.bind(styles);

const ButtonOpenPanelSettings = ({ handleOpenPanel, isPanelOpen	}) => {
	const classNameActionOpeningMenuPanel = isPanelOpen ? 'opening-animation' : 'closing-animation';

	return (
		<button className={cx('menu-button')} onClick={handleOpenPanel}>
			<span className={cx(classNameActionOpeningMenuPanel)} />
		</button>
	);
};

ButtonOpenPanelSettings.propTypes = {
	handleOpenPanel: PropTypes.func,
	isPanelOpen: PropTypes.bool
};

export default ButtonOpenPanelSettings;
