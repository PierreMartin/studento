import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/navMainMobile.scss';

const cx = classNames.bind(styles);

class NavMainMobile extends Component {
	constructor(props) {
		super(props);
		this.handleOpenCategory = this.handleOpenCategory.bind(this);
		this.handleOpenSubCategory = this.handleOpenSubCategory.bind(this);
		this.handleOpenProfile = this.handleOpenProfile.bind(this);
		this.handleOpenAddNote = this.handleOpenAddNote.bind(this);
		this.handleClickLastNote = this.handleClickLastNote.bind(this);

		this.state = {
			isMenuCategoryOpen: false,
			indexSubCategoryOpened: -1, // === close
			isMenuProfileOpen: false,
			isMenuAddNoteOpen: false
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen !== this.props.isOpen && !this.props.isOpen) {
			// init all states when close menu:
			this.setState({ isMenuCategoryOpen: false, indexSubCategoryOpened: -1, isMenuProfileOpen: false, isMenuAddNoteOpen: false });
		}
	}

	handleClickLastNote() {
		const { fetchCoursesByFieldAction, userMe, courses } = this.props;

		if (courses.length) {
			browserHistory.push({ pathname: `/course/edit/${courses[0]._id}`, state: { typeNote: courses[0].type } });
			return;
		}

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: 1, showPrivate: true, paginationNumber: 1 }).then((res) => {
			if (res && res.courses && res.courses.length) {
				browserHistory.push({ pathname: `/course/edit/${res.courses[0]._id}`, state: { typeNote: res.courses[0].type } });
			} else {
				browserHistory.push({ pathname: '/course/create/new', state: { typeNote: 'wy' } });
			}
		});
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

	handleOpenAddNote(doOpen) {
		return () => this.setState({ isMenuAddNoteOpen: doOpen });
	}

	render() {
		const { isOpen, categories, userMe, authentification, pathUrl, logoutAction } = this.props;
		const { isMenuCategoryOpen, indexSubCategoryOpened, isMenuProfileOpen, isMenuAddNoteOpen } = this.state;
		const categorySelected = categories[indexSubCategoryOpened];

		return (
			<nav className={cx('container', isOpen ? 'menu-open' : '')}>
				<div className={cx('mobile-nav-main')}>
					<ul>
						<li><Link className={cx('arrow-after')} onClick={this.handleOpenCategory(true)}>Categories</Link></li>
						{/*{ authentification.authenticated && <li className={cx(pathUrl === '/dashboard' ? 'active' : '')}><Link to="/dashboard">Your notes</Link></li> }*/}
						{ authentification.authenticated && <li><Link onClick={this.handleClickLastNote}>Your Notes</Link></li> }
						{ authentification.authenticated && <li className={cx(pathUrl === '/users' ? 'active' : '')}><Link to="/users">Users</Link></li> }
						{ authentification.authenticated && <li><Link className={cx('arrow-after')} onClick={this.handleOpenProfile(true)}>{userMe.username}</Link></li> }
						{ authentification.authenticated && <li><Link className={cx('arrow-after')} onClick={this.handleOpenAddNote(true)}>Add a note</Link></li> }
						<li className={cx(pathUrl === '/about' ? 'active' : '')}><Link to="/about">About</Link></li>
					</ul>
				</div>

				<div className={cx('category', isMenuCategoryOpen ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenCategory(false)}>Back to menu</Link></li>
						</ul>
					</header>
					<ul className={cx('list')} >
						{ categories && categories.length > 0 && categories.map((cat, indexCat) => {
							return (
								<li key={indexCat}>
									<Link className={cx('arrow-after')} onClick={this.handleOpenSubCategory(indexCat)}>
										<Icon name={cat.picto} />
										{ cat.name }
									</Link>
								</li>
							);
						}) }
					</ul>
				</div>

				<div className={cx('sub-category', indexSubCategoryOpened !== -1 ? 'active' : '')}>
					<header>
						<ul>
							{ categorySelected && categorySelected.name && <li><Link className={cx('arrow-before')} onClick={this.handleOpenSubCategory(-1)}>{ categorySelected.name }</Link></li> }
						</ul>
					</header>
					<ul>
						{ categorySelected && categorySelected.key && <li><Link className={cx('link')} to={`/courses/${categorySelected.key}/list`}>All</Link></li> }

						{ categorySelected && categorySelected.subCategories && categorySelected.subCategories.length > 0 ?
							categorySelected.subCategories.map((subCat, indexSubCat) => {
								return (<li key={indexSubCat}><Link to={`/courses/${categorySelected.key}/${subCat.key}`}>{ subCat.name }</Link></li>);
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
						<li><Link to="/settings">Edit your profile</Link></li>
						<li><Link to="/" onClick={logoutAction}>Logout</Link></li>
					</ul>
				</div>

				<div className={cx('add-note', isMenuAddNoteOpen ? 'active' : '')}>
					<header>
						<ul>
							<li><Link className={cx('arrow-before')} onClick={this.handleOpenAddNote(false)}>Go back</Link></li>
						</ul>
					</header>
					<ul>
						<li><Link to={{ pathname: '/course/create/new', state: { typeNote: 'wy' } }} >Add a Note</Link></li>
						<li><Link to={{ pathname: '/course/create/new', state: { typeNote: 'md' } }}>Add a Markdown Note</Link></li>
					</ul>
				</div>
			</nav>
		);
	}
}


NavMainMobile.propTypes = {
	isOpen: PropTypes.bool,
	authentification: PropTypes.object,
	pathUrl: PropTypes.string,
	logoutAction: PropTypes.func,
	fetchCoursesByFieldAction: PropTypes.func,

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		category_info: (PropTypes.shape({
			description: PropTypes.string,
			key: PropTypes.string,
			name: PropTypes.string,
			picto: PropTypes.string
		})),
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})),

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
