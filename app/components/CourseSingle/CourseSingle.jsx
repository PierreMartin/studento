import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Segment, Header, Icon } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from './css/courseSingle.scss';

// const cx = classNames.bind(styles);

const CourseSingle = ({ course }) => {
	const author = course.uId || {};
	const categoryInfo = course.category_info || {};

	return (
		<div>
			<div style={{ textAlign: 'center', margin: '10px' }}>
				<Icon style={{ fontSize: '55px' }} name={categoryInfo.picto || 'code'} size="big" />
				<div>
					{ course.subCategories && course.subCategories.map((subCat, i) => {
						const space = course.subCategories.length - 1 === i ? '' : ', ';
						return subCat + space;
					}) }
				</div>
			</div>

			<div>
				<Header as="h3" attached="top">{course.title}</Header>
				<Segment attached>
					{course.content}
				</Segment>
				<Segment attached>
					By: <Link to={`/user/${author._id}`}>{author.username}</Link>
				</Segment>
			</div>

		</div>
	);
};

CourseSingle.propTypes = {
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
		content: PropTypes.string
	})
};

export default CourseSingle;
