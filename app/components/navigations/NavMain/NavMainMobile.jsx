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
		const { categories, userMe } = this.props;
		const { isMenuCategoryOpen, isMenuSubCategoryOpen } = this.state;

		return (
			<nav className={cx('container')}>
				<div className={cx('mobile-nav-main')}>
					<ul>
						<li><a href="#" className={cx('arrow-after')} onClick={this.handleOpenCategory(true)}>Categories</a></li>
						<li className={cx('active')}><a href="/about">About</a></li>
						<li><a href="/users">Users</a></li>
						<li><a href="#">{userMe.username}</a></li>
						<li><a href="#" className={cx('arrow-after')}>Add a note</a></li>
						<li><a href="#">Messages</a></li>
					</ul>
				</div>

				<div className={cx('category', isMenuCategoryOpen ? 'active' : '')}>
					<header>
						<ul>
							<li><a href="#" className={cx('arrow-before')} onClick={this.handleOpenCategory(false)}>Go back</a></li>
						</ul>
					</header>
					{/* return categories.map(...) */}
					<ul>
						<li><a href="#" onClick={this.handleOpenSubCategory(0)}>1</a></li>
						<li><a href="#" onClick={this.handleOpenSubCategory(1)}>2</a></li>
						<li><a href="#" onClick={this.handleOpenSubCategory(2)}>3</a></li>
					</ul>
				</div>

				<div className={cx('sub-category', isMenuSubCategoryOpen !== -1 ? 'active' : '')}>
					<header>
						<ul>
							<li><a href="#" className={cx('arrow-before')} onClick={this.handleOpenSubCategory(-1)}>Go back</a></li>
						</ul>
					</header>
					{/* return categories[isMenuSubCategoryOpen].subCategories(...) */}
					<ul>
						<li><a href="#">3a</a></li>
						<li><a href="#">3b</a></li>
						<li><a href="#">3c</a></li>
					</ul>
				</div>
			</nav>
		);
	}
}


NavMainMobile.propTypes = {
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
