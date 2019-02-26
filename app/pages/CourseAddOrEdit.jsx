import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import TinyEditor from '../components/TinyEditor/TinyEditor';
import DOMPurify from 'dompurify';
import katex from 'katex';
import { kaTexRendering } from '../components/common/renderingCourse';
import { createCourseAction, updateCourseAction, emptyErrorsAction, fetchCoursesByFieldAction, setPaginationCoursesEditorAction } from '../actions/courses';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import ButtonOpenMenuPanel from '../components/ButtonOpenMenuPanel/ButtonOpenMenuPanel';
import EditorPanelExplorer from '../components/EditorPanelExplorer/EditorPanelExplorer';
import { Button, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesAddOrEditCourse from './css/courseAddOrEdit.scss';
import stylesCourse from './css/course.scss';

let tinymce;
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
	tinymce = require('tinymce');
	require('tinymce/themes/modern');
	require('tinymce/plugins/wordcount');
	require('tinymce/plugins/table');
	require('tinymce/plugins/codesample');
	require('tinymce/plugins/link');
	require('tinymce/plugins/image');
	require('tinymce/plugins/textcolor');
}

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class CourseAddOrEdit extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleOpenMenuPanel = this.handleOpenMenuPanel.bind(this);

		// Tiny MCE Editor:
		this.handleEditorChange = this.handleEditorChange.bind(this);

		this.defaultMessageEditor = `<h2 style="text-align: center;"><span style="color: #ff6600;"><img height="150" width="150" alt="Logo Hubnote" src="https://s3.eu-west-3.amazonaws.com/studento/150_36858799_1546961527198.jpg" style="color: #000000; font-size: 14px;"></span></h2>
<h2 style="text-align: center;"><span style="color: #ff6600;">Title here</span></h2>
<p>&nbsp;</p>
<p>For <span style="background-color: #ffff00;">start to take notes</span>, <strong>remove</strong> this <span style="color: #999999;">sample content</span> or <strong>modify</strong> this one.</p>
<p><a rel="noopener" href="https://hubnote.app" title="Example link">https://hubnote.ap</a></p>
<h2>Table example:</h2>
<table border="1" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr>
<td style="width: 33.3333%; text-align: center;"><strong>Table</strong></td>
<td style="width: 33.3333%; text-align: center;"><strong>Are&nbsp;</strong></td>
<td style="width: 33.3333%; text-align: center;"><strong>Cool</strong></td>
</tr>
<tr>
<td style="width: 33.3333%; text-align: left;">Col 1</td>
<td style="width: 33.3333%; text-align: center;">left-aligned</td>
<td style="width: 33.3333%; text-align: right;">$33</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<h1>Titles Level 1</h1>
<h2>Titles Level 2</h2>
<h3>Titles Level 3</h3>
<h4>Titles Level 4</h4>
<h5>Titles Level 5</h5>
<h6>Titles Level 5</h6>
<p>&nbsp;</p>
<h2>Code sample example:</h2>
<pre class="language-javascript"><code>const myvar = 'content...';</code></pre>
<p>&nbsp;</p>
<p>&nbsp;</p>`;

		this.idEditor = 'tinyEditor';

		this.state = {
			fieldsTyping: {
				template: {}
			},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			isEditorChanged: false,
			isMenuPanelOpen: (this.props.location && this.props.location.state && this.props.location.state.isMenuPanelOpen) || false
		};
	}

	componentDidMount() {
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

			// Update Tiny MCE Editor;
			tinymce.EditorManager.get(this.idEditor).setContent(this.props.course.content || this.defaultMessageEditor);

			this.setContentSanitized({ callFrom: 'update' });

			const { addOrEditMissingField, addOrEditFailure, emptyErrorsAction } = this.props;

			// Empty the errors when change course or create a new:
			if ((Object.keys(addOrEditMissingField).length > 0) || addOrEditFailure.length > 0) emptyErrorsAction();
		}
	}

	getHeigthElements() {
		const heightPanel = (this.editorPanelExplorer && ReactDOM.findDOMNode(this.editorPanelExplorer).clientHeight) || 550;
		const heightDocument = (typeof window !== 'undefined' && window.innerHeight) || 500;
		let heightEditor = heightDocument - 152;
		if (heightPanel > heightDocument) heightEditor = heightPanel;

		return { heightEditor };
	}

	getMetaData() {
		return {
			title: 'Add a Note',
			meta: [{ name: 'description', content: 'Add a Note...' }],
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
		const content = ((typeof params.contentCourse !== 'undefined') ? params.contentCourse : this.props.course && this.props.course.content) || this.defaultMessageEditor;
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

	handleOpenMenuPanel() {
		this.setState({ isMenuPanelOpen: !this.state.isMenuPanelOpen });
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

	handleEditorChange = (content) => {
		this.setContentSanitized({ contentCourse: content });
	};

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, courses, userMe, createCourseAction, updateCourseAction, coursesPagesCount, fetchCoursesByFieldAction, paginationEditor, setPaginationCoursesEditorAction } = this.props;
		const { fieldsTyping, isEditing } = this.state;
		const indexPagination = paginationEditor.lastActivePage;
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

				// Goto next page if last item:
				if ((courses.length + 1) % 13 === 0) {
					const activePage = indexPagination + 1;

					setPaginationCoursesEditorAction(activePage);
					fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage });
				}
			});
		}
	}

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure, categories, userMe, paginationEditor } = this.props;
		const { category, isEditing, fieldsTyping, isEditorChanged, isMenuPanelOpen } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const { heightEditor } = this.getHeigthElements();

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container-light')}>
					<ButtonOpenMenuPanel handleOpenMenuPanel={this.handleOpenMenuPanel} isMenuPanelOpen={isMenuPanelOpen} />

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
						fromPage="wy"
					/>

					<div className={cx('editor-container-full', isMenuPanelOpen ? 'menu-open' : '')}>
						<div className={cx('editor-toolbar', !isMenuPanelOpen ? 'add-margin' : '')}>
							<Button.Group basic size="small" className={cx('button-group')}>
								<Popup trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Go to dashboard" />

								<Popup trigger={<Button icon="file" />} flowing hoverable>
									<Button basic size="small" icon="file text" as={Link} to="/course/create/new" content="New Note" />
									<Button basic size="small" icon="file" as={Link} to="/courseMd/create/new" content="New Markdown Note" />
								</Popup>

								{ !isEditorChanged ? <Popup trigger={<Button disabled icon="save" onClick={this.handleOnSubmit} />} content="Save" /> : <Popup trigger={<Button icon="save" onClick={this.handleOnSubmit} />} content="Save" /> }
								{ !isEditing ? <Button disabled icon="at" /> : <Popup inverted trigger={<Button icon="at" as={Link} to={`/course/${course._id}`} />} content="Got to page (you should save before)" /> }
							</Button.Group>
						</div>

						<TinyEditor
							id={this.idEditor}
							onEditorChange={this.handleEditorChange}
							content={fields.content}
							tinymce={tinymce}
							heightDocument={heightEditor}
						/>
					</div>
				</div>
			</LayoutPage>
		);
	}
}

CourseAddOrEdit.propTypes = {
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

export default connect(mapStateToProps, { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction })(CourseAddOrEdit);
