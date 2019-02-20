import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/buttonOpenMenuPanel.scss';

const cx = classNames.bind(styles);

const ButtonOpenMenuPanel = ({ handleOpenMenuPanel, isMenuPanelOpen	}) => {
	const classNameActionOpeningMenuPanel = isMenuPanelOpen ? 'opening-animation' : 'closing-animation';

	return (
		<button className={cx('menu-button')} onClick={handleOpenMenuPanel}>
			<span className={cx(classNameActionOpeningMenuPanel)} />
		</button>
	);
};

ButtonOpenMenuPanel.propTypes = {
	handleOpenMenuPanel: PropTypes.func,
	isMenuPanelOpen: PropTypes.bool
};

export default ButtonOpenMenuPanel;
