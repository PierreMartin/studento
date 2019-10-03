import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction } from '../../actions/courses';
import { List, Icon, Rating, Button } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorPanelExplorer.scss';

const cx = classNames.bind(styles);

class EditorPanelExplorer extends Component {
	constructor(props) {
		super(props);
		this.handleOnClickLoadMore = this.handleOnClickLoadMore.bind(this);
	}

	componentDidMount() {
		const { fetchCoursesByFieldAction, userMe } = this.props;

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: 1, showPrivate: true, paginationNumber: 80 });
	}

	renderCoursesList() {
		const { courses, course, isDirty, handleModalOpen_CanClose } = this.props;

		if (courses.length === 0) return <div className={cx('message-empty-note')}>No yet note</div>;

		return courses.map((c) => {
			const isTypeMarkDown = c.type !== 'wy';
			const pathname = { pathname: `/course/edit/${c._id}`, state: { typeNote: c.type } };
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
					to={pathname}
					onClick={isDirty ? handleModalOpen_CanClose(pathname) : null}
				>
					<div className={cx('title-container')}>
						<Icon name={icon} />
						<div className={cx('title')}>{c.title}</div>
					</div>
					<div className={cx('rating')}><Rating disabled rating={average} maxRating={5} size="mini" /> { numberOfVote }</div>
				</List.Item>
			);
		});
	}

	handleOnClickLoadMore() {
		const { fetchCoursesByFieldAction, userMe, activePage, handleActivePageChange } = this.props;

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: activePage + 1, showPrivate: true, paginationNumber: 80, paginationMethod: 'push' });
		handleActivePageChange(activePage + 1);
	}

	render() {
		const { isOpen, coursesPagesCount, activePage } = this.props;

		return (
			<div className={cx('panel-explorer-container', isOpen ? 'menu-open' : '')}>
				<List className={cx('panel-explorer-tree-folder-itemslist')} link>
					{ this.renderCoursesList()}
				</List>

				{ (coursesPagesCount > 1 && activePage < coursesPagesCount) && <Button basic inverted size="small" title="Load more notes" onClick={this.handleOnClickLoadMore} content="Load more notes" style={{ minHeight: 34 }} />}
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

	activePage: PropTypes.number,

	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	coursesPagesCount: PropTypes.number,
	fetchCoursesByFieldAction: PropTypes.func
};

export default connect(null, { fetchCoursesByFieldAction })(EditorPanelExplorer);
