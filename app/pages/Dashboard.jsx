import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByIdAction, deleteCourseAction } from '../actions/courses';
import CoursesListDashboard from '../components/CoursesListDashboard/CoursesListDashboard';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container, Header, Modal, Button } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from '../css/main.scss';

// const cx = classNames.bind(styles);

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.handleOpenModalForDeleteCourse = this.handleOpenModalForDeleteCourse.bind(this);
		this.handleSubmitDeleteCourse = this.handleSubmitDeleteCourse.bind(this);

		this.state = {
			deleteCourse: {
				isModalOpened: false,
				courseId: '',
				courseTitle: ''
			}
		};
	}

	componentDidMount() {
		const { userMe, fetchCoursesByIdAction } = this.props;
		fetchCoursesByIdAction(userMe._id);
	}

	getMetaData() {
		return {
			title: 'Dashboard',
			meta: [{ name: 'description', content: 'My dashboard' }],
			link: []
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

	render() {
		const { courses } = this.props;
		const { deleteCourse } = this.state;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<Header as="h2" icon="pie graph" content="Stats (coming soon)" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<div>...</div>
					</Container>

					<Container text>
						<Header as="h2" icon="list" content="My courses" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<CoursesListDashboard courses={courses} handleOpenModalForDeleteCourse={this.handleOpenModalForDeleteCourse} />
					</Container>

					<Modal open={deleteCourse.isModalOpened} onClose={this.handleOpenModalForDeleteCourse({})}>
						<Modal.Header>Delete a course</Modal.Header>
						<Modal.Content image>
							<Modal.Description>
								<Header>Are you sure to delete the course "{deleteCourse.courseTitle}" ?</Header>
								<p>ATTENTION this action is irreversible !</p>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button color="black" onClick={this.handleOpenModalForDeleteCourse({})}>Cancel</Button>
							<Button icon="checkmark" color="red" labelPosition="right" content="Ok" onClick={this.handleSubmitDeleteCourse} />
						</Modal.Actions>
					</Modal>

				</Segment>
			</LayoutPage>
		);
	}
}

Dashboard.propTypes = {
	fetchCoursesByIdAction: PropTypes.func,
	deleteCourseAction: PropTypes.func,

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		courses: state.courses.all,
		userMe: state.userMe.data
	};
};

export default connect(mapStateToProps, { fetchCoursesByIdAction, deleteCourseAction })(Dashboard);
