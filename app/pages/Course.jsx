import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CourseSingle from '../components/CourseSingle/CourseSingle';

class Course extends Component {
	getMetaData() {
		return {
			title: 'Course',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	render() {
		const { course } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>

				<Segment vertical>
					<Container text>
						<CourseSingle course={course} />
					</Container>
				</Segment>

			</LayoutPage>
		);
	}
}

Course.propTypes = {
	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		category_info: (PropTypes.shape({
			description: PropTypes.string,
			key: PropTypes.string,
			name: PropTypes.string,
			picto: PropTypes.string
		})),
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one
	};
};

export default connect(mapStateToProps, null)(Course);
