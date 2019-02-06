import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Table, Button, Header, Modal, Pagination, Popup, Rating } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction, deleteCourseAction, doSortCoursesAction, setPaginationCoursesEditorAction } from '../../actions/courses';
import classNames from 'classnames/bind';
import styles from './css/coursesListDashbord.scss';

const cx = classNames.bind(styles);

class CoursesListDashboard extends Component {
	constructor(props) {
		super(props);
		this.handleOpenModalForDeleteCourse = this.handleOpenModalForDeleteCourse.bind(this);
		this.handleSubmitDeleteCourse = this.handleSubmitDeleteCourse.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);

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

	componentDidMount() {
		const { userMe, fetchCoursesByFieldAction, paginationEditor } = this.props;

		// If lastActivePage === 1st page:
		if (paginationEditor.lastActivePage === 1) {
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });
		} else if (paginationEditor.lastActivePage > 1) {
			// If lastActivePage > 1st page:
			const activePage = paginationEditor.lastActivePage;
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage });
		}
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
		const { deleteCourseAction, courses, paginationEditor, userMe, fetchCoursesByFieldAction, setPaginationCoursesEditorAction } = this.props;
		const { deleteCourse } = this.state;

		if (deleteCourse && deleteCourse.courseId) {
			deleteCourseAction(deleteCourse).then(() => {
				// Close modal :
				this.setState({ deleteCourse: { isModalOpened: false, courseId: '', courseTitle: '' } });

				// If no more course on (page > 1) : goto 1st page
				if ((courses.length === 1 || !courses) && paginationEditor.lastActivePage > 1) {
					setPaginationCoursesEditorAction(1);
					fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });
				}
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
	};

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, paginationEditor, setPaginationCoursesEditorAction, userMe } = this.props;
		const lastActivePage = paginationEditor.lastActivePage;

		if (activePage === lastActivePage) return;

		setPaginationCoursesEditorAction(activePage);
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage });
	};

	renderCoursesList(courses) {
		if (courses.length === 0) return;

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L, h:mm:ss a');
			const pathCourseToEdit = course.type !== 'wy' ? `/courseMd/edit/${course._id}` : `/course/edit/${course._id}`;
			const stars = course.stars || {};
			const average = stars.average || 0;
			let numberOfVote = 'No vote';

			if (stars.numberOfTimeVoted === 1) {
				numberOfVote = stars.numberOfTimeVoted + ' note';
			} else if (stars.numberOfTimeVoted > 1) {
				numberOfVote = stars.numberOfTimeVoted + ' notes';
			}

			return (
				<Table.Row key={key}>
					<Table.Cell>
						<Header as="h4">
							<Header.Content><Header.Subheader>{course.uId.username}</Header.Subheader></Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell><Link to={`/course/${course._id}`}>{course.title}</Link></Table.Cell>
					<Table.Cell>
						<Header as="h4">
							<Header.Content><Header.Subheader>{courseDate}</Header.Subheader></Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell style={{ fontSize: '1rem', color: 'rgba(0,0,0,.6)' }}>
						<Rating disabled icon="star" rating={average} maxRating={5} /><br /> { numberOfVote }
					</Table.Cell>
					<Table.Cell><Button color="grey" content="Edit" icon="settings" size="tiny" as={Link} to={pathCourseToEdit} /></Table.Cell>
					<Table.Cell><Button inverted color="red" content="Delete" icon="remove" size="tiny" onClick={this.handleOpenModalForDeleteCourse({ courseId: course._id, courseTitle: course.title })} /></Table.Cell>
				</Table.Row>
			);
		});
	}

	renderPagination(coursesPagesCount, paginationEditor) {
		return (
			<Pagination
				activePage={paginationEditor.lastActivePage}
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
		);
	}

	render() {
		const { courses, coursesPagesCount, paginationEditor } = this.props;
		const { deleteCourse, lastColumnClicked, direction } = this.state;

		return (
			<div className={cx('courses-container')}>
				{ (courses.length <= 0) ?
					<div>
						<div className={cx('no-courses')}>You don't have some notes yet</div>
						<Button basic color="grey" content="Add new Note" icon="add" as={Link} to="/course/create/new" style={{ margin: '5px' }} />
						<Button basic color="grey" content="Add new Markdown Note (for developer)" icon="add" as={Link} to="/courseMd/create/new" style={{ margin: '5px' }} />
					</div>
					:
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
									<Popup trigger={<Button basic color="grey" icon="file" floated="right" content="New course" />} flowing hoverable>
										<Button basic color="grey" size="small" icon="file text" as={Link} to="/course/create/new" content="New Note" />
										<Button basic color="grey" size="small" icon="file" as={Link} to="/courseMd/create/new" content="New Markdown Note" />
									</Popup>

									{ coursesPagesCount > 1 && this.renderPagination(coursesPagesCount, paginationEditor) }
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				}


				<Modal open={deleteCourse.isModalOpened} onClose={this.handleOpenModalForDeleteCourse({})}>
					<Modal.Header>Delete a note</Modal.Header>
					<Modal.Content image>
						<Modal.Description>
							<Header>Are you sure to delete this note "{deleteCourse.courseTitle}"?</Header>
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
	fetchCoursesByFieldAction: PropTypes.func,
	deleteCourseAction: PropTypes.func,
	doSortCoursesAction: PropTypes.func,
	setPaginationCoursesEditorAction: PropTypes.func,
	coursesPagesCount: PropTypes.number,

	paginationEditor: PropTypes.shape({
		lastActivePage: PropTypes.number
	}),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,

		stars: PropTypes.shape({
			average: PropTypes.number,
			numberOfTimeVoted: PropTypes.number
		})
	})).isRequired
};

export default connect(null, { fetchCoursesByFieldAction, deleteCourseAction, doSortCoursesAction, setPaginationCoursesEditorAction })(CoursesListDashboard);
