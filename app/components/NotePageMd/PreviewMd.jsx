import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import marked from 'marked';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesAddOrEditCourse from '../../pages/css/courseAddOrEdit.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class PreviewMd extends Component {
	constructor(props) {
		super(props);

		this.state = {
			contentMarkedSanitized: ''
		};
	}

	componentDidMount() {
		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.content))});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.content !== this.props.content) {
			this.setState({ contentMarkedSanitized: DOMPurify.sanitize(marked(this.props.content))});
		}
	}

	render() {
		const { isEditMode, heightEditor, refPreviewMd } = this.props;
		const { contentMarkedSanitized } = this.state;

		const stylesPreview = { height: heightEditor + 'px' };
		if (isEditMode) {
			stylesPreview.flex = '1 0 47%';
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
