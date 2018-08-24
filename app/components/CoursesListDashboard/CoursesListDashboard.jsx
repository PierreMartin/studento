import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Item, Image } from 'semantic-ui-react';
import defaultAvatar28 from '../../images/default-avatar-28.png';


const renderCoursesList = (courses) => {
	if (courses.length === 0) {
		return (<div>no yet courses</div>);
	}

	return courses.map((course, key) => {
		const src = course.uId && course.uId.avatarMainSrc && course.uId.avatarMainSrc.avatar28 ? `/uploads/${course.uId.avatarMainSrc.avatar28}` : defaultAvatar28;
		const courseDate = moment(course.created_at).format('MMMM Do LT');

		return (
			<Item key={key} style={{ marginBottom: '40px' }}>
				<Item.Content>
					<Image circular floated="left" size="mini" src={src} />
					<Item.Header as="a" style={{ fontSize: '1.4em' }}>{course.title}</Item.Header>
					<Item.Description>{course.content}</Item.Description>
					<Item.Extra><Icon color="red" name="star" /> 121 stars</Item.Extra>
					<Item.Extra>Create at: {courseDate}</Item.Extra>
				</Item.Content>
			</Item>
		);
	});
};

const CoursesListDashboard = ({ courses }) => {
	return (
		<div>
			<Item.Group>
				{ renderCoursesList(courses) }
			</Item.Group>
		</div>
	);
};

CoursesListDashboard.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})).isRequired
};

export default CoursesListDashboard;
