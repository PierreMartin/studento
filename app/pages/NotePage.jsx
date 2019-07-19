import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction } from '../actions/courses';
import ButtonOpenMenuPanel from '../components/ButtonOpenMenuPanel/ButtonOpenMenuPanel';
import EditorPanelExplorer from '../components/EditorPanelExplorer/EditorPanelExplorer';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import ContainerMd from '../components/NotePageMd/ContainerMd';
import ContainerTiny from '../components/NotePageTiny/ContainerTiny';
import { Button } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesAddOrEditCourse from './css/courseAddOrEdit.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse});

class NotePage extends Component {
	constructor(props) {
		super(props);
		this.handleClickToolbarMain = this.handleClickToolbarMain.bind(this);
		this.handleClickToolbarMarkDown = this.handleClickToolbarMarkDown.bind(this);
		this.handleOpenMenuPanel = this.handleOpenMenuPanel.bind(this);
		this.setRefPreview = this.setRefPreview.bind(this);

		this.rendererMarked = null;

		// Init for generate headings wrap:
		this.indexHeader = 0;
		this.headersList = [];

		this.state = {
			contentMarkedSanitized: '',
			fieldsTyping: {
				template: {}
			},
			fieldsModalSetStyleTyping: {},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			heightEditor: 0,
			openModalSetStyle: {},
			codeLanguageSelected: '',
			isEditorChanged: false,
			isPreviewModeActive: true, // remove
			isMobile: false,
			isMenuPanelOpen: true,
			isEditMode: false
		};
	}

	componentDidMount() {
		// Resize element child to 100% height:
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		if (prevProps.course !== this.props.course) {
			//
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getMetaData() {
		return {
			title: 'Add a Note',
			meta: [{ name: 'description', content: 'Add a Markdown Note...' }],
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

	handleOpenMenuPanel() {
		this.setState({ isMenuPanelOpen: !this.state.isMenuPanelOpen });
	}

	/**
	 * Only for main toolbar
	 * @param clickedButton
	 * @returns {void}
	 */
	handleClickToolbarMain = clickedButton => () => {
		switch (clickedButton) {
			case 'toggle preview':
				this.setState({ isEditMode: !this.state.isEditMode });
				break;
			default:
				break;
		}
	};

	handleClickToolbarMarkDown = clickedButton => () => {
		this.editorCm.focus();

		switch (clickedButton) {
			case 'bold':
				this.setStyleSelectable({ type: 'bold', char: '*', numberChars: 2 });
				break;
			case 'italic':
				this.setStyleSelectable({ type: 'italic', char: '*', numberChars: 1 });
				break;
			case 'header':
				this.setStyleOnLine({ type: 'header', char: '# ' });
				break;
			case 'strikethrough':
				this.setStyleSelectable({ type: 'strikethrough', char: '~', numberChars: 2 });
				break;
			case 'quote left':
				this.setStyleOnLine({ type: 'quote left', char: '> ' });
				break;
			case 'unordered list':
				this.setStyleOnLine({ type: 'unordered list', char: '- ' });
				break;
			case 'ordered list':
				this.setStyleOnLine({ type: 'ordered list', char: '1. ' });
				break;
			case 'check square':
				this.setStyleOnLine({ type: 'check square', char: '- [x] ' });
				break;
			case 'code':
				this.handleOpenModalSetStyle({ isOpened: true, type: 'code', title: 'Editor', desc: 'Write some code in the editor' });
				break;
			case 'table':
				this.handleOpenModalSetStyle({ isOpened: true, type: 'table', title: 'Table', desc: 'Create a table' });
				break;
			case 'linkify':
				this.handleOpenModalSetStyle({ isOpened: true, type: 'linkify', title: 'Link', desc: 'Add a link' });
				break;
			case 'file image outline':
				this.handleOpenModalSetStyle({ isOpened: true, type: 'file image outline', title: 'Image', desc: 'Add a image' });
				break;
			case 'auto scoll':
				// this.setState({ isButtonAutoScrollActive: !this.state.isButtonAutoScrollActive });
				// this.refContentPreview.scrollTo(0, this.editorCm.getScrollInfo().top);

				/* TODO FAIRE ca, mais bug quand scroll trop vite
				const scrollTopTarget = SectionsGeneratorForScrolling.getScrollPosition(this.editorCm.getScrollerElement().scrollTop, this.sections.editor, this.sections.preview);
				this.refContentPreview.scrollTop = scrollTopTarget;
				*/
				break;
			default:
				break;
		}
	};

	setRefPreview(refPreview) {
		this.refPreview = refPreview;
	}

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure, categories, userMe, paginationEditor } = this.props;
		const { category, isEditing, fieldsTyping, heightEditor, isEditorChanged, isPreviewModeActive, isMobile, isMenuPanelOpen, isEditMode } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);

		// Styles css:
		const stylesEditor = {};
		const stylesPreview = { height: heightEditor + 'px' };

		if (!isEditMode) {
			stylesEditor.display = 'none';
			stylesPreview.display = 'block';
		}

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container-dark')}>
					<ButtonOpenMenuPanel handleOpenMenuPanel={this.handleOpenMenuPanel} isMenuPanelOpen={isMenuPanelOpen} />

					<EditorToolbar
						course={course}
						categories={categories}
						category={category}
						isEditing={isEditing}
						fields={fields}
						fieldsTyping={fieldsTyping}
						addOrEditMissingField={addOrEditMissingField}
						addOrEditFailure={addOrEditFailure}
						isPreviewModeActive={isPreviewModeActive}
						handleClickToolbarMain={this.handleClickToolbarMain}
						handleInputChange={this.handleInputChange}
						handleOnSubmit={this.handleOnSubmit}
						isEditorChanged={isEditorChanged}
						fromPage="md"
					/>

					<EditorPanelExplorer
						ref={(el) => { this.editorPanelExplorer = el; }}
						isOpen={isMenuPanelOpen}
						userMe={userMe}
						course={course}
						courses={courses}
						isEditing={isEditing}
						fieldsTyping={fieldsTyping}
						fields={fields}
						addOrEditMissingField={addOrEditMissingField}
						addOrEditFailure={addOrEditFailure}
						coursesPagesCount={coursesPagesCount}
						paginationEditor={paginationEditor}
						category={category}
						categories={categories}
						handleInputChange={this.handleInputChange}
						handleOnSubmit={this.handleOnSubmit}
						isEditorChanged={isEditorChanged}
						fromPage="md"
					/>

					<div className={cx('editor-container-full', isMenuPanelOpen ? 'menu-open' : '')}>
						{ this.props.route.path === '/courseMd/:action/:id' && (
							<ContainerMd
								isCanEdit={true}
								isEditMode={isEditMode}
								handleClickToolbarMarkDown={this.handleClickToolbarMarkDown}
								setRefPreview={this.setRefPreview}
								{...this.props}
								{...this.state}
							/>
						)}

						{ this.props.route.path === '/course/:action/:id' && (
							<ContainerTiny
								isCanEdit={true}
								isEditMode={isEditMode}
								handleClickToolbarMarkDown={this.handleClickToolbarMarkDown}
								{...this.props}
								{...this.state}
							/>
						)}
					</div>
				</div>
			</LayoutPage>
		);
	}
}

NotePage.propTypes = {
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

export default connect(mapStateToProps, { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction })(NotePage);
