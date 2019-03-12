import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/buttonOpenMenuMobile.scss';

const cx = classNames.bind(styles);

class ButtonOpenMenuMobile extends Component {
	render() {
		const { handleOpenMenuMobile, isMenuMobileOpen } = this.props;
		const classNameActionOpeningMenuMobile = isMenuMobileOpen ? 'opening-animation' : 'closing-animation';

		return (
			<button className={cx('menu-button')} onClick={handleOpenMenuMobile}>
				<span className={cx(classNameActionOpeningMenuMobile)} />
			</button>
		);
	}
}

ButtonOpenMenuMobile.propTypes = {
	handleOpenMenuMobile: PropTypes.func,
	isMenuMobileOpen: PropTypes.bool
};

export default ButtonOpenMenuMobile;
