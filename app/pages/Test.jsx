import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCourseByFieldAction, fetchCoursesByFieldAction } from '../actions/courses';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesNotePage from './css/notePage.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage});

class Test extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fieldsTyping: {
				content: ''
			}
		};
	}

	componentDidMount() {
		const { userMe } = this.props;

		this.props.fetchCourseByFieldAction({ keyReq: '_id', valueReq: '5d383fba44cc1a0e648fd313', action: 'edit' });
		this.props.fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, showPrivate: true });
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		if (prevProps.params.id !== this.props.params.id) {
			console.log('page changed!');

			this.props.fetchCourseByFieldAction({ keyReq: '_id', valueReq: '5d383fba44cc1a0e648fd313', action: 'edit' });
		}
	}

	render() {
		const { course, courses } = this.props;

		const numberCoursesMd = courses && courses.filter(course => course.type === 'md').length;
		const defaultMessageEditorMd = (numberCoursesMd === 0) ? 'defaultMessageEditorMd' : '';
		const content = (course && course.content) || defaultMessageEditorMd;

		return (
			<div className={cx('course-add-or-edit-container-dark')}>
				{content}
			</div>
		);
	}
}

Test.propTypes = {
	fetchCoursesByFieldAction: PropTypes.func,
	fetchCourseByFieldAction: PropTypes.func,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		type: PropTypes.string
	})),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one,
		courses: state.courses.all,
		userMe: state.userMe.data
	};
};

export default connect(mapStateToProps, { fetchCourseByFieldAction, fetchCoursesByFieldAction })(Test);
