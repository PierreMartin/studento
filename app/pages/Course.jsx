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

		this.timerHighlightPreview = null;

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
		setTimeout(() => hljs.initHighlighting(), 1000); // TODO enlever les timeout (et call dans le callback de this.setState() ?? ou dans le render si contentMarkedSanitized.length > 0 ?? )
		setTimeout(() => this.kaTexRendering(), 1000);

		// TODO    this.props.fetchCourseAction(id: '5454').then(() => {  this.getContentSanitized();  })    ET remove  componentDidUpdate()
		this.getContentSanitized();
	}

	componentDidUpdate(prevProps) {
		const { course } = this.props;
		if (prevProps.course !== course) {
			clearTimeout(this.timerHighlightPreview);
			this.timerHighlightPreview = setTimeout(() => {
				// Re render highlight code:
				const code = document.querySelectorAll('pre code');
				for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);

				// Re render Katex:
				this.kaTexRendering();
			}, 1000);

			// Sanitize mardown:
			this.getContentSanitized();
		}
	}

	getContentSanitized() {
		const { course } = this.props;
		this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(course.content || '')) });
	}

	getMetaData() {
		return {
			title: 'Course',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	kaTexRendering() {
		const languageKatexNode = document.querySelectorAll('.language-katex');

		for (let i = 0; i < languageKatexNode.length; i++) {
			const text = languageKatexNode[i].innerText;
			katex.render(String.raw`${text}`, languageKatexNode[i], { displayMode: true, throwOnError: false });
		}
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
