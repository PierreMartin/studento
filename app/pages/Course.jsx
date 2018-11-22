import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import katex from 'katex';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { HighlightRendering, kaTexRendering } from '../components/common/renderingCourse';
import { Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CourseInfos from '../components/CourseInfos/CourseInfos';
import CoursePage from '../components/CoursePage/CoursePage';


class Course extends Component {
	constructor(props) {
		super(props);
		this.rendererMarked = null;
		this.timerRenderPreview = null;

		// Init for generate headings wrap:
		this.indexHeader = 0;
		this.headersList = [];

		this.state = {
			contentMarkedSanitized: ''
		};
	}

	componentDidMount() {
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

		// Highlight and Katex rendering:
		require('katex/dist/katex.css');

		// TODO    this.props.fetchCourseAction(id: '5454').then(() => {  this.setStateContentMarkedSanitized();  })    ET remove  componentDidUpdate();

		this.templateRendering();
		this.setStateContentMarkedSanitized();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.course !== this.props.course) {
			// Init for generate headings wrap:
			this.indexHeader = 0;
			this.headersList = [];

			this.setStateContentMarkedSanitized();
		}
	}

	getMetaData() {
		return {
			title: 'Course',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	setStateContentMarkedSanitized() {
		this.setState({
			contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.course.content || ''))
		}, () => {
			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				if (this.props.course && this.props.course.content) {
					HighlightRendering(hljs);
					kaTexRendering(katex, this.props.course.content);
				}
			}, 100);
		});
	}

	templateRendering() {
		this.rendererMarked.heading = (text, currenLevel) => {
			const template = this.props.course && this.props.course.template;
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
		const { course } = this.props;
		const { contentMarkedSanitized } = this.state;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<CourseInfos course={course} />
						<CoursePage contentMarkedSanitized={contentMarkedSanitized} />
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Course.propTypes = {
	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		category_info: (PropTypes.shape({
			description: PropTypes.string,
			key: PropTypes.string,
			name: PropTypes.string,
			picto: PropTypes.string
		})),
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one
	};
};

export default connect(mapStateToProps, null)(Course);
