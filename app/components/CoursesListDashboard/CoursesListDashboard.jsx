import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Table, Button, Menu, Header } from 'semantic-ui-react';

const renderCoursesList = (courses) => {
	if (courses.length === 0) return 'No yet courses';

	return courses.map((course, key) => {
		const courseDate = moment(course.created_at).format('L');

		return (
			<Table.Row key={key}>
				<Table.Cell>
					<Header as="h4" image>
						<Header.Content><Header.Subheader>{course.uId.username}</Header.Subheader></Header.Content>
					</Header>
				</Table.Cell>
				<Table.Cell><a href={`/course/${course._id}`}>{course.title}</a></Table.Cell>
				<Table.Cell>
					<Header as="h4" image>
						<Header.Content><Header.Subheader>{courseDate}</Header.Subheader></Header.Content>
					</Header>
				</Table.Cell>
				<Table.Cell><Icon color="red" name="star" /> 121</Table.Cell>
				<Table.Cell><Button color="grey" content="Edit" icon="settings" size="tiny" as={Link} to={`/course/edit/${course._id}`} /></Table.Cell>
				<Table.Cell><Button inverted color="red" content="Delete" icon="remove" size="tiny" /></Table.Cell>
			</Table.Row>
		);
	});
};

const CoursesListDashboard = ({ courses }) => {
	return (
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Author</Table.HeaderCell>
					<Table.HeaderCell>Title</Table.HeaderCell>
					<Table.HeaderCell>Date</Table.HeaderCell>
					<Table.HeaderCell>Stars</Table.HeaderCell>
					<Table.HeaderCell>Edit</Table.HeaderCell>
					<Table.HeaderCell>Delete</Table.HeaderCell>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{ renderCoursesList(courses) }
			</Table.Body>

			<Table.Footer fullWidth>
				<Table.Row>
					<Table.HeaderCell colSpan="6">
						<Button basic color="grey" content="Add new course" floated="right" icon="add" as={Link} to="/course/create/new" />

						<Menu pagination>
							<Menu.Item as="a" icon><Icon name="chevron left" /></Menu.Item>
							<Menu.Item as="a">1</Menu.Item>
							<Menu.Item as="a">2</Menu.Item>
							<Menu.Item as="a" icon><Icon name="chevron right" /></Menu.Item>
						</Menu>
					</Table.HeaderCell>
				</Table.Row>
			</Table.Footer>
		</Table>
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
