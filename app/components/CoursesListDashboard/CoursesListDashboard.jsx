import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Table, Button, Header, Modal, Pagination, Popup, Rating, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction, deleteCourseAction, doSortCoursesAction } from '../../actions/courses';
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
			direction: null,
			activePage: 1
		};
	}

	componentDidMount() {
		const { userMe, fetchCoursesByFieldAction } = this.props;
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: 1, showPrivate: true });
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
		const { deleteCourseAction, courses, userMe, fetchCoursesByFieldAction } = this.props;
		const { deleteCourse, activePage } = this.state;

		if (deleteCourse && deleteCourse.courseId) {
			deleteCourseAction({...deleteCourse, userMeId: userMe._id}).then(() => {
				// Close modal :
				this.setState({ deleteCourse: { isModalOpened: false, courseId: '', courseTitle: '' } });

				// If no more course on (page > 1) : goto 1st page
				if ((courses.length === 1 || !courses) && activePage > 1) {
					fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: 1, showPrivate: true });
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

	handlePaginationChange = (e, { activePage: activePageClicked }) => {
		const { fetchCoursesByFieldAction, userMe } = this.props;
		const { activePage } = this.state;

		if (activePageClicked === activePage) return;

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage: activePageClicked, showPrivate: true });
		this.setState({ activePage: activePageClicked });
	};

	renderCoursesList(courses) {
		if (courses.length === 0) return;

		const { userMe } = this.props;

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L, h:mm:ss a');
			const pathCourseToEdit = course.type !== 'wy' ? `/courseMd/edit/${course._id}` : `/course/edit/${course._id}`;
			const stars = course.stars || {};
			const average = stars.average || 0;
			let numberOfVote = 'No vote';
			const me = userMe._id === course.uId._id ? ' (me)' : '';

			if (stars.numberOfTimeVoted === 1) {
				numberOfVote = stars.numberOfTimeVoted + ' note';
			} else if (stars.numberOfTimeVoted > 1) {
				numberOfVote = stars.numberOfTimeVoted + ' notes';
			}

			return (
				<Table.Row key={key}>
					<Table.Cell>
						<Link to={`/course/${course._id}`}>{course.title}</Link>
					</Table.Cell>

					<Table.Cell>
						<span className={cx('for-mobile')}>Author:</span>
						<Link to={`/user/${userMe._id}`}>{course.uId.username}</Link> {me}
					</Table.Cell>

					<Table.Cell>
						<Header as="h4">
							<Header.Content><Header.Subheader>
								<span className={cx('for-mobile')}>Created at:</span>
								{courseDate}
							</Header.Subheader></Header.Content>
						</Header>
					</Table.Cell>

					<Table.Cell className={cx('cell-stars')}>
						<Rating disabled icon="star" rating={average} maxRating={5} />
						<div>{ numberOfVote }</div>
					</Table.Cell>

					<Table.Cell className={cx('cell-edit')}>
						<Button basic color="grey" title="Edit" icon="pencil" size="tiny" as={Link} to={pathCourseToEdit} />
						<Button basic color="red" title="Delete" icon="remove" size="tiny" onClick={this.handleOpenModalForDeleteCourse({ courseId: course._id, courseTitle: course.title })} />
					</Table.Cell>
				</Table.Row>
			);
		});
	}

	renderPagination(coursesPagesCount, activePage) {
		return (
			<Pagination
				activePage={activePage}
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
		const { courses, coursesPagesCount } = this.props;
		const { deleteCourse, lastColumnClicked, direction, activePage } = this.state;

		return (
			<div className={cx('courses-container')}>
				{ (courses.length <= 0) ?
					<div>
						<div className={cx('no-courses')}>You don't have some notes yet</div>
						<Button basic color="grey" content="Add new Note" icon="add" as={Link} to="/course/create/new" style={{ margin: '5px' }} />
						<Button basic color="grey" content="Add new Markdown Note (for developer)" icon="add" as={Link} to="/courseMd/create/new" style={{ margin: '5px' }} />
					</div>
					:
					<Table celled compact="very" sortable fixed>
						<Table.Header className={cx('thead')}>
							<Table.Row>
								<Table.HeaderCell sorted={lastColumnClicked === 'title' ? direction : null} onClick={this.handleSort('title')}>Title</Table.HeaderCell>
								<Table.HeaderCell>Author</Table.HeaderCell>
								<Table.HeaderCell sorted={lastColumnClicked === 'created_at' ? direction : null} onClick={this.handleSort('created_at')}>Date</Table.HeaderCell>
								<Table.HeaderCell>Stars</Table.HeaderCell>
								<Table.HeaderCell>Edit / Delete</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body className={cx('tbody')}>
							{ this.renderCoursesList(courses) }
						</Table.Body>

						<Table.Footer fullWidth>
							<Table.Row>
								<Table.HeaderCell colSpan="5">
									<Popup trigger={<Button basic inverted icon="file" floated="right" content="New course" className={cx('button', 'new-note')} />} flowing hoverable inverted>
										<Button basic inverted size="small" icon="file text" as={Link} to="/course/create/new" content="New Note" />
										<Button basic inverted size="small" icon="file" as={Link} to="/courseMd/create/new" content="New Markdown Note" />
									</Popup>

									{ coursesPagesCount > 1 && this.renderPagination(coursesPagesCount, activePage) }
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				}


				<Modal open={deleteCourse.isModalOpened} onClose={this.handleOpenModalForDeleteCourse({})}>
					<Modal.Header>Delete a note</Modal.Header>
					<Modal.Content image>
						<Modal.Description>
							<Header>Are you sure to delete the note "{deleteCourse.courseTitle}"?</Header>
							<Message icon color="red" size="mini">
								<Icon name="attention" size="small" />
								<Message.Content>This action will permanently delete your note.</Message.Content>
							</Message>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color="black" onClick={this.handleOpenModalForDeleteCourse({})}>Cancel</Button>
						<Button icon="checkmark" color="red" labelPosition="right" content="Delete the note" onClick={this.handleSubmitDeleteCourse} />
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
	coursesPagesCount: PropTypes.number,

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

export default connect(null, { fetchCoursesByFieldAction, deleteCourseAction, doSortCoursesAction })(CoursesListDashboard);
