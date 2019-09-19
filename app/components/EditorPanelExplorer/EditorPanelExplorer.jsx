import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction, setPaginationCoursesEditorAction } from '../../actions/courses';
import { List, Icon, Pagination, Rating } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorPanelExplorer.scss';

const cx = classNames.bind(styles);

class EditorPanelExplorer extends Component {
	constructor(props) {
		super(props);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
	}

	componentDidMount() {
		const { fetchCoursesByFieldAction, userMe, paginationEditor } = this.props;

		// If lastActivePage === 1st page:
		if (paginationEditor.lastActivePage === 1) {
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, showPrivate: true });
		} else if (paginationEditor.lastActivePage > 1) {
			// If lastActivePage > 1st page:
			const activePage = paginationEditor.lastActivePage;
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage, showPrivate: true });
		}
	}

	handlePaginationChange = (e, { activePage }) => {
		const { userMe, fetchCoursesByFieldAction, paginationEditor, setPaginationCoursesEditorAction } = this.props;
		const lastActivePage = paginationEditor.lastActivePage;

		if (activePage === lastActivePage) return;

		setPaginationCoursesEditorAction(activePage);
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage, showPrivate: true });
	};

	renderCoursesList() {
		const { courses, course, isDirty, handleModalOpen_CanClose } = this.props;

		if (courses.length === 0) return <div className={cx('message-empty-note')}>No yet note</div>;

		return courses.map((c) => {
			const isTypeMarkDown = c.type !== 'wy';
			const pathname = isTypeMarkDown ? `/courseMd/edit/${c._id}` : `/course/edit/${c._id}`;
			const pathCourseToEdit = { pathname, state: { isMenuPanelOpen: false } };
			const icon = isTypeMarkDown ? 'file' : 'file text';
			const isActive = course._id === c._id;
			const stars = course.stars || {};
			const average = stars.average || 0;
			const numberOfVote = stars.numberOfTimeVoted || 'No vote';

			return (
				<List.Item
					key={c._id}
					as={isDirty ? 'a' : Link}
					active={isActive}
					className={cx(isActive ? 'active-course' : '')}
					to={pathCourseToEdit}
					onClick={isDirty ? handleModalOpen_CanClose(pathCourseToEdit) : null}
					icon={icon}
				>
					<div className={cx('title')}>{c.title}</div>
					<div className={cx('rating')}><Rating disabled rating={average} maxRating={5} size="mini" /> { numberOfVote }</div>
				</List.Item>
			);
		});
	}

	renderPaginationCoursesList() {
		const { paginationEditor, coursesPagesCount } = this.props;

		return (
			<Pagination
				inverted
				activePage={paginationEditor.lastActivePage}
				boundaryRange={1}
				siblingRange={1}
				onPageChange={this.handlePaginationChange}
				size="mini"
				totalPages={coursesPagesCount}
				ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
				prevItem={{ content: <Icon name="angle left" />, icon: true }}
				nextItem={{ content: <Icon name="angle right" />, icon: true }}
				firstItem={null}
				lastItem={null}
			/>
		);
	}

	render() {
		const { isOpen } = this.props;

		return (
			<div className={cx('panel-explorer-container', isOpen ? 'menu-open' : '')}>
				<List className={cx('panel-explorer-tree-folder-itemslist')} link>
					{ this.renderCoursesList()}
				</List>

				{/*
				{ coursesPagesCount > this.state.prevPage && <button title="Load more notes" onClick={renderPaginationCoursesList}><Icon name="pencil" /></button>}
				*/}
			</div>
		);
	}
}

EditorPanelExplorer.propTypes = {
	isOpen: PropTypes.bool,
	isDirty: PropTypes.bool,
	handleModalOpen_CanClose: PropTypes.func,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		type: PropTypes.string
	})),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	paginationEditor: PropTypes.shape({
		lastActivePage: PropTypes.number
	}),

	coursesPagesCount: PropTypes.number,

	fetchCoursesByFieldAction: PropTypes.func,
	setPaginationCoursesEditorAction: PropTypes.func
};

export default connect(null, { fetchCoursesByFieldAction, setPaginationCoursesEditorAction })(EditorPanelExplorer);
