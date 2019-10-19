import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TinyEditor from '../../components/TinyEditor/TinyEditor';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class EditorTiny extends Component {
	componentDidMount() {
		if (this.props.tinyMceLib) { return; }
		debugger;

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			const tinyMceLib = require('tinymce');
			require('tinymce/themes/silver');
			require('tinymce/plugins/wordcount');
			require('tinymce/plugins/table');
			require('tinymce/plugins/codesample');
			require('tinymce/plugins/link');
			require('tinymce/plugins/image');
			require('tinymce/plugins/textcolor');

			this.props.handleSetTinymce(tinyMceLib);
		}
	}

	render() {
		const { content, handleEditorTinyChange, heightEditor, tinyMceLib } = this.props;

		return (
			<div className={cx('editor-edition')}>
				{
					tinyMceLib && (
						<TinyEditor
							id="tinyEditor"
							onEditorChange={handleEditorTinyChange}
							content={content}
							tinyMceLib={tinyMceLib}
							heightDocument={heightEditor}
						/>
					)
				}
			</div>
		);
	}
}

EditorTiny.propTypes = {
	tinyMceLib: PropTypes.any,
	handleSetTinymce: PropTypes.func,
	handleUnsetTinymce: PropTypes.func,
	content: PropTypes.string,
	handleEditorTinyChange: PropTypes.func,
	heightEditor: PropTypes.number
};

export default EditorTiny;
