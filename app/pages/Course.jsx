import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
import katex from 'katex';
import { hljsLoadLanguages } from '../components/common/loadLanguages';
import { Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CourseInfos from '../components/CourseInfos/CourseInfos';
import CoursePage from '../components/CoursePage/CoursePage';


class Course extends Component {
	constructor(props) {
		super(props);

		this.timerRenderPreview = null;
		// this.timerHighlightPreview = null;

		this.state = {
			contentMarkedSanitized: ''
		};
	}

	componentDidMount() {
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

		// Highlight and Katex rendering:
		require('katex/dist/katex.css');

		// TODO    this.props.fetchCourseAction(id: '5454').then(() => {  this.renderCourse();  })    ET remove  componentDidUpdate()
		this.renderCourse();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.course !== this.props.course) this.renderCourse();
	}

	getMetaData() {
		return {
			title: 'Course',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	HighlightRendering() {
		// clearTimeout(this.timerHighlightPreview);
		// this.timerHighlightPreview = setTimeout(() => {
			const code = document.querySelectorAll('pre code');
			for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);
		// }, 1000);
	}

	kaTexRendering() {
		if (this.props.course && this.props.course.content) {
			const valuesKatex = this.props.course.content.match(/(?<=```katex\s).*?(?=\s+```)/gi) || []; // IN
			const katexNode = document.querySelectorAll('.language-katex'); // OUT

			for (let i = 0; i < valuesKatex.length; i++) {
				const text = valuesKatex[i];
				if (katexNode[i]) {
					katex.render(String.raw`${text}`, katexNode[i], { displayMode: true, throwOnError: false });
				}
			}
		}
	}

	renderCourse() {
		this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.course.content || '')) }, () => {
			clearTimeout(this.timerRenderPreview);
			this.timerRenderPreview = setTimeout(() => {
				this.HighlightRendering();
				this.kaTexRendering();
			}, 100);
		});
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
