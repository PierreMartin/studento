import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CoursesListDashboard from '../components/CoursesListDashboard/CoursesListDashboard';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container, Header } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from '../css/main.scss';

// const cx = classNames.bind(styles);

class Dashboard extends Component {
	getMetaData() {
		return {
			title: 'Dashboard',
			meta: [{ name: 'description', content: 'My dashboard' }],
			link: []
		};
	}

	render() {
		const { courses, userMe, coursesPagesCount, paginationEditor } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<Header as="h2" icon="pie graph" content="Stats" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<p>coming soon</p>
						<div>...</div>
					</Container>

					<Container text>
						<Header as="h2" icon="list" content="My courses" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<CoursesListDashboard
							courses={courses}
							userMe={userMe}
							coursesPagesCount={coursesPagesCount}
							paginationEditor={paginationEditor}
						/>
					</Container>

				</Segment>
			</LayoutPage>
		);
	}
}

Dashboard.propTypes = {
	coursesPagesCount: PropTypes.number,

	paginationEditor: PropTypes.shape({
		lastActivePage: PropTypes.number,
		lastCourseId: PropTypes.string
	}),

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
		paginationEditor: state.courses.paginationEditor,
		userMe: state.userMe.data
	};
};

export default connect(mapStateToProps, null)(Dashboard);
