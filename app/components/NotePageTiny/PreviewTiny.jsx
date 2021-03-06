import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { loadHighlightAssets } from '../common/loadLanguages';
import hljs from 'highlight.js/lib/highlight';
import { HighlightRendering } from '../common/renderingCourse';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class PreviewTiny extends Component {
	constructor(props) {
		super(props);

		this.timerRenderHighlight = null;

		this.state = {
			contentMarkedSanitized: ''
		};
	}

	componentDidMount() {
		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(this.props.content)});
			loadHighlightAssets(hljs); // Load highlight
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.content !== this.props.content) {
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(this.props.content)});
		}
	}

	render() {
		const { heightEditor } = this.props;
		const { contentMarkedSanitized } = this.state;

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			clearTimeout(this.timerRenderHighlight);
			this.timerRenderHighlight = setTimeout(() => {
				HighlightRendering(hljs); // Rendering highlight
			}, 900);
		}

		return (
			<div
				className={cx('container-page-dark', 'preview')}
				style={{ height: heightEditor + 'px' }}
				id="container-page-view"
				dangerouslySetInnerHTML={{ __html: contentMarkedSanitized }}
			/>
		);
	}
}

PreviewTiny.propTypes = {
	content: PropTypes.string
};

export default PreviewTiny;
