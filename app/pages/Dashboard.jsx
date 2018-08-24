import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByIdAction } from '../actions/courses';
import CoursesListDashboard from '../components/CoursesListDashboard/CoursesListDashboard';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container, Header } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../css/main.scss';

const cx = classNames.bind(styles);

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	getMetaData() {
		return {
			title: 'Dashboard',
			meta: [{ name: 'description', content: 'My dashboard' }],
			link: []
		};
	}

	componentDidMount() {
		const { userMe, fetchCoursesByIdAction } = this.props;
		fetchCoursesByIdAction(userMe._id);
	}

	render() {
		const { courses } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<Header as="h2" icon="pie graph" content="Stats (coming soon)" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<div>...</div>
					</Container>

					<Container text>
						<Header as="h2" icon="list" content="My courses" style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<CoursesListDashboard courses={courses} />
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Dashboard.propTypes = {
	fetchCoursesByIdAction: PropTypes.func,

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

export default connect(mapStateToProps, { fetchCoursesByIdAction })(Dashboard);
