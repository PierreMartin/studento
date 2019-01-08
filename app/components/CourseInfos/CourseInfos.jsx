import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment/moment';
import { Icon } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/courseInfos.scss';

const cx = classNames.bind(styles);

const CourseInfos = ({ course }) => {
	const categoryInfo = course.category_info || {};
	const author = course.uId || {};
	const courseDate = moment(course.created_at).format('L');

	return (
		<div className={cx('header-container')}>
			<h3 className={cx('header-title')}>{course.title}</h3>
			<div className={cx('header-description')}>{course.description || 'No description'}</div>
			<Icon className={cx('header-category')} name={categoryInfo.picto || 'code'} size="big" />
			<div className={cx('header-subcategories')}>
				{ course.subCategories && course.subCategories.map((subCat, i) => {
					const space = course.subCategories.length - 1 === i ? '' : ', ';
					return subCat + space;
				}) }
			</div>
			<div className={cx('header-username')}>
				By: <Link to={`/user/${author._id}`}>{author.username}</Link> At: {courseDate}
			</div>
		</div>
	);
};

CourseInfos.propTypes = {
	course: PropTypes.shape({
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
		content: PropTypes.string,
		description: PropTypes.string
	})
};

export default CourseInfos;
