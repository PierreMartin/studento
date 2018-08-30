import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Table, Button, Menu, Header, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { deleteCourseAction, doSortCoursesAction } from '../../actions/courses';

class CoursesListDashboard extends Component {
	constructor(props) {
		super(props);
		this.handleOpenModalForDeleteCourse = this.handleOpenModalForDeleteCourse.bind(this);
		this.handleSubmitDeleteCourse = this.handleSubmitDeleteCourse.bind(this);

		this.state = {
			deleteCourse: {
				isModalOpened: false,
				courseId: '',
				courseTitle: ''
			},
			lastColumnClicked: null,
			direction: null
		};
	}

	handleOpenModalForDeleteCourse = (param) => {
		return () => {
			const { courseId, courseTitle } = param;

			// Open modal :
			if (typeof courseId === 'string' && courseId.length > 0) {
				return this.setState({ deleteCourse: { isModalOpened: true, courseId, courseTitle } });
			}

			// Close modal :
			this.setState({ deleteCourse: { isModalOpened: false, courseId: '', courseTitle: '' } });
		};
	};

	handleSubmitDeleteCourse() {
		const { deleteCourseAction } = this.props;
		const { deleteCourse } = this.state;

		if (deleteCourse && deleteCourse.courseId) {
			deleteCourseAction(deleteCourse).then(() => {
				// Close modal :
				this.setState({ deleteCourse: { isModalOpened: false, courseId: '', courseTitle: '' } });
			});
		}
	}

	/**
	 * Handle the sorting when click on the columns in the table
	 *
	 * @param {string} clickedColumn - the name of the colmun, it must match with the name of the field in the store
	 * @return {void}
	 * */
	handleSort = clickedColumn => () => {
		const { doSortCoursesAction } = this.props;
		const { lastColumnClicked, direction } = this.state;

		// If clicked on a new column:
		if (lastColumnClicked !== clickedColumn) {
			doSortCoursesAction({ clickedColumn, doReverse: false });
			return this.setState({ lastColumnClicked: clickedColumn, direction: 'ascending' });
		}

		doSortCoursesAction({ clickedColumn, doReverse: true });
		this.setState({ direction: direction === 'ascending' ? 'descending' : 'ascending' });
	}

	renderCoursesList(courses) {
		if (courses.length === 0) return 'No yet courses';

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L, h:mm:ss a');

			return (
				<Table.Row key={key}>
					<Table.Cell>
						<Header as="h4">
							<Header.Content><Header.Subheader>{course.uId.username}</Header.Subheader></Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell><a href={`/course/${course._id}`}>{course.title}</a></Table.Cell>
					<Table.Cell>
						<Header as="h4">
							<Header.Content><Header.Subheader>{courseDate}</Header.Subheader></Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell><Icon color="red" name="star" /> 121</Table.Cell>
					<Table.Cell><Button color="grey" content="Edit" icon="settings" size="tiny" as={Link} to={`/course/edit/${course._id}`} /></Table.Cell>
					<Table.Cell><Button inverted color="red" content="Delete" icon="remove" size="tiny" onClick={this.handleOpenModalForDeleteCourse({ courseId: course._id, courseTitle: course.title })} /></Table.Cell>
				</Table.Row>
			);
		});
	}

	render() {
		const { courses } = this.props;
		const { deleteCourse, lastColumnClicked, direction } = this.state;

		return (
			<div>
				<Table celled unstackable compact="very" sortable fixed>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Author</Table.HeaderCell>
							<Table.HeaderCell sorted={lastColumnClicked === 'title' ? direction : null} onClick={this.handleSort('title')}>Title</Table.HeaderCell>
							<Table.HeaderCell sorted={lastColumnClicked === 'created_at' ? direction : null} onClick={this.handleSort('created_at')}>Date</Table.HeaderCell>
							<Table.HeaderCell>Stars</Table.HeaderCell>
							<Table.HeaderCell>Edit</Table.HeaderCell>
							<Table.HeaderCell>Delete</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{ this.renderCoursesList(courses) }
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

				<Modal open={deleteCourse.isModalOpened} onClose={this.handleOpenModalForDeleteCourse({})}>
					<Modal.Header>Delete a course</Modal.Header>
					<Modal.Content image>
						<Modal.Description>
							<Header>Are you sure to delete the course "{deleteCourse.courseTitle}"?</Header>
							<p>ATTENTION this action is irreversible!</p>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color="black" onClick={this.handleOpenModalForDeleteCourse({})}>Cancel</Button>
						<Button icon="checkmark" color="red" labelPosition="right" content="Ok" onClick={this.handleSubmitDeleteCourse} />
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}

CoursesListDashboard.propTypes = {
	deleteCourseAction: PropTypes.func,
	doSortCoursesAction: PropTypes.func,

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})).isRequired
};

const mapStateToProps = (state) => {
	return {
		courses: state.courses.all
	};
};

export default connect(mapStateToProps, { deleteCourseAction, doSortCoursesAction })(CoursesListDashboard);
