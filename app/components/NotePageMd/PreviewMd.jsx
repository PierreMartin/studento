import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import marked from 'marked';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesAddOrEditCourse from '../../pages/css/courseAddOrEdit.scss';
import stylesCourse from '../../pages/css/course.scss';
import katex from 'katex';
import hljs from 'highlight.js/lib/highlight';
import { HighlightRendering, kaTexRendering } from '../common/renderingCourse';
import { loadHighlightAssets } from '../common/loadLanguages';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class PreviewMd extends Component {
	constructor(props) {
		super(props);

		this.timerRenderHighlight = null;

		// Init for generate headings wrap:
		this.indexHeader = 0;
		this.headersList = [];

		this.state = {
			contentMarkedSanitized: ''
		};
	}

	componentDidMount() {
		require('katex/dist/katex.css'); // Load Katex
		loadHighlightAssets(hljs); // Load highlight

		// Marked:
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

		this.templateRendering(); // Rendering headers columns

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.content))});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.content !== this.props.content) {
			this.indexHeader = 0;
			this.headersList = [];
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.content))});
		}
	}

	templateRendering() {
		this.rendererMarked.heading = (text, currenLevel) => {
			// TODO call function here for externaliser avec Course.jsx   rendererMarkedHeading(this.indexHeader, this.headersList);
			let template = {};
			if (this.props.fieldsTyping.template && Object.keys(this.props.fieldsTyping.template).length > 0) {
				template = {...this.props.course.template, ...this.props.fieldsTyping.template};
			} else {
				template = (this.props.course && this.props.course.template) || {};
			}

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

	render() {
		const { isEditMode, heightEditor, refPreviewMd } = this.props;
		const { contentMarkedSanitized } = this.state;

		const stylesPreview = { height: heightEditor + 'px' };
		if (isEditMode) {
			stylesPreview.flex = '1 0 47%';
		}

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			clearTimeout(this.timerRenderHighlight);
			this.timerRenderHighlight = setTimeout(() => {
				HighlightRendering(hljs); // Rendering highlight
				kaTexRendering(katex, this.state.contentMarkedSanitized);
			}, 200);
		}

		return (
			<div
				className={cx('container-page-dark', 'preview')}
				id="preview"
				ref={refPreviewMd}
				style={stylesPreview}
				dangerouslySetInnerHTML={{ __html: contentMarkedSanitized }}
				// onScroll={handleScroll('preview')}
			/>
		);
	}
}

PreviewMd.propTypes = {
	//
};

const mapStateToProps = (state) => {
	return {
		//
	};
};

export default connect(null, null)(PreviewMd);
