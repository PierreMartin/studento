import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CoursesListDashboard from '../components/CoursesListDashboard/CoursesListDashboard';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container } from 'semantic-ui-react';
// import classNames from 'classnames/bind';
// import styles from '../css/main.scss';

// const cx = classNames.bind(styles);

class Dashboard extends Component {
	getMetaData() {
		return {
			title: 'My Notes',
			meta: [{ name: 'description', content: 'My Notes' }],
			link: []
		};
	}

	render() {
		const { courses, userMe, coursesPagesCount } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						{/* <Header as="h2" icon="list" content="My Notes" style={{ fontSize: '1.7em', fontWeight: 'normal' }} /> */}
						<CoursesListDashboard
							courses={courses}
							userMe={userMe}
							coursesPagesCount={coursesPagesCount}
						/>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Dashboard.propTypes = {
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

export default connect(mapStateToProps, null)(Dashboard);
