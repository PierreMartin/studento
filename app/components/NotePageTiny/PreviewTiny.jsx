import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { loadHighlightAssets } from '../common/loadLanguages';
import hljs from 'highlight.js/lib/highlight';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class PreviewTiny extends Component {
	constructor(props) {
		super(props);

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
		const { contentMarkedSanitized } = this.state;

		return (
			<div
				className={cx('container-page-dark', 'preview')}
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
