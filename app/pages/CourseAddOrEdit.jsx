import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import katex from 'katex';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { HighlightRendering, kaTexRendering } from '../components/common/renderingCourse';
import { Link } from 'react-router';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { List, Form, Message, Button, Popup, Pagination, Icon, Header, Segment, Select } from 'semantic-ui-react';
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

		// Editor:
		this.handleEditorChange = this.handleEditorChange.bind(this);

		this.state = {
			fieldsTyping: {
				template: {}
			},
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

		// Highlight and Katex rendering init:
		require('katex/dist/katex.css');
		// this.templateRendering();
		this.setContentSanitized({ callFrom: 'mount' });
		// setTimeout(() => hljs.initHighlighting(), 1000);
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

		const codeLanguagesOptions = [
			{ key: 'markdown', text: 'markdown', value: 'markdown' },
			{ key: 'javascript', text: 'Javascript', value: 'javascript' },
			{ key: 'php', text: 'Php', value: 'php' },
			{ key: 'python', text: 'Python', value: 'python' },
			{ key: 'ruby', text: 'Ruby', value: 'ruby' },
			{ key: 'sass', text: 'Sass', value: 'sass' },
			{ key: 'shell', text: 'Shell', value: 'shell' },
			{ key: 'sql', text: 'Sql', value: 'sql' },
			{ key: 'stylus', text: 'Stylus', value: 'stylus' },
			{ key: 'xml', text: 'XML', value: 'xml' },
			{ key: 'coffeescript', text: 'Coffeescript', value: 'coffeescript' },
			{ key: 'css', text: 'Css', value: 'css' },
			{ key: 'cmake', text: 'Cmake', value: 'cmake' },
			{ key: 'htmlmixed', text: 'HTML', value: 'htmlmixed' },
			{ key: 'mathematica', text: 'Mathematica', value: 'mathematica' },
			{ key: 'katex', text: 'Katex', value: 'katex' }
		];

		const columnsOptions = [
			{ key: 1, text: '1 column', value: 1 },
			{ key: 2, text: '2 columns', value: 2 },
			{ key: 3, text: '3 columns', value: 3 },
			{ key: 4, text: '4 columns', value: 4 }
		];

		return { categoriesOptions: arrCatList, subCategoriesOptions: arrSubCatList, codeLanguagesOptions, columnsOptions };
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

	updateWindowDimensions() {
		this.setState({ heightDocument: window.innerHeight });
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, courses, userMe, createCourseAction, updateCourseAction, coursesPagesCount, fetchCoursesByFieldAction } = this.props;
		const { pagination } = this.state;
		const indexPagination = pagination.indexPage || 0;
		const field = this.getFieldsVal(this.state.fieldsTyping, course);
		const data = {};

		if (this.state.isEditing) {
			data.fields = {...this.state.fieldsTyping, template: { ...field.template } };
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data).then(() => {
				this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
			});
		} else {
			data.fields = field;
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			data.type = 'wy';
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

	renderCoursesList(courses) {
		if (courses.length === 0) return;

		const { course } = this.props;

		return courses.map((c, key) => {
			const pathCourseToEdit = c.type !== 'wy' ? `/courseMd/edit/${c._id}` : `/course/edit/${c._id}`;
			const isActive = course._id === c._id; // course = the current if editing

			return (
				<List.Item key={c._id} as={Link} active={isActive} className={cx(isActive ? 'active-course' : '')} to={pathCourseToEdit} icon="file text" content={c.title} onClick={this.handleSelectCourse(key)} />
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
				}
			}, () => {
				kaTexRendering(katex, contentSanitized);
			});
		}

		// From typing:
		this.setState({
			fieldsTyping: {...oldStateTyping, content: contentSanitized }
		}, () => {
			kaTexRendering(katex, contentSanitized);
		});
	}

	handleEditorChange = (e) => {
		this.setContentSanitized({ contentCourse: e.target.getContent() });
	};

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure } = this.props;
		const { category, isEditing, fieldsTyping, pagination } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const messagesError = this.dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
		const { categoriesOptions, subCategoriesOptions, columnsOptions } = this.getOptionsFormsSelect();
		const isDisableButtonSubmit = isEditing && !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && !fieldsTyping.isPrivate && (!fieldsTyping.template || (fieldsTyping.template && Object.keys(fieldsTyping.template).length === 0));

		const selectTemplatesHeaders = [
			{ label: 'h1', name: 'columnH1' },
			{ label: 'h2', name: 'columnH2' },
			{ label: 'h3', name: 'columnH3' },
			{ label: 'h4', name: 'columnH4' },
			{ label: 'h5', name: 'columnH5' },
			{ label: 'h6', name: 'columnH6' }
		];

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container')}>
					<div className={cx('panel-explorer-container')}>
						<div className={cx('panel-explorer-nav-bar')}>
							<Button.Group basic size="small">
								<Popup trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Go to dashboard" />
								<Popup trigger={<Button icon="file" as={Link} to="/course/create/new" />} content="New course" />
								<Popup trigger={<Button icon="file" as={Link} to="/courseMd/create/new" />} content="New MarkDown course" />
								{ isEditing && Object.keys(fieldsTyping).length === 0 ? <Popup trigger={<Button disabled icon="save" onClick={this.handleOnSubmit} />} content="Save" /> : <Popup trigger={<Button icon="save" onClick={this.handleOnSubmit} />} content="Save" />}
								{ !isEditing ? <Button disabled icon="sticky note outline" /> : <Popup trigger={<Button icon="sticky note outline" as={Link} to={`/course/${course._id}`} />} content="See the course (you should save before)" /> }
							</Button.Group>
						</div>

						<div className={cx('panel-explorer-tree-folder')}>
							<List className={cx('panel-explorer-tree-folder-itemslist')} link>{ this.renderCoursesList(courses) }</List>
							{ coursesPagesCount > 1 && this.renderPaginationCoursesList(coursesPagesCount, pagination) }
						</div>

						<div className={cx('panel-explorer-properties')}>
							<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
								<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={this.handleInputChange} />
								<Form.TextArea label="Description" placeholder="The description of your course..." name="description" value={fields.description || ''} onChange={this.handleInputChange} />

								<Form.Select required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={this.handleInputChange} />
								{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={this.handleInputChange} /> : ''}

								<Form.Checkbox disabled label="Private" name="isPrivate" value={fields.isPrivate || ''} onChange={this.handleInputChange} />

								<Segment>
									<Header as="h4" icon="edit" content="Templates" />
									<Form.Field inline className={cx('header-select-container')}>
										{ selectTemplatesHeaders.map((select, key) => {
											return (
												<div key={key}>
													<label htmlFor={select.name}>{select.label}</label>
													<Select className={cx('header-select')} name={select.name} options={columnsOptions} value={fields.template[select.name] || 1} onChange={this.handleInputChange} />
												</div>
												);
										}) }
									</Form.Field>
								</Segment>

								<Message error content={messagesError} />

								{ isDisableButtonSubmit ? <Form.Button basic disabled>Save properties</Form.Button> : <Form.Button basic>Save properties</Form.Button>}
							</Form>
						</div>
					</div>

					<div className={cx('editor-container-full')}>
						<Editor
							apiKey="3kobmcz3sotpddw4zkuzj5d9hse2tuytw4jrqi5ndthqc0wq"
							initialValue={fields.content}
							init={{
								min_height: 600,
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
