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
		if (this.props.tinymce) { return; }

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			const tinymce = require('tinymce');
			require('tinymce/themes/silver');
			require('tinymce/plugins/wordcount');
			require('tinymce/plugins/table');
			require('tinymce/plugins/codesample');
			require('tinymce/plugins/link');
			require('tinymce/plugins/image');
			require('tinymce/plugins/textcolor');

			this.props.handleSetTinymce(tinymce);
		}
	}

	render() {
		const { content, handleEditorTinyChange, heightEditor, tinymce } = this.props;

		return (
			<div className={cx('editor-edition')}>
				{
					tinymce && (
						<TinyEditor
							id="tinyEditor"
							onEditorChange={handleEditorTinyChange}
							content={content}
							tinymce={tinymce}
							heightDocument={heightEditor}
						/>
					)
				}
			</div>
		);
	}
}

EditorTiny.propTypes = {
	tinymce: PropTypes.any,
	handleSetTinymce: PropTypes.func,
	content: PropTypes.string,
	handleEditorTinyChange: PropTypes.func,
	heightEditor: PropTypes.number
};

export default EditorTiny;
