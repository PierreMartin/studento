import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Container, Segment, Icon } from 'semantic-ui-react';
import moment from 'moment/moment';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursePage from '../components/CoursePage/CoursePage';
import classNames from 'classnames/bind';
import styles from './css/course.scss';

const cx = classNames.bind(styles);

class Course extends Component {
	getMetaData() {
		return {
			title: 'Course',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	render() {
		const { course } = this.props;
		const categoryInfo = course.category_info || {};
		const author = course.uId || {};
		const courseDate = moment(course.created_at).format('L');

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						{/* CourseHeaderPage */}
						<div className={cx('header-container')}>
							<h3 className={cx('header-title')}>{course.title}</h3>
							<div className={cx('header-description')}>{course.description || 'no description'}</div>
							<Icon className={cx('header-category')} name={categoryInfo.picto || 'code'} size="big" />
							<div className={cx('header-subcategories')}>
								{ course.subCategories && course.subCategories.map((subCat, i) => {
									const space = course.subCategories.length - 1 === i ? '' : ', ';
									return subCat + space;
								}) }
							</div>
							<div className={cx('header-rating')}>
								<Icon name="star" color="yellow" /> 121
							</div>
							<div className={cx('header-username')}>
								By: <Link to={`/user/${author._id}`}>{author.username}</Link> At: {courseDate}
							</div>
						</div>

						<CoursePage course={course} />
					</Container>
				</Segment>

			</LayoutPage>
		);
	}
}

Course.propTypes = {
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

const mapStateToProps = (state) => {
	return {
		course: state.courses.one
	};
};

export default connect(mapStateToProps, null)(Course);
