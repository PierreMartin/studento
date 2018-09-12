import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Pagination } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/courseList.scss';

const cx = classNames.bind(styles);


class CoursesList extends Component {
	constructor(props) {
		super(props);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);

		this.state = {
			pagination: {
				indexPage: 1
			}
		};
	}

	handlePaginationChange = (e, { activePage }) => {
		this.setState({ pagination: { ...this.state.pagination, indexPage: activePage } });
		const lastActivePage = this.state.pagination.indexPage;
		this.props.paginationChange(activePage, lastActivePage);
	}

	renderCoursesList(courses) {
		if (courses.length === 0) return 'No yet courses';

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L');

			const categoryInfo = course.category_info || {};
			const author = course.uId || {};

			return (
				<Link key={key} to={`/course/${course._id}`} className={cx('course-container-item')}>
					<div className={cx('course-header')}><Icon name={categoryInfo.picto || 'code'} size="big" /></div>
					<div className={cx('course-body')}>
						<div className={cx('subcat')}>{course.subCategories && course.subCategories.map((subCat, i) => {
							const space = course.subCategories.length - 1 === i ? '' : ', ';
							return subCat + space;
						})}</div>
						<div className={cx('title')}>{course.title}</div>
						<div className={cx('username')}>{author.username}</div>
						<div className={cx('date')}>{courseDate}</div>
					</div>
					<div className={cx('course-footer')}><div><Icon name="star" /> 121</div></div>
				</Link>
			);
		});
	}

	render() {
		const { courses, coursesPagesCount } = this.props;
		const { pagination } = this.state;

		return (
			<div>
				<div className={cx('course-container')}>
					{ this.renderCoursesList(courses) }
				</div>

				<Pagination
					activePage={pagination.indexPage}
					boundaryRange={1}
					siblingRange={1}
					onPageChange={this.handlePaginationChange}
					size="small"
					totalPages={coursesPagesCount}
					ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
					prevItem={{ content: <Icon name="angle left" />, icon: true }}
					nextItem={{ content: <Icon name="angle right" />, icon: true }}
					firstItem={null}
					lastItem={null}
				/>
			</div>
		);
	}
}

CoursesList.propTypes = {
	paginationChange: PropTypes.func,
	coursesPagesCount: PropTypes.number,

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
	})).isRequired
};

export default CoursesList;
