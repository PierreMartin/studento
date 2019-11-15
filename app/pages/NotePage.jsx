import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { fetchCourseByFieldAction, createCourseAction, updateCourseAction, emptyErrorsAction, deleteCourseAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import ButtonOpenPanelExplorer from '../components/ButtonOpenPanelExplorer/ButtonOpenPanelExplorer';
import ButtonOpenPanelSettings from '../components/ButtonOpenPanelSettings/ButtonOpenPanelSettings';
import EditorPanelExplorer from '../components/EditorPanelExplorer/EditorPanelExplorer';
import EditorPanelSettings from '../components/EditorPanelSettings/EditorPanelSettings';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import ContainerMd from '../components/NotePageMd/ContainerMd';
import ContainerTiny from '../components/NotePageTiny/ContainerTiny';
// import SectionsGeneratorForScrolling from '../components/common/SectionsGeneratorForScrolling';
import { Form } from 'semantic-ui-react';
import BasicModal from '../components/Modals/BasicModal';
import { getCodeLanguagesFormsSelect } from '../components/EditorPanelSettings/attributesForms';
import { browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesNotePage from './css/notePage.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage});

class NotePage extends Component {
	constructor(props) {
		super(props);

		this.handleClickToolbarMain = this.handleClickToolbarMain.bind(this);
		this.handleClickToolbarMarkDown = this.handleClickToolbarMarkDown.bind(this);

		this.handleSave = this.handleSave.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleOpenPanelExplorer = this.handleOpenPanelExplorer.bind(this);
		this.handleOpenPanelSettings = this.handleOpenPanelSettings.bind(this);
		this.resizeWindow = this.resizeWindow.bind(this);
		this.handleSetTinymce = this.handleSetTinymce.bind(this);
		this.handleSetCodeMirror = this.handleSetCodeMirror.bind(this);
		this.handleEditorTinyChange = this.handleEditorTinyChange.bind(this);

		// Delete modal:
		this.handleModalOpen_DeleteNote = this.handleModalOpen_DeleteNote.bind(this);
		this.handleModalClose_DeleteNote = this.handleModalClose_DeleteNote.bind(this);
		this.handleModalSubmit_DeleteNote = this.handleModalSubmit_DeleteNote.bind(this);

		// isDirty modal:
		this.handleModalOpen_CanClose = this.handleModalOpen_CanClose.bind(this);
		this.handleModalOnSave_CanClose = this.handleModalOnSave_CanClose.bind(this);
		this.handleModalOnChangePage_CanClose = this.handleModalOnChangePage_CanClose.bind(this);

		// Mini editor modal:
		this.handleModalSetContent_MiniEditor = this.handleModalSetContent_MiniEditor.bind(this);
		this.handleModalOpen_MiniEditor = this.handleModalOpen_MiniEditor.bind(this);
		this.handleModalClose_MiniEditor = this.handleModalClose_MiniEditor.bind(this);
		this.handleModalOnChange_MiniEditor = this.handleModalOnChange_MiniEditor.bind(this);
		this.handleModalSubmit_MiniEditor = this.handleModalSubmit_MiniEditor.bind(this);
		this.editorInModalDidMount = this.editorInModalDidMount.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);

		// Scroll:
		// this.handleScroll = this.handleScroll.bind(this);
		// this.timerHandleScroll = null;
		// this.scrollingTarget = null;
		// this._sectionsForScrolling = null;

		// Scroll sync - when re-rendering in CM editor:
		// this.numberViewportChanged = 0;
		// this.prevNumberViewportChanged = 0;
		// this.prevArrTitlesinEditor = [];

		// this.editorPanelExplorerRef = null;
		this.editorToolbarRef = null;
		this.editorToolbarMdRef = null;

		this.timerRenderPreview = null;
		this.timerResizeWindow = null;

		this.editorCm = null;
		this.editorCmMini = null;
		this.defaultMessageEditorMd = `For start to take notes, **remove** this sample content or **modify** this one

[Example link](http://hubnote.app)

# Lists example:
- List A
- List B

1. list A
1. list B

# Table example:
------
| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

# Titles example:
-----

## Title main
lorem lorem...

### sub-title 1
lorem lorem...

### sub-title 2
lorem lorem...


# Code sample example:
\`\`\`javascript
const myVar = 'content...';
\`\`\`

		`;

		this.defaultMessageEditorTiny = `<h2 style="text-align: center;"><span style="color: #ff6600;"><img height="150" width="150" alt="Logo Hubnote" src="https://s3.eu-west-3.amazonaws.com/studento/150_36858799_1546961527198.jpg" style="color: #000000; font-size: 14px;"></span></h2>
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

		this.refEditorMd = null;
		this.refPreviewMd = null;
		this.isFirstCodeMirrorInit = true;

		this.state = {
			tinyMceLib: null,
			codeMirrorLib: null,
			pageMode: 'wy',
			fieldsTyping: {
				template: {}
			},
			isEditing: false,
			category: { lastSelected: null },
			heightEditor: 0,
			heightToolbar: 0,
			modalMiniEditor: {},
			fieldsModalMiniEditorTyping: {},
			codeLanguageSelected: '',
			isDirty: false,
			isMobile: false,
			isPanelExplorerOpen: true,
			isPanelSettingsOpen: false,
			isEditMode: false,
			canCloseModal: {
				isOpen: false,
				path: ''
			},
			modalDeleteNote: {
				isOpen: false,
				courseToDelete: {}
			},
			activePage: 1
		};
	}

	componentDidMount() {
		this.loadDatas().then(({course}) => {
			const isEditing = course && typeof course._id !== 'undefined';
			const isEditMode = !isEditing;
			const isPanelExplorerOpen = !isEditMode;

			const pageMode = this.getPageMode(course);

			// Resize element child to 100% height:
			this.resizeWindow();
			window.addEventListener('resize', this.resizeWindow);

			this.setState({ isEditing, isPanelExplorerOpen, isEditMode, pageMode });
		});
	}

	componentDidUpdate(prevProps, prevstate) {
		const editModeChanged = prevstate.isEditMode !== this.state.isEditMode;
		const prevTypeNote = prevProps.location && prevProps.location.state && prevProps.location.state.typeNote;
		const currTypeNote = this.props.location && this.props.location.state && this.props.location.state.typeNote;
		const linkClicked = prevTypeNote && currTypeNote && prevTypeNote !== currTypeNote;
		const isCreate = this.props.routeParams && this.props.routeParams.action === 'create';
		let pageMode = 'wy';

		if (this.props.location && this.props.location.state && Object.keys(this.props.location.state).length) {
			pageMode = this.props.location.state.typeNote;
		}

		// Edit mode actived:
		if ((editModeChanged || (linkClicked && isCreate)) && this.state.isEditMode) {
			const timeOffset = this.isFirstCodeMirrorInit ? 800 : 0;
			setTimeout(() => {
				if (pageMode === 'md') { this.codeMirrorInit(); }
				this.resizeEditors();
				this.isFirstCodeMirrorInit = false;
			}, timeOffset);
		}

		// Edit mode deactived:
		if ((editModeChanged || (linkClicked && isCreate)) && !this.state.isEditMode) {
			this.resizeEditors();
		}

		// Change pages:
		const pageChanged = prevProps.params.id !== this.props.params.id;
		if (pageChanged || linkClicked) {
			this.loadDatas().then(({course}) => {
				const isEditing = course && typeof course._id !== 'undefined';
				const isEditMode = !isEditing;

				if (pageMode === 'md' && isEditMode && this.editorCm) {
					this.editorCm.setValue('');
				}

				if (pageMode === 'wy' && isEditMode && this.state.tinyMceLib && this.state.tinyMceLib.activeEditor) {
					this.state.tinyMceLib.activeEditor.setContent('');
				}

				this.resizeEditors();
				this.setState({
					isEditing,
					isEditMode,
					fieldsTyping: { template: {} },
					category: { lastSelected: null },
					isDirty: false,
					isPanelSettingsOpen: false,
					pageMode
				}, () => {
					setTimeout(() => {
						this.refPreviewMd && this.refPreviewMd.scrollTo(0, 0);
					}, 100);
				});

				const { addOrEditMissingField, addOrEditFailure, emptyErrorsAction } = this.props;

				// Empty the errors when change course or create a new:
				if ((Object.keys(addOrEditMissingField).length > 0) || addOrEditFailure.length > 0) emptyErrorsAction();
			});
		}
	}

	componentWillUnmount() {
		this.resizeWindow();
		window.removeEventListener('resize', this.resizeWindow);
	}

	getMetaData() {
		return {
			title: 'Add a Note',
			meta: [{ name: 'description', content: 'Add a Note...' }],
			link: []
		};
	}

	getPageMode(course = null) {
		let pageMode = 'wy';
		if (this.props.location && this.props.location.state && Object.keys(this.props.location.state).length) {
			pageMode = this.props.location.state.typeNote;
		}

		if (course && course.type === 'md') {
			pageMode = 'md';
		} else if (course && course.type === 'wy') {
			pageMode = 'wy';
		}

		return pageMode;
	}

	loadDatas() {
		const { params, fetchCourseByFieldAction, fetchCategoriesAction } = this.props;
		fetchCategoriesAction();
		return fetchCourseByFieldAction({ keyReq: '_id', valueReq: params.id, action: params.action });
	}

	handleSetTinymce(tinyMceLib, callback) {
		this.setState({ tinyMceLib }, callback);
	}

	handleSetCodeMirror(codeMirrorLib) {
		this.setState({ codeMirrorLib });
	}

	codeMirrorInit() {
		this.editorCm = this.state.codeMirrorLib.fromTextArea(this.refEditorMd, {
			// value: fields.content, // already set by the textarea
			lineNumbers: true,
			codeFold: true,
			// placeholder: 'Write you note here...',
			dragDrop: false,
			autofocus: true,
			readOnly: false,
			matchTags: false,
			tabSize: 4,
			indentUnit: 4,
			lineWrapping: true,
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

			theme: 'blackboard',
			mode: 'gfm'
		});

		// handleEditorChange:
		this.editorCm.on('change', () => {
			const oldStateTyping = this.state.fieldsTyping;
			const valueEditor = this.editorCm.getValue();
			const isBigFile = valueEditor.length >= 3000;

			// ------- Big course -------
			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				if (isBigFile) {
					this.setState({
						fieldsTyping: {...oldStateTyping, content: valueEditor },
						isDirty: true
					});
				}
			}, 100);

			// ------- Small course -------
			if (!isBigFile) {
				this.setState({
					fieldsTyping: {...oldStateTyping, content: valueEditor },
					isDirty: true
				});
			}
		});

		// Scroll sync - when re-rendering in CM editor:
		// this.editorCm.on('viewportChange', () => { this.numberViewportChanged++; });

		setTimeout(() => this.initScrollingMd(), 20); // For Firefox because it keep the scroll position after reload
	}

	handleEditorTinyChange(content) {
		// handleEditorChange
		const oldStateTyping = this.state.fieldsTyping;

		this.setState({
			fieldsTyping: {...oldStateTyping, content },
			isDirty: true
		});
	}

	resizeEditors() {
		const heightDocument = (typeof window !== 'undefined' && window.innerHeight) || 500;
		// const heightEditorPanelExplorer = this.editorPanelExplorerRef ? ReactDOM.findDOMNode(this.editorPanelExplorerRef).clientHeight : 820;
		const heightEditorToolbar = this.editorToolbarRef ? ReactDOM.findDOMNode(this.editorToolbarRef).clientHeight : 0;
		const heightEditorMdToolbar = this.editorToolbarMdRef ? ReactDOM.findDOMNode(this.editorToolbarMdRef).clientHeight : 0;
		let heightEditor = heightDocument;

		/*
		if (heightEditorPanelExplorer > heightDocument) {
			heightEditor = heightEditorPanelExplorer;
		}
		*/

		heightEditor = heightEditor - heightEditorToolbar - heightEditorMdToolbar - 5;

		if (this.editorCm) this.editorCm.setSize(null, heightEditor);

		const nextState = { heightEditor, heightToolbar: heightEditorToolbar, isMobile: false };
		if (window.matchMedia('(max-width: 768px)').matches) { nextState.isMobile = true; }
		this.setState(nextState);
	}

	getContentVal(stateCourse, propsCourse) {
		const { courses } = this.props;

		let defaultMessageEditor = '';

		if (this.state.pageMode === 'md') {
			const numberCoursesMd = courses && courses.filter(course => course.type === 'md').length;
			defaultMessageEditor = (numberCoursesMd === 0) ? this.defaultMessageEditorMd : '';
		}

		if (this.state.pageMode === 'wy') {
			const numberCoursesTiny = courses && courses.filter(course => course.type === 'wy').length;
			defaultMessageEditor = (numberCoursesTiny === 0) ? this.defaultMessageEditorTiny : '';
		}

		let content = defaultMessageEditor;

		// If already typing:
		if (stateCourse.content && stateCourse.content.length > 0) {
			content = stateCourse.content;
		} else if (propsCourse.content && propsCourse.content.length > 0) {
			// If never typing but have content from request:
			content = propsCourse.content;
		}

		return content;
	}

	getFieldsVal(fieldsTyping, course) {
		const fields = {};
		fields.title = ((typeof fieldsTyping.title !== 'undefined') ? fieldsTyping.title : course && course.title) || '';
		fields.category = ((typeof fieldsTyping.category !== 'undefined') ? fieldsTyping.category : course && course.category) || '';
		fields.subCategories = ((typeof fieldsTyping.subCategories !== 'undefined') ? fieldsTyping.subCategories : course && course.subCategories) || [];
		fields.isPrivate = ((typeof fieldsTyping.isPrivate !== 'undefined') ? fieldsTyping.isPrivate : course && course.isPrivate) || false;
		fields.description = ((typeof fieldsTyping.description !== 'undefined') ? fieldsTyping.description : course && course.description) || '';
		fields.template = (fieldsTyping.template && Object.keys(fieldsTyping.template).length > 0 ? {...course.template, ...fieldsTyping.template} : course && course.template) || {};

		return fields;
	}

	resizeWindow() {
		clearTimeout(this.timerResizeWindow);
		this.timerResizeWindow = setTimeout(() => {
			this.resizeEditors();

			// For the cases when we are in the middle of the editor (so we can don't have the first elements in DOM), the elements upper can have the offset changed.
			// Therefore we need to go to the top for re calculate the offsets
			this.initScrollingMd();
		}, 80);
	}

	handleSave(event) {
		if (event && event.preventDefault) { event.preventDefault(); }

		const { course, userMe, createCourseAction, updateCourseAction, coursesPagesCount } = this.props;
		const { fieldsTyping, activePage } = this.state;
		const template = (fieldsTyping.template && Object.keys(fieldsTyping.template).length > 0 ? {...course.template, ...fieldsTyping.template} : course && course.template) || {};
		const data = {};

		if (this.state.isEditing) {
			data.fields = {...fieldsTyping, template: { ...template } };
			data.userMeId = userMe._id;
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data)
				.then(() => {
					this.setState({ category: { lastSelected: null }, fieldsTyping: {}, isDirty: false, isPanelSettingsOpen: false });
				}).catch(() => {
					// this.setState({ isPanelSettingsOpen: true });
			});
		} else {
			data.fields = fieldsTyping;
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			data.fields.type = this.state.pageMode;
			createCourseAction(data, coursesPagesCount, activePage)
				.then(() => {
					this.setState({ category: { lastSelected: null }, fieldsTyping: {}, isDirty: false, isPanelSettingsOpen: false });
				}).catch(() => {
					// this.setState({ isPanelSettingsOpen: true });
			});
		}
	}

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;

		// Set isPrivate:
		if (field.name === 'isPrivate') {
			return this.setState({ fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.value === 'true' } } });
		}

		// Set categories:
		if (field.name === 'category') {
			return this.setState({
				fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.value }, subCategories: [] },
				category: { lastSelected: field.value}
			});
		}

		// Set columns:
		if (/^column/g.test(field.name)) {
			const content = this.getContentVal(this.state.fieldsTyping, this.props.course);

			return this.setState({
				fieldsTyping: {...this.state.fieldsTyping, template: {...this.state.fieldsTyping.template, ...{[field.name]: field.value}}, content: content + ' ' }, // Hack for re-generate Marked headings
				isDirty: true
			});
		}

		// Set all forms fields except content:
		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}, isDirty: true});
	}

	setStyleSelectable(param) {
		// init:
		const chunk = {};
		chunk.selection = this.editorCm.getSelection();

		const selPosStart = this.editorCm.doc.sel.ranges[0].anchor;
		const selPosEnd = this.editorCm.doc.sel.ranges[0].head;
		const valuePosStart = { line: 0, ch: 0 };
		const valuePosEnd = { line: this.editorCm.lineCount() + 1, ch: 0 };
		const numberChars = param.numberChars;
		const char = param.char;

		chunk.before = this.editorCm.getRange(valuePosStart, selPosStart);
		chunk.after = this.editorCm.getRange(selPosEnd, valuePosEnd);

		const regexBefore = window.RegExp('[' + char + ']{' + numberChars + '}$', '');
		const regexAfter = window.RegExp('^[' + char + ']{' + numberChars + '}', '');

		const haveCharBefore = regexBefore.test(chunk.before);
		const haveCharAfter = regexAfter.test(chunk.after);

		// If already styled - remove style:
		if (haveCharBefore && haveCharAfter) {
			chunk.before = chunk.before.replace(regexBefore, '');
			chunk.after = chunk.after.replace(regexAfter, '');
			this.editorCm.setValue(chunk.before + chunk.selection + chunk.after);

			// Re set selection:
			selPosStart.ch -= numberChars;
			selPosEnd.ch -= numberChars;
			this.editorCm.setSelection(selPosStart, selPosEnd);
		} else {
			// If first styled - add style:
			let charsToAdd = '';
			for (let i = 0; i < numberChars; i++) charsToAdd += char;
			this.editorCm.replaceSelection(charsToAdd + chunk.selection + charsToAdd);

			// Re set selection:
			selPosStart.ch += numberChars;
			selPosEnd.ch += numberChars;
			this.editorCm.setSelection(selPosStart, selPosEnd);
		}
	}

	setStyleOnLine(param) {
		// init:
		const chunk = {};
		chunk.line = [];
		chunk.lines = '';
		const selPosStart = Object.assign({}, this.editorCm.doc.sel.ranges[0].anchor);
		const selPosEnd = Object.assign({}, this.editorCm.doc.sel.ranges[0].head);
		const valuePosStart = { line: 0, ch: 0 };
		const valuePosEnd = { line: this.editorCm.lineCount() + 1, ch: 0 };
		const char = param.char;
		let charsAlreadyHave = '';
		const type = param.type;
		const dirAsc = selPosStart.line <= selPosEnd.line;
		let k = selPosStart.line;

		// Get chunks lines:
		if (dirAsc) {
			for (k; k <= selPosEnd.line; k++) { chunk.line.push(this.editorCm.getLine(k)); }
		} else {
			for (k; k >= selPosEnd.line; k--) { chunk.line.push(this.editorCm.getLine(k)); }
			chunk.line.reverse();
		}

		if (typeof chunk.line[0] === 'undefined') return;

		const selPosStartClone = Object.assign({}, selPosStart);
		const selPosEndClone = Object.assign({}, selPosEnd);

		// Get chunks before / after line:
		selPosEndClone.ch = 0;
		selPosStartClone.ch = 0;
		if (selPosStartClone.line <= selPosEndClone.line) {
			selPosEndClone.line++;
			chunk.beforeTheLine = this.editorCm.getRange(valuePosStart, selPosStartClone);
			chunk.afterTheLine = this.editorCm.getRange(selPosEndClone, valuePosEnd);
		} else {
			selPosStartClone.line++;
			chunk.beforeTheLine = this.editorCm.getRange(valuePosStart, selPosEndClone);
			chunk.afterTheLine = this.editorCm.getRange(selPosStartClone, valuePosEnd);
		}

		let regex = window.RegExp('^' + char, '');
		if (type === 'check square') regex = window.RegExp(/^- \[x] /, '');
		if (type === 'header') regex = window.RegExp('^[' + char + ']{1,}', '');

		let haveCharInLine = false;
		for (let l = 0; l < chunk.line.length; l++) {
			haveCharInLine = regex.test(chunk.line[l]);
			charsAlreadyHave = window.RegExp('^[' + char + ']{1,}$', '').test(chunk.line[l].split(' ')[0]) ? chunk.line[l].split(' ')[0] : false; // For header
			if (haveCharInLine) break;
		}

		// ############################ If already styled - for header ONLY: ############################
		if (haveCharInLine && type === 'header' && charsAlreadyHave) {
			const newChars = charsAlreadyHave.length > 5 ? '' : charsAlreadyHave; // reset to 0 after H6

			for (let i = 0; i < chunk.line.length; i++) {
				chunk.lines += chunk.line[i].replace(charsAlreadyHave, newChars + char.trim()).trim() + '\n';
			}
			this.editorCm.setValue(chunk.beforeTheLine + chunk.lines + chunk.afterTheLine);

			// Re set selection:
			selPosStart.ch += 1;
			selPosEnd.ch += 1;
			this.editorCm.setSelection(selPosStart, selPosEnd);
		} else if (haveCharInLine) {
			// ############################ If already styled - remove style: ############################
			for (let j = 0; j < chunk.line.length; j++) {
				chunk.lines += chunk.line[j].replace(regex, '').trim() + '\n';
			}
			this.editorCm.setValue(chunk.beforeTheLine + chunk.lines + chunk.afterTheLine);

			// Re set selection:
			selPosStart.ch -= char.length;
			selPosEnd.ch -= char.length;
			this.editorCm.setSelection(selPosStart, selPosEnd);
		} else {
			// ############################ If first styled - add style: ############################
			selPosStart.ch = 0;

			let j = selPosStart.line;

			if (dirAsc) {
				for (j; j <= selPosEnd.line; j++) {
					selPosStart.line = j;
					this.editorCm.replaceRange(char, selPosStart);
				}
			} else {
				for (j; j >= selPosEnd.line; j--) {
					selPosStart.line = j;
					this.editorCm.replaceRange(char, selPosStart);
				}
			}
		}
	}

	handleModalOpen_MiniEditor(params) { this.setState({ modalMiniEditor: params }); }
	handleModalClose_MiniEditor() { this.setState({ modalMiniEditor: {}, codeLanguageSelected: '', fieldsModalMiniEditorTyping: {} }); }

	editorInModalDidMount = (refEditorInModal) => {
		if (refEditorInModal !== null) {
			this.editorCmMini = this.state.codeMirrorLib.fromTextArea(refEditorInModal, {
				lineNumbers: true,
				codeFold: true,
				placeholder: 'Write you code here',
				dragDrop: false,
				autofocus: true,
				readOnly: false,
				matchTags: false,
				tabSize: 4,
				indentUnit: 4,
				lineWrapping: true,
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
				theme: 'blackboard',
				mode: 'javascript'
			});
		}
	};

	handleModalSubmit_MiniEditor = (params) => {
		const { codeLanguageSelected, fieldsModalMiniEditorTyping } = this.state;
		let selPosStart = {};

		return () => {
			switch (params.type) {
				case 'code':
					selPosStart = Object.assign({}, this.editorCm.doc.sel.ranges[0].anchor);
					const value = '```' + codeLanguageSelected + '\n' + this.editorCmMini.getValue() + '\n```';
					this.editorCm.replaceRange('\n' + value + '\n', selPosStart);
					break;
				case 'table':
					// ...
					break;
				case 'linkify':
					selPosStart = Object.assign({}, this.editorCm.doc.sel.ranges[0].anchor);
					const urlLink = fieldsModalMiniEditorTyping.linkifyUrl.indexOf('http') === -1 ? 'http://' + fieldsModalMiniEditorTyping.linkifyUrl : fieldsModalMiniEditorTyping.linkifyUrl;
					const urlLinkFull = `[${fieldsModalMiniEditorTyping.linkifyText}](${urlLink})`;
					this.editorCm.replaceRange('\n' + urlLinkFull + '\n', selPosStart);
					break;
				case 'file image outline':
					selPosStart = Object.assign({}, this.editorCm.doc.sel.ranges[0].anchor);
					const urlImage = fieldsModalMiniEditorTyping.file.indexOf('http') === -1 ? 'http://' + fieldsModalMiniEditorTyping.file : fieldsModalMiniEditorTyping.file;
					const urlImageFull = `![](${urlImage})`;
					this.editorCm.replaceRange('\n' + urlImageFull + '\n', selPosStart);
					break;
				default:
					break;
			}

			this.handleModalClose_MiniEditor();
		};
	};

	handleLanguageChange(event, field) {
		this.setState({ codeLanguageSelected: field.value });
		if (field.value !== 'katex') this.editorCmMini.setOption('mode', field.value);
	}

	handleModalOnChange_MiniEditor(event, field) {
		this.setState({ fieldsModalMiniEditorTyping: { ...this.state.fieldsModalMiniEditorTyping, ...{[field.name]: field.value } } });
	}

	handleOpenPanelExplorer() {
		this.setState({ isPanelExplorerOpen: !this.state.isPanelExplorerOpen });
	}

	handleOpenPanelSettings() {
		this.setState({ isPanelSettingsOpen: !this.state.isPanelSettingsOpen });
	}

	initScrollingMd() {
		if (this.state.isMobile || !this.state.isEditMode || !this.editorCm || this.state.pageMode !== 'md') return;

		// Init scroll sync - use when re-rendering in CM editor:
		// this.numberViewportChanged = 0;
		// this.prevNumberViewportChanged = 0;
		// this.prevArrTitlesinEditor = [];

		this.editorCm.refresh();
		this.refPreviewMd.scrollTop = 0;
		this.editorCm.getScrollerElement().scrollTop = 0;

		/*
		this._sectionsForScrolling = {
			editor: SectionsGeneratorForScrolling.getOffsetTopTitles(this.editorCm.getScrollerElement()),
			preview: SectionsGeneratorForScrolling.getOffsetTopTitles(this.refPreviewMd)
		};
		*/
	}

	/*
	get sections() {
		const isFirstTimeScrolled = this._sectionsForScrolling === null;
		const haveNewViewportInEditor = this.numberViewportChanged > this.prevNumberViewportChanged;

		if (isFirstTimeScrolled || haveNewViewportInEditor) {
			const titlesInEditor = SectionsGeneratorForScrolling.getOffsetTopTitles(this.editorCm.getScrollerElement(), haveNewViewportInEditor, this.prevArrTitlesinEditor);

			this._sectionsForScrolling = {
				editor: titlesInEditor,
				preview: SectionsGeneratorForScrolling.getOffsetTopTitles(this.refPreviewMd)
			};

			this.prevNumberViewportChanged = this.numberViewportChanged;
			this.prevArrTitlesinEditor = titlesInEditor;
		}

		return this._sectionsForScrolling;
	}

	handleScroll(source) {
		return (e) => {
			if (e.target.scrollTop === 0 || this.state.isMobile || !this.state.isEditMode) return; // (e.target.scrollTop === 0) ==>  When typing, we pass in onScroll :(

			this.resetTargetScrolling(); // For re enable the other container to scroll

			const target = source === 'preview' ? 'editor' : 'preview';
			const scrollTopTarget = SectionsGeneratorForScrolling.getScrollPosition(e.target.scrollTop, this.sections[source], this.sections[target]);

			// If error (scrolled to fast)
			if (scrollTopTarget === false) {
				console.error('Error, scroll too fast');
				setTimeout(() => this.initScrollingMd(), 20);
				return;
			}

			if (this.scrollingTarget === null) this.scrollingTarget = source;
			if (!this.state.isButtonAutoScrollActive || this.scrollingTarget !== source) return;

			if (source === 'editor') {
				this.refPreviewMd.scrollTop = scrollTopTarget;
			} else if (source === 'preview') {
				this.editorCm.getScrollerElement().scrollTop = scrollTopTarget;
			}
		};
	}

	// Scrolling
	resetTargetScrolling() {
		clearInterval(this.timerHandleScroll);
		this.timerHandleScroll = setTimeout(() => { this.scrollingTarget = null; }, 200);
	}
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
				this.handleModalOpen_MiniEditor({ isOpened: true, type: 'code', title: 'Editor', desc: 'Write some code in the editor' });
				break;
			case 'table':
				this.handleModalOpen_MiniEditor({ isOpened: true, type: 'table', title: 'Table', desc: 'Create a table' });
				break;
			case 'linkify':
				this.handleModalOpen_MiniEditor({ isOpened: true, type: 'linkify', title: 'Link', desc: 'Add a link' });
				break;
			case 'file image outline':
				this.handleModalOpen_MiniEditor({ isOpened: true, type: 'file image outline', title: 'Image', desc: 'Add a image' });
				break;
			case 'auto scoll':
				// this.setState({ isButtonAutoScrollActive: !this.state.isButtonAutoScrollActive });
				// this.refPreviewMd.scrollTo(0, this.editorCm.getScrollInfo().top);

				/* TODO FAIRE ca, mais bug quand scroll trop vite
				const scrollTopTarget = SectionsGeneratorForScrolling.getScrollPosition(this.editorCm.getScrollerElement().scrollTop, this.sections.editor, this.sections.preview);
				this.refPreviewMd.scrollTop = scrollTopTarget;
				*/
				break;
			default:
				break;
		}
	};

	handleModalSetContent_MiniEditor() {
		const { modalMiniEditor, fieldsModalMiniEditorTyping, codeLanguageSelected } = this.state;

		return (
			<div>
				{ modalMiniEditor.type === 'code' ? (
					<Form size="small">
						<Form.Select label="Language" options={getCodeLanguagesFormsSelect()} placeholder="Choose a language" width={4} name="language" value={codeLanguageSelected || ''} onChange={this.handleLanguageChange} />
						<textarea ref={this.editorInModalDidMount} name="editorCmMini" defaultValue="Write you code here" />
					</Form>
				) : '' }

				{ modalMiniEditor.type === 'table' ? (
					<div>coming soon</div>
				) : '' }

				{ modalMiniEditor.type === 'linkify' ? (
					<Form size="small">
						<Form.Group widths="equal">
							<Form.Input label="Link text" placeholder="My site" name="linkifyText" value={fieldsModalMiniEditorTyping.linkifyText || ''} onChange={this.handleModalOnChange_MiniEditor} />
							<Form.Input label="URL" placeholder="www.mywebsite.com" name="linkifyUrl" value={fieldsModalMiniEditorTyping.linkifyUrl || ''} onChange={this.handleModalOnChange_MiniEditor} />
						</Form.Group>
					</Form>
				) : '' }

				{ modalMiniEditor.type === 'file image outline' ? (
					<Form size="small">
						<Form.Input label="Add a image" placeholder="https://mywebsite/images/1.jpg" name="file" value={fieldsModalMiniEditorTyping.file || ''} onChange={this.handleModalOnChange_MiniEditor} />
					</Form>
				) : '' }
			</div>
		);
	}

	handleModalOpen_CanClose(path) {
		return (e) => {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			this.setState({ canCloseModal: { isOpen: true, path } });
		};
	}

	handleModalOnSave_CanClose() {
		return () => {
			this.handleSave();
			this.setState({ canCloseModal: { isOpen: false } });
		};
	}

	handleModalOnChangePage_CanClose() {
		if (this.state.canCloseModal.path) {
			browserHistory.push(this.state.canCloseModal.path);
		}

		this.setState({ canCloseModal: { isOpen: false } });
	}

	handleModalOpen_DeleteNote(courseToDelete) {
		return () => {
			this.setState({ modalDeleteNote: { isOpen: true, courseToDelete } });
		};
	}

	handleModalClose_DeleteNote() { this.setState({ modalDeleteNote: { isOpen: false, courseToDelete: {} } }); }

	handleModalSubmit_DeleteNote() {
		return () => {
			const { deleteCourseAction, userMe } = this.props;
			const { modalDeleteNote } = this.state;
			const params = {
				courseId: modalDeleteNote.courseToDelete && modalDeleteNote.courseToDelete._id,
				courseTitle: modalDeleteNote.courseToDelete && modalDeleteNote.courseToDelete.title,
				userMeId: userMe._id
			};

			if (params.courseId && params.userMeId) {
				deleteCourseAction(params).then(() => {
					// If no more course on (page > 1) : goto 1st page
					/*
					if ((courses.length === 1 || !courses) && activePage > 1) {
						fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, showPrivate: true });
					}
					*/

					this.setState({ modalDeleteNote: { isOpen: false, courseToDelete: {} } });
					browserHistory.push({ pathname: '/course/create/new', state: { typeNote: 'md' } });
				});
			}
		};
	}

	render() {
		const {
			course,
			courses,
			coursesPagesCount,
			addOrEditMissingField,
			addOrEditFailure,
			categories,
			userMe,
			isCourseOneLoading,
			isCourseAllLoading
		} = this.props;

		const {
			category,
			isEditing,
			isMobile,
			fieldsTyping,
			isDirty,
			modalMiniEditor,
			isPanelExplorerOpen,
			isPanelSettingsOpen,
			isEditMode,
			canCloseModal,
			modalDeleteNote,
			activePage,
			pageMode,
			heightToolbar
		} = this.state;

		const fields = this.getFieldsVal(fieldsTyping, course);
		const content = this.getContentVal(fieldsTyping, course);
		const styles = { paddingTop: heightToolbar };
		if (isCourseOneLoading || isCourseAllLoading) { styles.display = 'none'; }

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container-dark')}>
					<ButtonOpenPanelExplorer handleOpenPanel={this.handleOpenPanelExplorer} isPanelOpen={isPanelExplorerOpen} />
					<ButtonOpenPanelSettings handleOpenPanel={this.handleOpenPanelSettings} isPanelOpen={isPanelSettingsOpen} />

					<EditorToolbar
						editorToolbarRef={(el) => { this.editorToolbarRef = el; }}
						course={course}
						isEditing={isEditing}
						isEditMode={isEditMode}
						fields={fields}
						fieldsTyping={fieldsTyping}
						addOrEditMissingField={addOrEditMissingField}
						addOrEditFailure={addOrEditFailure}
						handleClickToolbarMain={this.handleClickToolbarMain}
						handleInputChange={this.handleInputChange}
						handleSave={this.handleSave}
						isDirty={isDirty}
						handleModalOpen_CanClose={this.handleModalOpen_CanClose}
					/>

					<EditorPanelExplorer
						/*ref={(el) => { this.editorPanelExplorerRef = el; }}*/
						isOpen={isPanelExplorerOpen}
						isMobile={isMobile}
						userMe={userMe}
						course={course}
						courses={courses}
						coursesPagesCount={coursesPagesCount}
						isDirty={isDirty}
						handleModalOpen_CanClose={this.handleModalOpen_CanClose}
						activePage={activePage}
						handleActivePageChange={(page) => { this.setState({ activePage: page }); }}
						heightToolbar={heightToolbar}
					/>

					<div className={cx('editor-container-full', isPanelExplorerOpen ? 'panel-explorer-open' : '')} style={styles}>
						{ pageMode === 'md' && (
							<ContainerMd
								editorToolbarMdRef={(el) => { this.editorToolbarMdRef = el; }}
								isCanEdit
								isEditMode={isEditMode}
								handleClickToolbarMarkDown={this.handleClickToolbarMarkDown}
								refEditorMd={(el) => { this.refEditorMd = el; }}
								refPreviewMd={(el) => { this.refPreviewMd = el; }}
								content={content}
								handleSetCodeMirror={this.handleSetCodeMirror}
								{...this.props}
								{...this.state}
							/>
						)}

						{ pageMode === 'wy' && (
							<ContainerTiny
								isCanEdit
								isEditMode={isEditMode}
								content={content}
								handleEditorTinyChange={this.handleEditorTinyChange}
								handleSetTinymce={this.handleSetTinymce}
								{...this.props}
								{...this.state}
							/>
						)}
					</div>

					<EditorPanelSettings
						isOpen={isPanelSettingsOpen}
						course={course}
						isEditing={isEditing}
						fieldsTyping={fieldsTyping}
						fields={fields}
						addOrEditMissingField={addOrEditMissingField}
						addOrEditFailure={addOrEditFailure}
						category={category}
						categories={categories}
						handleInputChange={this.handleInputChange}
						handleSave={this.handleSave}
						pageMode={pageMode}
						handleModalOpen_DeleteNote={this.handleModalOpen_DeleteNote}
						heightEditor={this.state.heightEditor}
						heightToolbar={heightToolbar}
					/>
				</div>

				<BasicModal
					isOpen={modalMiniEditor.isOpened}
					handleModalSetContent={this.handleModalSetContent_MiniEditor}
					handleModalClose={this.handleModalClose_MiniEditor}
					handleModalSubmit={this.handleModalSubmit_MiniEditor}
					title={modalMiniEditor.title}
					description={modalMiniEditor.desc}
					cancelAction="Cancel"
					submitAction="Ok"
					datas={modalMiniEditor}
				/>

				<BasicModal
					isOpen={canCloseModal.isOpen}
					handleModalClose={this.handleModalOnChangePage_CanClose}
					handleModalSubmit={this.handleModalOnSave_CanClose}
					title="Attention"
					description="Changes have not been saved. Do you want to save the note before closing the edition?"
					cancelAction="Close without save"
					submitAction="Save"
				/>

				<BasicModal
					isOpen={modalDeleteNote.isOpen}
					handleModalClose={this.handleModalClose_DeleteNote}
					handleModalSubmit={this.handleModalSubmit_DeleteNote}
					title="Attention"
					description={`This action will be delete the note "${modalDeleteNote.courseToDelete && modalDeleteNote.courseToDelete.title}"`}
					cancelAction="Cancel"
					submitAction="Delete"
				/>
			</LayoutPage>
		);
	}
}

NotePage.propTypes = {
	createCourseAction: PropTypes.func,
	updateCourseAction: PropTypes.func,
	emptyErrorsAction: PropTypes.func,
	fetchCategoriesAction: PropTypes.func,
	deleteCourseAction: PropTypes.func,
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

	isCourseOneLoading: PropTypes.bool,
	isCourseAllLoading: PropTypes.bool,

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
		isCourseOneLoading: state.courses.isCourseOneLoading,
		isCourseAllLoading: state.courses.isCourseAllLoading,
		coursesPagesCount: state.courses.pagesCount,
		userMe: state.userMe.data,
		categories: state.categories.all,
		addOrEditMissingField: state.courses.addOrEditMissingField,
		addOrEditFailure: state.courses.addOrEditFailure
	};
};

export default connect(mapStateToProps, { fetchCourseByFieldAction, createCourseAction, updateCourseAction, emptyErrorsAction, fetchCategoriesAction, deleteCourseAction })(NotePage);
