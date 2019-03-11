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
		this.handleOpenProfile = this.handleOpenProfile.bind(this);

		this.state = {
			isMenuCategoryOpen: false,
			indexSubCategoryOpened: -1, // === close
			isMenuProfileOpen: false
		};
	}

	handleOpenCategory(doOpen) {
		return () => this.setState({ isMenuCategoryOpen: doOpen });
	}

	handleOpenSubCategory(index) {
		return () => this.setState({ indexSubCategoryOpened: index });
	}

	handleOpenProfile(doOpen) {
		return () => this.setState({ isMenuProfileOpen: doOpen });
	}

	render() {
		const { categories, userMe, authentification, pathUrl, logoutAction } = this.props;
		const { isMenuCategoryOpen, indexSubCategoryOpened, isMenuProfileOpen } = this.state;

		return (
			<nav className={cx('container')}>
				<div className={cx('mobile-nav-main')}>
					<ul>
						<li><Link className={cx('arrow-after')} onClick={this.handleOpenCategory(true)}>Categories</Link></li>
						<li className={cx(pathUrl === '/about' ? 'active' : '')}><Link to="/about">About</Link></li>
						{ authentification.authenticated && <li className={cx(pathUrl === '/users' ? 'active' : '')}><Link to="/users">Users</Link></li> }
						{ authentification.authenticated && <li><Link className={cx('arrow-after')} onClick={this.handleOpenProfile(true)}>{userMe.username}</Link></li> }
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
					<ul className={cx('list')} >
						{ categories && categories.length > 0 && categories.map((cat, indexCat) => {
								return (
									<li key={indexCat}>
										<Link className={cx('link')} to={`/courses/${cat.key}/list`}>{ cat.name }</Link>
										<Link className={cx('arrow-after')} onClick={this.handleOpenSubCategory(indexCat)} />
									</li>
								);
						}) }
					</ul>
				</div>

				<div className={cx('sub-category', indexSubCategoryOpened !== -1 ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenSubCategory(-1)}>Go back</Link></li>
						</ul>
					</header>
					<ul>
						{ categories[indexSubCategoryOpened] && categories[indexSubCategoryOpened].subCategories && categories[indexSubCategoryOpened].subCategories.length > 0 ?
							categories[indexSubCategoryOpened].subCategories.map((subCat, indexSubCat) => {
								return (
									<li key={indexSubCat}>
										<Link to={`/courses/${categories[indexSubCategoryOpened].key}/${subCat.key}`}>{ subCat.name }</Link>
									</li>
								);
							}) : ''
						}
					</ul>
				</div>

				<div className={cx('profile', isMenuProfileOpen ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenProfile(false)}>Go back</Link></li>
						</ul>
					</header>
					<ul>
						<li><Link to={`/user/${userMe._id}`}>Your profile</Link></li>
						<li><Link to="/dashboard">Your notes</Link></li>
						<li><Link to="/settings">Edit your profile</Link></li>
						<li><Link to="/" onClick={logoutAction}>Logout</Link></li>
					</ul>
				</div>
			</nav>
		);
	}
}


NavMainMobile.propTypes = {
	authentification: PropTypes.object,
	pathUrl: PropTypes.string,
	logoutAction: PropTypes.func,

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
