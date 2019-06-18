import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import marked from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import katex from 'katex';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { HighlightRendering, kaTexRendering } from '../components/common/renderingCourse';
import SectionsGeneratorForScrolling from '../components/common/SectionsGeneratorForScrolling';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction } from '../actions/courses';
import ButtonOpenMenuPanel from '../components/ButtonOpenMenuPanel/ButtonOpenMenuPanel';
import EditorPanelExplorer from '../components/EditorPanelExplorer/EditorPanelExplorer';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { getOptionsFormsSelect } from '../components/EditorPanelExplorer/attributesForms';
import { Form, Button, Modal, Header, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesAddOrEditCourse from './css/courseAddOrEdit.scss';
import stylesCourse from './css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class CourseAddOrEditMd extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClickToolbar = this.handleClickToolbar.bind(this);
		this.handleOpenMenuPanel = this.handleOpenMenuPanel.bind(this);

		// modal:
		this.editorInModalDidMount = this.editorInModalDidMount.bind(this);
		this.handleOpenModalSetStyle = this.handleOpenModalSetStyle.bind(this);
		this.handleCloseModalSetStyle = this.handleCloseModalSetStyle.bind(this);
		this.handleSubmitModalSetStyle = this.handleSubmitModalSetStyle.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleInputModalSetStyleChange = this.handleInputModalSetStyleChange.bind(this);

		// Scroll:
		this.handleScroll = this.handleScroll.bind(this);
		this.timerHandleScroll = null;
		this.scrollingTarget = null;
		this._sectionsForScrolling = null;

		// Scroll sync - when re-rendering in CM editor:
		this.numberViewportChanged = 0;
		this.prevNumberViewportChanged = 0;
		this.prevArrTitlesinEditor = [];

		this.isComponentDidUpdated = false;
		this.rendererMarked = null;
		this.editorCm = null;
		this.editorCmMini = null;
		this.timerRenderPreview = null;
		this.CodeMirror = null;
		this.defaultMessageEditor = `For start to take notes, **remove** this sample content or **modify** this one

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
			// isButtonAutoScrollActive: true,
			isPreviewModeActive: false,
			isMobile: false,
			isMenuPanelOpen: (this.props.location && this.props.location.state && this.props.location.state.isMenuPanelOpen) || false
		};
	}

	componentDidMount() {
		// Resize element child to 100% height:
		this.heightPanel = (this.editorPanelExplorer && ReactDOM.findDOMNode(this.editorPanelExplorer).clientHeight) || 820;
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		// Load highlight.js Languages:
		hljsLoadLanguages(hljs);

		// ##################################### Marked #####################################
		this.rendererMarked = new marked.Renderer();
		marked.setOptions({
			renderer: this.rendererMarked,
			pedantic: false,
			gfm: true,
			tables: true,
			breaks: true,
			sanitize: true,
			smartLists: true,
			smartypants: false,
			xhtml: false
		});

		// ##################################### CodeMirror #####################################
		this.CodeMirror = require('codemirror/lib/codemirror');
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
		require('codemirror/theme/blackboard.css');
		// require('codemirror/theme/mbo.css');
		// require('codemirror/theme/monokai.css');

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

		this.editorCm = this.CodeMirror.fromTextArea(this.refEditor, {
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

		this.editorCm.setValue((this.props.course && this.props.course.content) || '');

		// Highlight and Katex rendering init:
		require('katex/dist/katex.css');
		this.templateRendering();
		this.setStateContentMarkedSanitized({ valueEditor: this.editorCm.getValue() });
		// setTimeout(() => hljs.initHighlighting(), 1000);

		// handleEditorChange:
		this.editorCm.on('change', () => {
			const valueEditor = this.editorCm.getValue();
			const isBigFile = valueEditor.length >= 3000;

			// Init for generate headings wrap:
			this.indexHeader = 0;
			this.headersList = [];

			// ------- Big course -------
			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				if (isBigFile) {
					this.setStateContentMarkedSanitized({ editorCmChanged: true, valueEditor });
				}
			}, 100);

			// ------- Small course -------
			if (!isBigFile) {
				this.setStateContentMarkedSanitized({ editorCmChanged: true, valueEditor });
			}
		});

		// Scroll sync - when re-rendering in CM editor:
		this.editorCm.on('viewportChange', () => { this.numberViewportChanged++; });

		const { heightEditor } = this.getSizeEditor();
		this.editorCm.setSize(null, heightEditor);

		setTimeout(() => this.initScrolling(), 20); // For Firefox because it keep the scroll position after reload
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		if (prevProps.course !== this.props.course) {
			this.isComponentDidUpdated = true;

			// Init for generate headings wrap:
			this.indexHeader = 0;
			this.headersList = [];
			let content = '';

			const numberCoursesMd = this.props.courses && this.props.courses.filter(course => course.type === 'md').length;
			if (numberCoursesMd === 0) {
				content = (this.props.course && this.props.course.content) || this.defaultMessageEditor;
				this.editorCm.setValue(content);
			} else {
				content = (this.props.course && this.props.course.content) || '';
				this.editorCm.setValue(content);
			}

			this.setState({
				isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
				fieldsTyping: {content, template: {}},
				isEditorChanged: false,
				isMenuPanelOpen: false
			});

			const { addOrEditMissingField, addOrEditFailure, emptyErrorsAction } = this.props;

			// Empty the errors when change course or create a new:
			if ((Object.keys(addOrEditMissingField).length > 0) || addOrEditFailure.length > 0) emptyErrorsAction();
		}

		if (this.props.courses && prevProps.courses !== this.props.courses) {
			const numberCoursesMd = this.props.courses && this.props.courses.filter(course => course.type === 'md').length;
			if (numberCoursesMd === 0) {
				this.editorCm.setValue((this.props.course && this.props.course.content) || this.defaultMessageEditor);
			}
		}
	}

	componentWillUnmount() {
		this.updateWindowDimensions();
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getSizeEditor() {
		const heightDocument = (typeof window !== 'undefined' && window.innerHeight) || 500;
		let heightEditor = heightDocument;
		if (this.heightPanel > heightDocument) heightEditor = this.heightPanel;
		heightEditor -= 105;

		return { heightEditor };
	}

	getMetaData() {
		return {
			title: 'Add a Markdown Note',
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

	updateWindowDimensions() {
		const { heightEditor } = this.getSizeEditor();

		if (this.editorCm) this.editorCm.setSize(null, heightEditor);

		if (window.matchMedia('(max-width: 768px)').matches) return this.setState({ heightEditor, isMobile: true });
		this.setState({ heightEditor, isMobile: false });

		// For the cases when we are in the middle of the editor (so we can don't have the first elements in DOM), the elements upper can have the offset changed.
		// Therefore we need to go to the top for re calculate the offsets
		this.initScrolling();
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, courses, userMe, createCourseAction, updateCourseAction, coursesPagesCount, fetchCoursesByFieldAction, paginationEditor, setPaginationCoursesEditorAction } = this.props;
		const { fieldsTyping } = this.state;
		const indexPagination = paginationEditor.lastActivePage;
		const template = (fieldsTyping.template && Object.keys(fieldsTyping.template).length > 0 ? {...course.template, ...fieldsTyping.template} : course && course.template) || {};
		const data = {};

		if (this.state.isEditing) {
			data.fields = {...fieldsTyping, template: { ...template } };
			data.userMeId = userMe._id;
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data)
				.then(() => {
						this.setState({ category: { lastSelected: null }, fieldsTyping: {}, isMenuPanelOpen: false });
					})
				.catch(() => {
					// this.setState({ isMenuPanelOpen: true });
				});
		} else {
			data.fields = fieldsTyping;
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			data.fields.type = 'md';
			createCourseAction(data, coursesPagesCount, indexPagination)
				.then(() => {
					this.setState({ category: { lastSelected: null }, fieldsTyping: {}, isMenuPanelOpen: false });

					// Goto next page if last item:
					if ((courses.length + 1) % 13 === 0) {
						const activePage = indexPagination + 1;

						setPaginationCoursesEditorAction(activePage);
						fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage, showPrivate: true });
					}
				})
				.catch(() => {
					// this.setState({ isMenuPanelOpen: true });
				});
		}
	}

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;

		// Set isPrivate:
		if (field.name === 'isPrivate') {
			return this.setState({ fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.checked } } });
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
			return this.setState({
				fieldsTyping: {...oldStateTyping, template: {...oldStateTyping.template, ...{[field.name]: field.value}} }
			}, () => {
				const content = ((typeof this.state.fieldsTyping.content !== 'undefined') ? this.state.fieldsTyping.content : this.props.course && this.props.course.content) || '';
				return this.setStateContentMarkedSanitized({ valueEditor: content });
			});
		}

		// Set all forms fields except content:
		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}});
	}

	setStyleSelectable(param) {
		// init:
		const chunk = {};
		chunk.selection = this.editorCm.getSelection();
		if (chunk.selection === '') return;

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

	handleOpenModalSetStyle(params) { this.setState({ openModalSetStyle: params }); }
	handleCloseModalSetStyle() { this.setState({ openModalSetStyle: {}, codeLanguageSelected: '', fieldsModalSetStyleTyping: {} }); }

	editorInModalDidMount = (refEditorInModal) => {
		if (refEditorInModal !== null) {
			this.editorCmMini = this.CodeMirror.fromTextArea(refEditorInModal, {
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

	handleSubmitModalSetStyle = (params) => {
		const { codeLanguageSelected, fieldsModalSetStyleTyping } = this.state;
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
					const urlLink = fieldsModalSetStyleTyping.linkifyUrl.indexOf('http') === -1 ? 'http://' + fieldsModalSetStyleTyping.linkifyUrl : fieldsModalSetStyleTyping.linkifyUrl;
					const urlLinkFull = `[${fieldsModalSetStyleTyping.linkifyText}](${urlLink})`;
					this.editorCm.replaceRange('\n' + urlLinkFull + '\n', selPosStart);
					this.setState({ fieldsModalSetStyleTyping: {} });
					break;
				case 'file image outline':
					selPosStart = Object.assign({}, this.editorCm.doc.sel.ranges[0].anchor);
					const urlImage = fieldsModalSetStyleTyping.file.indexOf('http') === -1 ? 'http://' + fieldsModalSetStyleTyping.file : fieldsModalSetStyleTyping.file;
					const urlImageFull = `![](${urlImage})`;
					this.editorCm.replaceRange('\n' + urlImageFull + '\n', selPosStart);
					this.setState({ fieldsModalSetStyleTyping: {} });
					break;
				default:
					break;
			}

			this.handleCloseModalSetStyle();
		};
	};

	handleLanguageChange(event, field) {
		this.setState({ codeLanguageSelected: field.value });
		if (field.value !== 'katex') this.editorCmMini.setOption('mode', field.value);
	}

	handleInputModalSetStyleChange(event, field) {
		this.setState({ fieldsModalSetStyleTyping: { ...this.state.fieldsModalSetStyleTyping, ...{[field.name]: field.value } } });
	}

	handleClickToolbar = clickedButton => () => {
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
			case 'toggle preview':
				this.setState({ isPreviewModeActive: !this.state.isPreviewModeActive });
				break;
			default:
				break;
		}
	};

	handleOpenMenuPanel() {
		this.setState({ isMenuPanelOpen: !this.state.isMenuPanelOpen });
	}

	initScrolling() {
		if (this.state.isMobile || this.state.isPreviewModeActive || !this.editorCm) return;

		// Init scroll sync - use when re-rendering in CM editor:
		this.numberViewportChanged = 0;
		this.prevNumberViewportChanged = 0;
		this.prevArrTitlesinEditor = [];

		this.editorCm.refresh();
		this.refContentPreview.scrollTop = 0;
		this.editorCm.getScrollerElement().scrollTop = 0;

		this._sectionsForScrolling = {
			editor: SectionsGeneratorForScrolling.getOffsetTopTitles(this.editorCm.getScrollerElement()),
			preview: SectionsGeneratorForScrolling.getOffsetTopTitles(this.refContentPreview)
		};
	}

	setStateContentMarkedSanitized(params = {}) {
		const content = ((typeof params.valueEditor !== 'undefined') ? params.valueEditor : this.props.course && this.props.course.content) || '';
		const oldStateTyping = this.state.fieldsTyping;
		const contentMarkedSanitized = DOMPurify.sanitize(marked(content || ''));

		this.setState({
			contentMarkedSanitized,
			fieldsTyping: {...oldStateTyping, ...{ content: params.valueEditor }},
			isEditorChanged: params.editorCmChanged
		}, () => {
			if (this.isComponentDidUpdated) {
				this.initScrolling();
				this.isComponentDidUpdated = false;
			}
			HighlightRendering(hljs);
			kaTexRendering(katex, params.valueEditor);
		});
	}

	get sections() {
		const isFirstTimeScrolled = this._sectionsForScrolling === null;
		const haveNewViewportInEditor = this.numberViewportChanged > this.prevNumberViewportChanged;

		if (isFirstTimeScrolled || haveNewViewportInEditor) {
			const titlesInEditor = SectionsGeneratorForScrolling.getOffsetTopTitles(this.editorCm.getScrollerElement(), haveNewViewportInEditor, this.prevArrTitlesinEditor);

			this._sectionsForScrolling = {
				editor: titlesInEditor,
				preview: SectionsGeneratorForScrolling.getOffsetTopTitles(this.refContentPreview)
			};

			this.prevNumberViewportChanged = this.numberViewportChanged;
			this.prevArrTitlesinEditor = titlesInEditor;
		}

		return this._sectionsForScrolling;
	}

	handleScroll(source) {
		return (e) => {
			return; // TODO disable sync scroll for the moment

			if (e.target.scrollTop === 0 || this.state.isMobile || this.state.isPreviewModeActive) return; // (e.target.scrollTop === 0) ==>  When typing, we pass in onScroll :(

			this.resetTargetScrolling(); // For re enable the other container to scroll

			const target = source === 'preview' ? 'editor' : 'preview';
			const scrollTopTarget = SectionsGeneratorForScrolling.getScrollPosition(e.target.scrollTop, this.sections[source], this.sections[target]);

			// If error (scrolled to fast)
			if (scrollTopTarget === false) {
				console.error('Error, scroll too fast');
				setTimeout(() => this.initScrolling(), 20);
				return;
			}

			if (this.scrollingTarget === null) this.scrollingTarget = source;
			if (/* !this.state.isButtonAutoScrollActive || */this.scrollingTarget !== source) return;

			if (source === 'editor') {
				this.refContentPreview.scrollTop = scrollTopTarget;
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

	render() {
		const { course, courses, coursesPagesCount, addOrEditMissingField, addOrEditFailure, categories, userMe, paginationEditor } = this.props;
		const { contentMarkedSanitized, category, isEditing, fieldsTyping, fieldsModalSetStyleTyping, heightEditor, openModalSetStyle, codeLanguageSelected, isEditorChanged, isPreviewModeActive, isMobile, isMenuPanelOpen } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const { codeLanguagesOptions } = getOptionsFormsSelect({ categories, course, category, isEditing });

		const buttonsToolbar = [
			{ icon: 'bold', content: 'Bold' },
			{ icon: 'italic', content: 'Italic' },
			{ icon: 'header', content: 'Header' },
			{ icon: 'strikethrough', content: 'Strikethrough' },
			{ icon: 'unordered list', content: 'Unordered list' },
			{ icon: 'ordered list', content: 'Ordered list' },
			{ icon: 'check square', content: 'Check list' },
			{ icon: 'quote left', content: 'Quote left' }
		];
		const buttonsForPopupToolbar = [
			{ icon: 'code', content: 'Add a code' },
			{ icon: 'table', content: 'Add a table' },
			{ icon: 'linkify', content: 'Add a link' },
			{ icon: 'file image outline', content: 'Add image' }
		];

		// Styles css:
		const stylesEditor = {};
		const stylesPreview = { height: heightEditor + 'px' };

		if (isPreviewModeActive) {
			stylesEditor.display = 'none';
			stylesPreview.display = 'block';
		}

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container-light')}>
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
						handleClickToolbar={this.handleClickToolbar}
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
						<div className={cx('toolbar-editor-md')}>
							{ !isPreviewModeActive ? (
								<Button.Group basic size="small" className={cx('button-group')}>
									{ buttonsToolbar.map((button, key) => (<Popup trigger={<Button icon={button.icon} basic className={cx('button')} onClick={this.handleClickToolbar(button.icon)} />} content={button.content} key={key} />)) }
								</Button.Group>
							) : '' }

							{ !isPreviewModeActive ? (
								<Button.Group basic size="small" className={cx('button-group')}>
									{ buttonsForPopupToolbar.map((button, key) => <Button key={key} icon={button.icon} basic className={cx('button')} onClick={this.handleClickToolbar(button.icon)} />) }
								</Button.Group>
							) : '' }

							{ !isPreviewModeActive && !isMobile ? (
								<Button.Group basic size="small" className={cx('button-group')}>
									{/* <Popup trigger={<Button toggle icon="lock" basic className={cx('button')} active={isButtonAutoScrollActive} onClick={this.handleClickToolbar('auto scoll')} />} content="toggle scroll sync" /> */}
								</Button.Group>
							) : '' }
						</div>

						<div className={cx('md-editor-container')}>
							<div className={cx('editor-edition')} style={stylesEditor} onScroll={this.handleScroll('editor')}>
								<Form error={addOrEditMissingField.content} size="small">
									<textarea ref={(el) => { this.refEditor = el; }} name="editorCm" />
									{/*
									<Form.TextArea placeholder="The content of your course..." name="content" value={fields.content || ''} error={addOrEditMissingField.content} onChange={this.handleInputChange} style={{ height: (heightEditor) + 'px' }} />
									<Message error content="the content is required" className={cx('editor-edition-error-message')} />
									*/}
								</Form>
							</div>

							<div className={cx('container-page-dark', 'preview')} id="preview" style={stylesPreview} dangerouslySetInnerHTML={{ __html: contentMarkedSanitized }} ref={(el) => { this.refContentPreview = el; }} onScroll={this.handleScroll('preview')} />
						</div>
					</div>
				</div>

				<Modal open={openModalSetStyle.isOpened} onClose={this.handleCloseModalSetStyle}>
					<Modal.Header>{openModalSetStyle.title}</Modal.Header>
					<Modal.Content image>
						<Modal.Description>
							<Header>{openModalSetStyle.desc}</Header>

							{ openModalSetStyle.type === 'code' ? (
								<Form size="small">
									<Form.Select label="Language" options={codeLanguagesOptions} placeholder="Choose a language" width={4} name="language" value={codeLanguageSelected || ''} onChange={this.handleLanguageChange} />
									<textarea ref={this.editorInModalDidMount} name="editorCmMini" defaultValue="Write you code here" />
								</Form>
							) : '' }

							{ openModalSetStyle.type === 'table' ? (
								<div>coming soon</div>
							) : '' }

							{ openModalSetStyle.type === 'linkify' ? (
								<Form size="small">
									<Form.Group widths="equal">
										<Form.Input label="Link text" placeholder="My site" name="linkifyText" value={fieldsModalSetStyleTyping.linkifyText || ''} onChange={this.handleInputModalSetStyleChange} />
										<Form.Input label="URL" placeholder="www.mywebsite.com" name="linkifyUrl" value={fieldsModalSetStyleTyping.linkifyUrl || ''} onChange={this.handleInputModalSetStyleChange} />
									</Form.Group>
								</Form>
							) : '' }

							{ openModalSetStyle.type === 'file image outline' ? (
								<Form size="small">
									<Form.Input label="Add a image" placeholder="https://mywebsite/images/1.jpg" name="file" value={fieldsModalSetStyleTyping.file || ''} onChange={this.handleInputModalSetStyleChange} />
								</Form>
							) : '' }

						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color="black" onClick={this.handleCloseModalSetStyle}>Cancel</Button>
						<Button icon="checkmark" color="red" labelPosition="right" content="Ok" onClick={this.handleSubmitModalSetStyle(openModalSetStyle)} />
					</Modal.Actions>
				</Modal>
			</LayoutPage>
		);
	}
}

CourseAddOrEditMd.propTypes = {
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

export default connect(mapStateToProps, { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction, setPaginationCoursesEditorAction })(CourseAddOrEditMd);
