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
import { addCommentAction } from '../actions/courses';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CourseInfos from '../components/CourseInfos/CourseInfos';
import CoursePage from '../components/CoursePage/CoursePage';
import Comments from '../components/Comments/Comments';


class Course extends Component {
	constructor(props) {
		super(props);
		this.handleInputCommentChange = this.handleInputCommentChange.bind(this);
		this.handleInputCommentSubmit = this.handleInputCommentSubmit.bind(this);
		this.handleReplyCommentClick = this.handleReplyCommentClick.bind(this);

		this.rendererMarked = null;
		this.timerRenderPreview = null;

		// Init for generate headings wrap:
		this.indexHeader = 0;
		this.headersList = [];

		this.state = {
			contentMarkedSanitized: '',
			fieldsTypingComment: {},
			indexCommentToReply: undefined
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

	handleInputCommentChange(e, field) {
		const oldStateTypingComment = this.state.fieldsTypingComment;
		this.setState({ fieldsTypingComment: {...oldStateTypingComment, ...{[field.name]: field.value} } });
	}

	handleInputCommentSubmit(replyToCommentId) {
		return (event) => {
			event.preventDefault();

			const { course, userMe } = this.props;
			const { fieldsTypingComment } = this.state;

			const data = {
				courseId: course._id,
				content: (typeof replyToCommentId !== 'undefined') ? fieldsTypingComment.commentReply : fieldsTypingComment.commentMain,
				uId: userMe._id,
				at: new Date().toISOString(),
				replyToCommentId: (typeof replyToCommentId !== 'undefined') ? replyToCommentId : undefined
			};

			this.props.addCommentAction(data);
			this.setState({ fieldsTypingComment: {} });
		};
	}

	/**
	 * Set the index of the comment clicked for reply
	 * @param {number} index - the index of the comment
	 * @returns {function(): void}
	 */
	handleReplyCommentClick(index) {
		let uIndex = index;

		// If second click on the same comment, we remove the form:
		if (index === this.state.indexCommentToReply) {
			uIndex = undefined;
		}

		return () => this.setState({ indexCommentToReply: uIndex });
	}

	render() {
		const { course, authentification } = this.props;
		const { contentMarkedSanitized, fieldsTypingComment, indexCommentToReply } = this.state;
		const commentedBy = course.commentedBy || [];

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<CourseInfos course={course} />
						<CoursePage contentMarkedSanitized={contentMarkedSanitized} />
						<Comments
							commentedBy={commentedBy}
							authentification={authentification}
							handleInputCommentChange={this.handleInputCommentChange}
							handleInputCommentSubmit={this.handleInputCommentSubmit}
							fieldsTypingComment={fieldsTypingComment}
							handleReplyCommentClick={this.handleReplyCommentClick}
							indexCommentToReply={indexCommentToReply}
						/>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Course.propTypes = {
	addCommentAction: PropTypes.func,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		commentedBy: PropTypes.array,
		category_info: (PropTypes.shape({ // populate
			description: PropTypes.string,
			key: PropTypes.string,
			name: PropTypes.string,
			picto: PropTypes.string
		})),
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	}),

	authentification: PropTypes.object
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one,
		userMe: state.userMe.data,
		authentification: state.authentification
	};
};

export default connect(mapStateToProps, { addCommentAction })(Course);
