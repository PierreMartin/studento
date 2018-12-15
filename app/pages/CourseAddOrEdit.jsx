import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import { kaTexRendering } from '../components/common/renderingCourse';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import EditorPanelExplorer from '../components/EditorPanelExplorer/EditorPanelExplorer';
import { TINY_MCE_KEY } from '../../config/env';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesAddOrEditCourse from './css/courseAddOrEdit.scss';
import stylesCourse from './css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class CourseAddOrEdit extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleSelectCourse = this.handleSelectCourse.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);

		this.state = {
			fieldsTyping: {
				template: {}
			},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			heightDocument: window.innerHeight,
			pagination: {
				indexPage: 1
			},
			clickedCourse: 0,
			isEditorChanged: false
		};
	}

	componentDidMount() {
		const { fetchCategoriesAction, fetchCoursesByFieldAction, userMe } = this.props;

		// Resize element child to 100% height:
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		fetchCategoriesAction();
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });

		// Highlight and Katex rendering init:
		require('katex/dist/katex.css');
		// this.templateRendering();
		this.setContentSanitized({ callFrom: 'mount' });
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		if (prevProps.course !== this.props.course) {
			// Init for generate headings wrap:
			// this.indexHeader = 0;
			// this.headersList = [];

			this.setContentSanitized({ callFrom: 'update' });

			const { addOrEditMissingField, addOrEditFailure, emptyErrorsAction } = this.props;

			// Empty the errors when change course or create a new:
			if ((Object.keys(addOrEditMissingField).length > 0) || addOrEditFailure.length > 0) emptyErrorsAction();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getMetaData() {
		return {
			title: 'Add course',
			meta: [{ name: 'description', content: 'Add course...' }],
			link: []
		};
	}

	getFieldsVal(fieldsTyping, course) {
		const fields = {};
		fields.title = ((typeof fieldsTyping.title !== 'undefined') ? fieldsTyping.title : course && course.title) || '';
		fields.category = ((typeof fieldsTyping.category !== 'undefined') ? fieldsTyping.category : course && course.category) || '';
		fields.subCategories = ((typeof fieldsTyping.subCategories !== 'undefined') ? fieldsTyping.subCategories : course && course.subCategories) || [];
		fields.isPrivate = ((typeof fieldsTyping.isPrivate !== 'undefined') ? fieldsTyping.isPrivate : course && course.isPrivate) || false;
		fields.content = ((typeof fieldsTyping.content !== 'undefined') ? fieldsTyping.content : course && course.content) || '';
		fields.description = ((typeof fieldsTyping.description !== 'undefined') ? fieldsTyping.description : course && course.description) || '';
		fields.template = (fieldsTyping.template && Object.keys(fieldsTyping.template).length > 0 ? {...course.template, ...fieldsTyping.template} : course && course.template) || {};

		return fields;
	}

	setContentSanitized(params = {}) {
		const content = ((typeof params.contentCourse !== 'undefined') ? params.contentCourse : this.props.course && this.props.course.content) || 'You\'re course here...';
		const contentSanitized = DOMPurify.sanitize(content);
		const oldStateTyping = this.state.fieldsTyping;

		// From componentDidMount:
		if (params.callFrom === 'mount') {
			return this.setState({
				fieldsTyping: { content: contentSanitized }
			}, () => {
				kaTexRendering(katex, contentSanitized);
			});
		}

		// From componentDidUpdate:
		if (params.callFrom === 'update') {
			return this.setState({
				isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
				fieldsTyping: {
					content: contentSanitized,
					template: {}
				},
				isEditorChanged: false
			}, () => {
				kaTexRendering(katex, contentSanitized);
			});
		}

		// From typing:
		this.setState({
			fieldsTyping: {...oldStateTyping, content: contentSanitized },
			isEditorChanged: true
		}, () => {
			kaTexRendering(katex, contentSanitized);
		});
	}

	templateRendering() {
		this.rendererMarked.heading = (text, currenLevel) => {
			const template = (this.state.fieldsTyping.template && Object.keys(this.state.fieldsTyping.template).length > 0 ? {...this.props.course.template, ...this.state.fieldsTyping.template} : this.props.course && this.props.course.template) || {};
			const numberColumns = typeof template['columnH' + currenLevel] !== 'undefined' ? template['columnH' + currenLevel] : 1;
			let closeDivNode = '';

			// 1st header:
			if (this.indexHeader === 0) {
				this.headersList.push({ levelHeader: currenLevel });
				this.indexHeader++;

				return `
					${closeDivNode}
					<div class="md-column-${numberColumns}">
						<h${currenLevel}>${text}</h${currenLevel}>
				`;
			}

			const lastLevelHeader = this.headersList[this.headersList.length - 1].levelHeader;
			const diffLevelWithLastHeader = Math.abs(lastLevelHeader - currenLevel);

			for (let i = this.headersList.length - 1; i >= 0; i--) {
				const alreadyHaveLevelHeader = this.headersList[i].levelHeader === currenLevel;

				// Close when same header in same level imbrication:
				if (alreadyHaveLevelHeader && diffLevelWithLastHeader === 0) {
					closeDivNode = '</div>';
				}

				// Close when different header:
				if (lastLevelHeader > currenLevel && currenLevel === this.headersList[i].levelHeader) {
					for (let j = 0; j < diffLevelWithLastHeader; j++) closeDivNode += '</div>';
					break;
				} else if (lastLevelHeader > currenLevel) {
					closeDivNode = '</div>';
				}
			}

			this.headersList.push({ levelHeader: currenLevel });
			this.indexHeader++;

			return `
				${closeDivNode}
				<div class="md-column-${numberColumns}">
					<h${currenLevel}>${text}</h${currenLevel}>
			`;
		};
	}

	handleSelectCourse = clickedCourse => () => {
		this.setState({ clickedCourse });
	};

	handlePaginationChange = (e, { activePage }) => {
		this.setState({ pagination: { indexPage: activePage } });
		const lastActivePage = this.state.pagination.indexPage;
		if (activePage === lastActivePage) return;

		const { userMe, fetchCoursesByFieldAction, courses } = this.props;
		const directionIndex = activePage - lastActivePage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, currentCourseId, directionIndex });
	};

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;

		// Set categories:
		if (field.name === 'category') {
			return this.setState({
				fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.value }, subCategories: [] },
				category: { lastSelected: field.value}
			});
		}

		// Set columns:
		if (/^column/g.test(field.name)) {
			return this.setState({
				fieldsTyping: {...oldStateTyping, template: {...oldStateTyping.template, ...{[field.name]: field.value}} }
			}, () => {
				const contentCourse = ((typeof this.state.fieldsTyping.content !== 'undefined') ? this.state.fieldsTyping.content : this.props.course && this.props.course.content) || '';
				return this.setContentSanitized({ contentCourse });
			});
		}

		// Set all forms fields except content:
		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}});
	}

	handleEditorChange = (e) => {
		this.setContentSanitized({ contentCourse: e.target.getContent() });
	};

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, courses, userMe, createCourseAction, updateCourseAction, coursesPagesCount, fetchCoursesByFieldAction } = this.props;
		const { pagination, fieldsTyping, isEditing } = this.state;
		const indexPagination = pagination.indexPage || 0;
		const template = (fieldsTyping.template && Object.keys(fieldsTyping.template).length > 0 ? {...course.template, ...fieldsTyping.template} : course && course.template) || {};
		const data = {};

		if (isEditing) {
			data.fields = {...fieldsTyping, template: { ...template } };
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data).then(() => {
				this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
			});
		} else {
			data.fields = fieldsTyping;
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			data.fields.type = 'wy';
			createCourseAction(data, coursesPagesCount, indexPagination).then(() => {
				this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
				if (courses.length % 12 === 0) { // 12 => numberItemPerPage setted in controller
					this.setState({ pagination: { indexPage: 1 } });
					fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });
				}
			});
		}
	}

	updateWindowDimensions() {
		this.setState({ heightDocument: window.innerHeight });
	}

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure, categories } = this.props;
		const { category, isEditing, fieldsTyping, pagination, heightDocument, isEditorChanged } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container')}>
					<EditorPanelExplorer
						course={course}
						courses={courses}
						isEditing={isEditing}
						fieldsTyping={fieldsTyping}
						fields={fields}
						addOrEditMissingField={addOrEditMissingField}
						addOrEditFailure={addOrEditFailure}
						coursesPagesCount={coursesPagesCount}
						pagination={pagination}
						category={category}
						categories={categories}
						handleInputChange={this.handleInputChange}
						handleOnSubmit={this.handleOnSubmit}
						handlePaginationChange={this.handlePaginationChange}
						handleSelectCourse={this.handleSelectCourse}
						isEditorChanged={isEditorChanged}
						fromPage="wy"
					/>

					<div className={cx('editor-container-full')}>
						<Editor
							apiKey={TINY_MCE_KEY}
							initialValue={fields.content}
							init={{
								min_height: heightDocument,
								external_plugins: { tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js' },
								plugins: 'link image table codesample tiny_mce_wiris',
								toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | codesample | table | blocks | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry'
							}}
							onChange={this.handleEditorChange}
						/>

						<div dangerouslySetInnerHTML={{ __html: fields.content }} />
					</div>
				</div>
			</LayoutPage>
		);
	}
}

CourseAddOrEdit.propTypes = {
	fetchCategoriesAction: PropTypes.func,
	createCourseAction: PropTypes.func,
	updateCourseAction: PropTypes.func,
	fetchCoursesByFieldAction: PropTypes.func,
	emptyErrorsAction: PropTypes.func,
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
		addOrEditFailure: state.courses.addOrEditFailure
	};
};

export default connect(mapStateToProps, { fetchCategoriesAction, createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction })(CourseAddOrEdit);
