import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
// import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { Link } from 'react-router';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { List, Form, Message, Button, Popup, Pagination, Icon } from 'semantic-ui-react';
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
		this.handleClickToolbar = this.handleClickToolbar.bind(this);

		this.editorCm = null;
		this.timerHighlightPreview = null;
		this.timerRenderPreview = null;

		this.state = {
			fieldsTyping: {},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			heightDocument: 0,
			pagination: {
				indexPage: 1
			},
			clickedCourse: 0
		};
	}

	componentDidMount() {
		const { fetchCategoriesAction, fetchCoursesByFieldAction, userMe } = this.props;

		// Resize element child to 100% height:
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		fetchCategoriesAction();
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });

		// Load highlight.js Languages:
		hljsLoadLanguages(hljs);

		// ##################################### Marked #####################################
		marked.setOptions({
			renderer: new marked.Renderer(),
			pedantic: false,
			gfm: true,
			tables: true,
			breaks: true,
			sanitize: true,
			smartLists: true,
			smartypants: false,
			xhtml: false
		});

		setTimeout(() => hljs.initHighlighting(), 1000);

		// ##################################### CodeMirror #####################################
		const CodeMirror = require('codemirror/lib/codemirror');
		require('codemirror/lib/codemirror.css');

		// Addon JS:
		require('codemirror/addon/dialog/dialog.js');
		require('codemirror/addon/search/matchesonscrollbar.js');
		require('codemirror/addon/fold/foldgutter.js');
		require('codemirror/addon/fold/foldcode.js');
		require('codemirror/addon/fold/brace-fold.js');
		require('codemirror/addon/fold/comment-fold.js');
		require('codemirror/addon/fold/indent-fold.js');
		require('codemirror/addon/fold/markdown-fold.js');
		require('codemirror/addon/fold/xml-fold.js');
		require('codemirror/addon/edit/closebrackets.js');

		// Addon CSS:
		require('codemirror/addon/dialog/dialog.css');
		require('codemirror/addon/search/matchesonscrollbar.css');
		require('codemirror/addon/fold/foldgutter.css');

		// Theme CSS:
		require('codemirror/theme/pastel-on-dark.css');

		// keyMap:
		require('codemirror/keymap/sublime.js');

		// modes:
		require('codemirror/mode/markdown/markdown');
		require('codemirror/mode/javascript/javascript');
		require('codemirror/mode/php/php');
		require('codemirror/mode/gfm/gfm');
		require('codemirror/mode/python/python');
		require('codemirror/mode/ruby/ruby');
		require('codemirror/mode/sass/sass');
		require('codemirror/mode/shell/shell');
		require('codemirror/mode/sql/sql');
		require('codemirror/mode/stylus/stylus');
		require('codemirror/mode/xml/xml');
		require('codemirror/mode/coffeescript/coffeescript');
		require('codemirror/mode/css/css');
		require('codemirror/mode/cmake/cmake');
		require('codemirror/mode/htmlmixed/htmlmixed');
		require('codemirror/mode/mathematica/mathematica');

		this.editorCm = CodeMirror.fromTextArea(this.refEditor, {
			// value: fields.content, // already set by the textarea
			lineNumbers: true,
			codeFold: true,
			placeholder: 'Write you course here...',
			dragDrop: false,
			autofocus: true,
			readOnly: false,
			matchTags: false,
			tabSize: 4,
			indentUnit: 4,
			lineWrapping: true,
			viewportMargin: Infinity,
			extraKeys: {
				'Ctrl-Space': 'autocomplete',
				'Ctrl-Q': cm => cm.foldCode(cm.getCursor())
			},
			keyMap: 'sublime',

			foldGutter: true,
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			matchBrackets: true,
			indentWithTabs: true,
			styleActiveLine: true,
			styleSelectedText: true,
			autoCloseBrackets: true,
			autoCloseTags: true,
			showTrailingSpace: true,
			// highlightSelectionMatches : ( (!settings.matchWordHighlight) ? false : { showToken: (settings.matchWordHighlight === "onselected") ? false : /\w/ } )

			theme: 'pastel-on-dark',
			mode: 'gfm'
		});

		// handleEditorChange:
		this.editorCm.on('change', () => {
			const oldStateTyping = this.state.fieldsTyping;
			const valueEditor = this.editorCm.getValue();
			const isBigFile = valueEditor.length >= 3000;

			// Re highlight code:
			clearTimeout(this.timerHighlightPreview);
			this.timerHighlightPreview = setTimeout(() => {
				const code = this.refPreview.querySelectorAll('pre code');
				for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);
			}, 1000);

			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				if (isBigFile) this.setState({ fieldsTyping: {...oldStateTyping, ...{ content: valueEditor }} });
			}, 200);

			if (!isBigFile) this.setState({ fieldsTyping: {...oldStateTyping, ...{ content: valueEditor }} });
		});

		this.editorCm.setSize('auto', window.innerHeight - 44);
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		if (prevProps.course !== this.props.course) {
			const fields = this.getFieldsVal({}, this.props.course);

			this.editorCm.setValue(fields.content);

			this.setState({
				isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
				fieldsTyping: {}
			});

			const { addOrEditMissingField, addOrEditFailure, emptyErrorsAction } = this.props;

			// Empty the errors when change course or create a new:
			if ((Object.keys(addOrEditMissingField).length > 0) || addOrEditFailure.length > 0) emptyErrorsAction();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getOptionsFormsSelect() {
		const { categories, course } = this.props;
		const { category, isEditing } = this.state;
		let lastCategorySelected = category.lastSelected;

		// If update and no yet select some Inputs:
		if (isEditing && category.lastSelected === null) {
			lastCategorySelected = course.category;
		}

		// CATEGORIES - Convert to Input formate:
		const arrCatList = [];
		if (categories.length > 0) {
			for (let i = 0; i < categories.length; i++) {
				arrCatList.push({
					key: categories[i].key,
					text: categories[i].name,
					value: categories[i].key
				});
			}
		}

		// SUB CATEGORIES - 1) Get the category selected by the 1st Input:
		let categorySelected = {};
		if (categories.length > 0 && lastCategorySelected) {
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].key === lastCategorySelected) {
					categorySelected = categories[i];
					break;
				}
			}
		}

		// SUB CATEGORIES - 2) Convert to Input formate:
		const arrSubCatList = [];
		if (categorySelected.subCategories && categorySelected.subCategories.length > 0) {
			for (let i = 0; i < categorySelected.subCategories.length; i++) {
				arrSubCatList.push({
					key: categorySelected.subCategories[i].key,
					text: categorySelected.subCategories[i].name,
					value: categorySelected.subCategories[i].key
				});
			}
		}

		return { categoriesOptions: arrCatList, subCategoriesOptions: arrSubCatList };
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

		return fields;
	}

	updateWindowDimensions() {
		this.setState({ heightDocument: window.innerHeight });
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, courses, userMe, createCourseAction, updateCourseAction, coursesPagesCount, fetchCoursesByFieldAction } = this.props;
		const { pagination } = this.state;
		const indexPagination = pagination.indexPage || 0;
		const data = {};

		if (this.state.isEditing) {
			data.fields = this.state.fieldsTyping;
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data).then(() => {
				this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
			});
		} else {
			data.fields = this.getFieldsVal(this.state.fieldsTyping, course);
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			createCourseAction(data, coursesPagesCount, indexPagination).then(() => {
				this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
				if (courses.length % 12 === 0) { // 12 => numberItemPerPage setted in controller
					this.setState({ pagination: { indexPage: 1 } });
					fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });
				}
			});
		}
	}

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;

		if (field.name === 'category') {
			return this.setState({
				fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.value }, subCategories: [] },
				category: { lastSelected: field.value}
			});
		}

		/*
		if (field.name === 'content') {
			return this.setState({ fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}} });
		}
		*/

		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}});
	}

	handlePaginationChange = (e, { activePage }) => {
		this.setState({ pagination: { indexPage: activePage } });
		const lastActivePage = this.state.pagination.indexPage;
		if (activePage === lastActivePage) return;

		const { userMe, fetchCoursesByFieldAction, courses } = this.props;
		const directionIndex = activePage - lastActivePage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, currentCourseId, directionIndex });
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingField - object with true as key if a field is missing
	 * @param {string} messageErrorBe - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingField, messageErrorBe) {
		const errorsField = [];
		if (missingField.title) errorsField.push({message: 'the title is required ', key: 'title'});
		if (missingField.category) errorsField.push({message: 'the category is required ', key: 'category'});

		// Pas obligé d'afficher les erreurs back-end dans le form, on devrait plutôt les aficher dans une notification
		if (messageErrorBe && messageErrorBe.length > 0) errorsField.push({message: messageErrorBe, key: 'backendError'});

		const messagesListNode = errorsField.map((errorField, key) => {
			return (
				<li key={key}>{errorField.message}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	handleClickToolbar = clickedButton => () => {
		// inputBox.focus(); // Focus on codeMirror

		const selection = this.editorCm.getSelection();
		const start = this.editorCm.doc.sel.ranges[0].anchor;
		const end = this.editorCm.doc.sel.ranges[0].head;

		switch (clickedButton) {
			case 'bold':
				const chunk = {};
				chunk.before = this.editorCm.getRange({ line: 0, ch: 0 }, start);
				chunk.after = this.editorCm.getRange(end, { line: this.editorCm.lineCount() + 1, ch: 0 });

				const starsBefore = /(\**$)/.exec(chunk.before)[0];
				const starsAfter = /(^\**)/.exec(chunk.after)[0];

				// If already bolded - remove stars:
				if (starsBefore === '**' && starsAfter === '**') {
					chunk.before = chunk.before.replace(window.RegExp('[*]{' + 2 + '}$', ''), '');
					chunk.after = chunk.after.replace(window.RegExp('^[*]{' + 2 + '}', ''), '');
					this.editorCm.setValue(chunk.before + selection + chunk.after);
				} else if (selection !== '') {
					// If first bolded - add stars:
					this.editorCm.replaceSelection('**' + selection + '**');
				} else {
					break;
				}

				break;
			case 'italic':
				if (selection === '') break;
				this.editorCm.replaceSelection('*' + selection + '*');
				break;
			case 'header':
				this.editorCm.replaceSelection('# ' + selection);
				break;
			default:
				break;
		}
		// TODO finir ca
	};

	handleSelectCourse = clickedCourse => () => {
		this.setState({ clickedCourse });
	};

	renderCoursesList(courses) {
		if (courses.length === 0) return;

		const { course } = this.props;

		return courses.map((c, key) => {
			const isActive = course._id === c._id; // course = the current if editing
			return (
				<List.Item key={c._id} as={Link} active={isActive} className={cx(isActive ? 'active-course' : '')} to={`/course/edit/${c._id}`} icon="file text" content={c.title} onClick={this.handleSelectCourse(key)} />
			);
		});
	}

	renderPaginationCoursesList(coursesPagesCount, pagination) {
		return (
			<Pagination
				activePage={pagination.indexPage}
				boundaryRange={1}
				siblingRange={1}
				onPageChange={this.handlePaginationChange}
				size="mini"
				totalPages={coursesPagesCount}
				ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
				prevItem={{ content: <Icon name="angle left" />, icon: true }}
				nextItem={{ content: <Icon name="angle right" />, icon: true }}
				firstItem={null}
				lastItem={null}
			/>
		);
	}

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure } = this.props;
		const { category, isEditing, fieldsTyping, heightDocument, pagination } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const messagesError = this.dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
		const { categoriesOptions, subCategoriesOptions } = this.getOptionsFormsSelect();
		const isDisableButtonSubmit = isEditing && !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && !fieldsTyping.isPrivate;

		const buttonsToolbar = [
			{ icon: 'bold', isDisabled: false, content: 'Bold' },
			{ icon: 'italic', isDisabled: false, content: 'Italic' },
			{ icon: 'header', isDisabled: true, content: 'Header' },
			{ icon: 'strikethrough', isDisabled: true, content: 'Strikethrough' },
			{ icon: 'unordered list', isDisabled: true, content: 'Unordered list' },
			{ icon: 'ordered list', isDisabled: true, content: 'Ordered list' },
			{ icon: 'check square', isDisabled: true, content: 'Check list' },
			{ icon: 'quote left', isDisabled: true, content: 'Quote left' },
			{ icon: 'code', isDisabled: true, content: 'Add a code' },
			{ icon: 'table', isDisabled: true, content: 'Add a table' },
			{ icon: 'linkify', isDisabled: true, content: 'Add a link' },
			{ icon: 'file image outline', isDisabled: true, content: 'Add image' }
		];

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container')}>
					<div className={cx('panel-explorer-container')}>
						<div className={cx('panel-explorer-nav-bar')}>
							<Button.Group basic size="small">
								<Popup trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Go to dashboard" />
								<Popup trigger={<Button icon="file" as={Link} to="/course/create/new" />} content="New course" />
								{ isEditing && Object.keys(fieldsTyping).length === 0 ? <Popup trigger={<Button disabled icon="save" onClick={this.handleOnSubmit} />} content="Save" /> : <Popup trigger={<Button icon="save" onClick={this.handleOnSubmit} />} content="Save" />}
								{ !isEditing ? <Button disabled icon="sticky note outline" /> : <Popup trigger={<Button icon="sticky note outline" as={Link} to={`/course/${course._id}`} />} content="See the course (you should save before)" /> }
							</Button.Group>
						</div>

						<div className={cx('panel-explorer-tree-folder')}>
							<List className={cx('panel-explorer-tree-folder-itemslist')} link>{ this.renderCoursesList(courses) }</List>
							{ coursesPagesCount > 0 && this.renderPaginationCoursesList(coursesPagesCount, pagination) }
						</div>

						<div className={cx('panel-explorer-properties')}>
							<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
								<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={this.handleInputChange} />
								<Form.TextArea label="Description" placeholder="The description of your course..." name="description" value={fields.description || ''} onChange={this.handleInputChange} />

								<Form.Select required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={this.handleInputChange} />
								{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={this.handleInputChange} /> : ''}

								<Form.Checkbox disabled label="Private" name="isPrivate" value={fields.isPrivate || ''} onChange={this.handleInputChange} />
								<Message error content={messagesError} />

								{ isDisableButtonSubmit ? <Form.Button basic disabled>Save properties</Form.Button> : <Form.Button basic>Save properties</Form.Button>}
							</Form>
						</div>
					</div>

					<div className={cx('editor-container-full')}>
						<div className={cx('editor-toolbar')}>
							<Button.Group basic size="small">
								{ buttonsToolbar.map((button, key) => (<Popup trigger={<Button icon={button.icon} basic inverted disabled={button.isDisabled} className={cx('button')} onClick={this.handleClickToolbar(button.icon)} />} content={button.content} key={key} />)) }
							</Button.Group>
						</div>

						<div className={cx('editor-container')}>
							<div className={cx('editor-edition')}>
								<Form error={addOrEditMissingField.content} size="small">
									<textarea ref={(el) => { this.refEditor = el; }} name="editorCm" defaultValue={fields.content} />
									{/*
									<Form.TextArea placeholder="The content of your course..." name="content" value={fields.content || ''} error={addOrEditMissingField.content} onChange={this.handleInputChange} style={{ height: (heightDocument - 44) + 'px' }} />
									<Message error content="the content is required" className={cx('editor-edition-error-message')} />
									*/}
								</Form>
							</div>

							<div className={cx('container-page', 'preview')} style={{ height: (heightDocument - 44) + 'px' }} dangerouslySetInnerHTML={{ __html: marked(fields.content || '') }} ref={(el) => { this.refPreview = el; }} />
						</div>
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
		title: PropTypes.string
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
