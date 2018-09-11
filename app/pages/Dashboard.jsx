import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction } from '../actions/courses';
import CoursesListDashboard from '../components/CoursesListDashboard/CoursesListDashboard';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container, Header } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from '../css/main.scss';

// const cx = classNames.bind(styles);

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.paginationChange = this.paginationChange.bind(this);
	}

	componentDidMount() {
		const { userMe, fetchCoursesByFieldAction } = this.props;
		const directionIndex = 0;

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, undefined, directionIndex }); // 'uId' => name of field in Model to find
	}

	getMetaData() {
		return {
			title: 'Dashboard',
			meta: [{ name: 'description', content: 'My dashboard' }],
			link: []
		};
	}

	paginationChange(activePage, lastActivePage) {
		const { userMe, fetchCoursesByFieldAction, courses } = this.props;
		const directionIndex = activePage - lastActivePage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, currentCourseId, directionIndex }); // 'uId' => name of field in Model to find
	}

	render() {
		const { courses, coursesPagesCount } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<Header as="h2" icon="pie graph" content="Stats (coming soon)" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<div>...</div>
					</Container>

					<Container text>
						<Header as="h2" icon="list" content="My courses" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<CoursesListDashboard courses={courses} coursesPagesCount={coursesPagesCount} paginationChange={this.paginationChange} />
					</Container>

				</Segment>
			</LayoutPage>
		);
	}
}

Dashboard.propTypes = {
	fetchCoursesByFieldAction: PropTypes.func,
	coursesPagesCount: PropTypes.number,

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
		coursesPagesCount: state.courses.pagesCount,
		userMe: state.userMe.data
	};
};

export default connect(mapStateToProps, { fetchCoursesByFieldAction })(Dashboard);
