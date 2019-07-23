import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction } from '../../actions/courses';
import { Form } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesAddOrEditCourse from '../../pages/css/courseAddOrEdit.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class EditorMd extends Component {
	render() {
		const { addOrEditMissingField, refEditorMd, handleScroll } = this.props;

		return (
			<div className={cx('editor-edition')} onScroll={handleScroll('editor')}>
				<Form error={addOrEditMissingField.content} size="small">
					<textarea ref={refEditorMd} name="editorCm" id="editorMd" />
				</Form>
			</div>
		);
	}
}

EditorMd.propTypes = {
	createCourseAction: PropTypes.func,
	updateCourseAction: PropTypes.func,
	fetchCoursesByFieldAction: PropTypes.func,
	emptyErrorsAction: PropTypes.func,
	setPaginationCoursesEditorAction: PropTypes.func,
	addOrEditMissingField: PropTypes.object,
	addOrEditFailure: PropTypes.string,

	coursesPagesCount: PropTypes.number,

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
	}),

	paginationEditor: PropTypes.shape({
		lastActivePage: PropTypes.number
	}),

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	}))
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one,
		courses: state.courses.all,
		coursesPagesCount: state.courses.pagesCount,
		userMe: state.userMe.data,
		categories: state.categories.all,
		addOrEditMissingField: state.courses.addOrEditMissingField,
		addOrEditFailure: state.courses.addOrEditFailure,
		paginationEditor: state.courses.paginationEditor
	};
};

export default connect(mapStateToProps, { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction })(EditorMd);
