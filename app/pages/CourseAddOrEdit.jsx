import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
// import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import katex from 'katex';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { Link } from 'react-router';
import { createCourseAction, updateCourseAction, fetchCoursesByFieldAction, emptyErrorsAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { List, Form, Message, Button, Popup, Pagination, Icon, Modal, Header, Segment, Select } from 'semantic-ui-react';
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

		// modal:
		this.editorInModalDidMount = this.editorInModalDidMount.bind(this);
		this.handleOpenModalSetStyle = this.handleOpenModalSetStyle.bind(this);
		this.handleCloseModalSetStyle = this.handleCloseModalSetStyle.bind(this);
		this.handleSubmitModalSetStyle = this.handleSubmitModalSetStyle.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleInputModalSetStyleChange = this.handleInputModalSetStyleChange.bind(this);

		this.editorCm = null;
		this.editorCmMini = null;
		this.timerRenderPreview = null;
		this.CodeMirror = null;

		this.state = {
			fieldsTyping: {
				template: {}
			},
			fieldsModalSetStyleTyping: {},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			heightDocument: 0,
			pagination: {
				indexPage: 1
			},
			clickedCourse: 0,
			openModalSetStyle: {},
			codeLanguageSelected: ''
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
		const renderer = new marked.Renderer();
		marked.setOptions({
			renderer,
			pedantic: false,
			gfm: true,
			tables: true,
			breaks: true,
			sanitize: true,
			smartLists: true,
			smartypants: false,
			xhtml: false
		});

		this.templateRendering(renderer);

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

		this.editorCm = this.CodeMirror.fromTextArea(this.refEditor, {
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

		// Highlight and Katex rendering init:
		require('katex/dist/katex.css');
		setTimeout(() => hljs.initHighlighting(), 1000);
		setTimeout(() => this.kaTexRendering(this.editorCm.getValue()), 1000);

		// handleEditorChange:
		this.editorCm.on('change', () => {
			const oldStateTyping = this.state.fieldsTyping;
			const valueEditor = this.editorCm.getValue();
			const isBigFile = valueEditor.length >= 3000;

			// ------- Big course -------
			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				if (isBigFile) {
					this.setState({ fieldsTyping: {...oldStateTyping, ...{ content: valueEditor }} }, () => {
						this.HighlightRendering();
						this.kaTexRendering(valueEditor);
					});
				}
			}, 200);

			// ------- Small course -------
			if (!isBigFile) {
				this.setState({ fieldsTyping: {...oldStateTyping, ...{ content: valueEditor }} }, () => {
					this.HighlightRendering();
					this.kaTexRendering(valueEditor);
				});
			}
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
				fieldsTyping: {
					template: {}
				}
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

		if (/^column/g.test(field.name)) {
			return this.setState({ fieldsTyping: {...oldStateTyping, template: {...oldStateTyping.template, ...{[field.name]: field.value}} } });
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

	templateRendering(renderer) {
		let indexHeader = 0;
		let headersList = [];

		renderer.heading = (text, currenLevel) => {
			const content = ((typeof this.state.fieldsTyping.content !== 'undefined') ? this.state.fieldsTyping.content : this.props.course && this.props.course.content) || '';
			const template = (this.state.fieldsTyping.template && Object.keys(this.state.fieldsTyping.template).length > 0 ? {...this.props.course.template, ...this.state.fieldsTyping.template} : this.props.course && this.props.course.template) || {};
			const arrMatchHeaders = typeof content === 'string' ? content.match(/^ {0,3}(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)|^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/gmi) : null;
			const numberHeaders = arrMatchHeaders !== null ? arrMatchHeaders.length : 0;
			const numberColumns = template['columnH' + currenLevel];
			let closeDivNode = '';

			// 1st header:
			if (indexHeader === 0) {
				headersList.push({ levelHeader: currenLevel });
				indexHeader++;

				if (indexHeader === numberHeaders) {
					indexHeader = 0;
					headersList = [];
				}

				return `
					${closeDivNode}
					<div class="md-column-${numberColumns}">
						<h${currenLevel}>${text}</h${currenLevel}>
				`;
			}

			const lastLevelHeader = headersList[headersList.length - 1].levelHeader;
			const diffLevelWithLastHeader = Math.abs(lastLevelHeader - currenLevel);

			for (let i = headersList.length - 1; i >= 0; i--) {
				const alreadyHaveLevelHeader = headersList[i].levelHeader === currenLevel;

				// Close when same header in same level imbrication:
				if (alreadyHaveLevelHeader && diffLevelWithLastHeader === 0) {
					closeDivNode = '</div>';
				}

				// Close when different header:
				if (lastLevelHeader > currenLevel && currenLevel === headersList[i].levelHeader) {
					for (let j = 0; j < diffLevelWithLastHeader; j++) closeDivNode += '</div>';
					break;
				} else if (lastLevelHeader > currenLevel) {
					closeDivNode = '</div>';
				}
			}

			headersList.push({ levelHeader: currenLevel });
			indexHeader++;

			if (indexHeader === numberHeaders) {
				indexHeader = 0;
				headersList = [];
			}

			return `
				${closeDivNode}
				<div class="md-column-${numberColumns}">
					<h${currenLevel}>${text}</h${currenLevel}>
			`;
		};
	}

	HighlightRendering() {
		const code = this.refPreview.querySelectorAll('pre code');
		for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);
	}

	kaTexRendering(valueEditor) {
		const katexNode = this.refPreview.querySelectorAll('.language-katex'); // OUT

		const valuesKatex = valueEditor.match(/(?<=```katex\s+)(.[\s\S]*?)(?=\s+```)/gi) || []; // IN
		for (let i = 0; i < valuesKatex.length; i++) {
			const text = valuesKatex[i];
			if (katexNode[i]) {
				const macros = {
					'\\f': 'f(#1)',
					'\\RR': '\\mathbb{R}'
				};
				katex.render(String.raw`${text}`, katexNode[i], { displayMode: true, throwOnError: false, macros });
			}
		}
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
				theme: 'pastel-on-dark',
				mode: 'javascript'
			});
		}
	}

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
			default:
				break;
		}
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
		const { category, isEditing, fieldsTyping, fieldsModalSetStyleTyping, heightDocument, pagination, openModalSetStyle, codeLanguageSelected } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const messagesError = this.dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
		const { categoriesOptions, subCategoriesOptions, codeLanguagesOptions, columnsOptions } = this.getOptionsFormsSelect();
		const isDisableButtonSubmit = isEditing && !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && !fieldsTyping.isPrivate && (!fieldsTyping.template || (fieldsTyping.template && Object.keys(fieldsTyping.template).length === 0));

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
						<div className={cx('editor-toolbar')}>
							<Button.Group basic size="small">
								{ buttonsToolbar.map((button, key) => (<Popup trigger={<Button icon={button.icon} basic inverted className={cx('button')} onClick={this.handleClickToolbar(button.icon)} />} content={button.content} key={key} />)) }
							</Button.Group>
							<Button.Group basic size="small">
								{ buttonsForPopupToolbar.map((button, key) => <Button key={key} icon={button.icon} basic inverted className={cx('button')} onClick={this.handleClickToolbar(button.icon)} />) }
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
