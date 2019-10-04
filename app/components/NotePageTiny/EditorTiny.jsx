import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class EditorTiny extends Component {
	render() {
		const { content, handleEditorChange, tinymce, heightEditor, idEditor } = this.props;

		return (
			<div className={cx('editor-edition')}>
				Editor
				{/*
				<TinyEditor
					id={idEditor}
					onEditorChange={handleEditorChange}
					content={content}
					tinymce={tinymce}
					heightDocument={heightEditor}
				/>
				*/}
			</div>
		);
	}
}

EditorTiny.propTypes = {
	content: PropTypes.string
};

export default EditorTiny;
