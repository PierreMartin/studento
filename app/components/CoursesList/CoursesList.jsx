import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './css/courseList.scss';

const cx = classNames.bind(styles);


class CoursesList extends Component {
	renderCoursesList(courses) {
		if (courses.length === 0) return 'No yet courses';

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L');

			return (
				<Link key={key} to={`/course/${course._id}`} className={cx('course-container-item')}>
					<div className={cx('course-header')}><Icon name={course.category_info.picto || 'code'} size="big" /></div>
					<div className={cx('course-body')}>
						<div className={cx('subcat')}>{course.subCategories.map((subCat, i) => {
							const space = course.subCategories.length - 1 === i ? '' : ', ';
							return subCat + space;
						})}</div>
						<div className={cx('title')}>{course.title}</div>
						<div className={cx('username')}>{course.uId.username}</div>
						<div className={cx('date')}>{courseDate}</div>
					</div>
					<div className={cx('course-footer')}><div><Icon name="star" /> 121</div></div>
				</Link>
			);
		});
	}

	render() {
		const { courses } = this.props;

		return (
			<div className={cx('course-container')}>{ this.renderCoursesList(courses) }</div>
		);
	}
}

CoursesList.propTypes = {
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

const mapStateToProps = (/*state*/) => {
	return {};
};

export default connect(mapStateToProps, null)(CoursesList);
