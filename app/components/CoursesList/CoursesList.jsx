import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Pagination } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/courseList.scss';

const cx = classNames.bind(styles);

const renderCoursesList = (courses) => {
	if (courses.length === 0) return <div>No yet courses</div>;

	return courses.map((course, key) => {
		const courseDate = moment(course.created_at).format('L');

		const categoryInfo = course.category_info || {};
		const author = course.uId || {};

		return (
			<Link key={key} to={`/course/${course._id}`} className={cx('course-container-item')}>
				<div className={cx('course-header')}>
					<Icon name={categoryInfo.picto || 'code'} size="big" />
					<div className={cx('subcat')}>
						{course.subCategories && course.subCategories.map((subCat, i) => {
							const space = course.subCategories.length - 1 === i ? '' : ', ';
							return subCat + space;
						})}
					</div>
				</div>
				<div className={cx('course-body')}>
					<h2 className={cx('title')}>{course.title}</h2>
					<div className={cx('description')}>{course.description}</div>
					<div className={cx('username')}>{author.username}</div>
					<div className={cx('date')}>{courseDate}</div>
				</div>
				<div className={cx('course-footer')}><div><Icon name="star" /> 121</div></div>
			</Link>
		);
	});
};

const renderPagination = (handlePaginationChange, coursesPagesCount, paginationIndexPage) => {
	return (
		<div className={cx('pagination')}>
			<Pagination
				activePage={paginationIndexPage}
				boundaryRange={1}
				siblingRange={1}
				onPageChange={handlePaginationChange}
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
};

const CoursesList = ({ courses, coursesPagesCount, paginationIndexPage, handlePaginationChange }) => {
	return (
		<div>
			<div className={cx('courses-container')}>
				{ renderCoursesList(courses) }
			</div>

			{coursesPagesCount > 0 && renderPagination(handlePaginationChange, coursesPagesCount, paginationIndexPage)}

		</div>
	);
};

CoursesList.propTypes = {
	handlePaginationChange: PropTypes.func,
	coursesPagesCount: PropTypes.number,
	paginationIndexPage: PropTypes.number,

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
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
