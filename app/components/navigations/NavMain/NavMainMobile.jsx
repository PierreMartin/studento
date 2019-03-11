import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/navMainMobile.scss';


const cx = classNames.bind(styles);

class NavMainMobile extends Component {
	constructor(props) {
		super(props);
		this.handleOpenCategory = this.handleOpenCategory.bind(this);
		this.handleOpenSubCategory = this.handleOpenSubCategory.bind(this);

		this.state = {
			isMenuCategoryOpen: false,
			isMenuSubCategoryOpen: -1 // === close
		};
	}

	componentDidMount() {
		//
	}

	handleOpenCategory(doOpen) {
		return () => this.setState({ isMenuCategoryOpen: doOpen });
	}

	handleOpenSubCategory(index) {
		return () => this.setState({ isMenuSubCategoryOpen: index });
	}

	render() {
		const { categories, userMe, authentification } = this.props;
		const { isMenuCategoryOpen, isMenuSubCategoryOpen } = this.state;

		return (
			<nav className={cx('container')}>
				<div className={cx('mobile-nav-main')}>
					<ul>
						<li><Link className={cx('arrow-after')} onClick={this.handleOpenCategory(true)}>Categories</Link></li>
						<li className={cx('active')}><Link to="/about">About</Link></li>
						{ authentification.authenticated && <li><Link to="/users">Users</Link></li> }
						{ authentification.authenticated && <li><Link to="/">{userMe.username}</Link></li> }
						{ authentification.authenticated && <li><Link to="/" className={cx('arrow-after')}>Add a note</Link></li> }
						{ authentification.authenticated && <li><Link to="/">Messages</Link></li> }
					</ul>
				</div>

				<div className={cx('category', isMenuCategoryOpen ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenCategory(false)}>Go back</Link></li>
						</ul>
					</header>
					{/* return categories.map(...) */}
					<ul>
						<li><Link onClick={this.handleOpenSubCategory(0)}>1</Link></li>
						<li><Link onClick={this.handleOpenSubCategory(1)}>2</Link></li>
						<li><Link onClick={this.handleOpenSubCategory(2)}>3</Link></li>
					</ul>
				</div>

				<div className={cx('sub-category', isMenuSubCategoryOpen !== -1 ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenSubCategory(-1)}>Go back</Link></li>
						</ul>
					</header>
					{/* return categories[isMenuSubCategoryOpen].subCategories(...) */}
					<ul>
						<li><Link to="/">3a</Link></li>
						<li><Link to="/">3b</Link></li>
						<li><Link to="/">3c</Link></li>
					</ul>
				</div>
			</nav>
		);
	}
}


NavMainMobile.propTypes = {
	authentification: PropTypes.object,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		picto: PropTypes.string,
		subCategories: PropTypes.array
	}))
};

export default NavMainMobile;
