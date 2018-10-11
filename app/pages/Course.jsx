import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/highlight.js';
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
		// ##################################### highlight.js #####################################
		hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
		hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
		hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
		hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
		hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
		hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
		hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'));
		hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'));
		hljs.registerLanguage('haml', require('highlight.js/lib/languages/haml'));
		hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
		hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
		hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
		hljs.registerLanguage('go', require('highlight.js/lib/languages/go'));
		hljs.registerLanguage('htmlbars', require('highlight.js/lib/languages/htmlbars'));
		hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
		hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
		hljs.registerLanguage('mathematica', require('highlight.js/lib/languages/mathematica'));

		require('highlight.js/styles/paraiso-dark.css');
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
		// TODO    this.props.fetchCourseAction(id: '5454').then(() => {  this.getContentSanitized();  })    ET remove  componentDidUpdate()
		this.getContentSanitized();
	}

	componentDidUpdate(prevProps) {
		const { course } = this.props;
		if (prevProps.course !== course) {
			// Re highlight code:
			clearTimeout(this.timerHighlightPreview);
			this.timerHighlightPreview = setTimeout(() => {
				const code = document.querySelectorAll('pre code');
				for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);
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
