import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TinyEditor from '../../components/TinyEditor/TinyEditor';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});
let tinymce;

class EditorTiny extends Component {
	componentDidMount() {
		if (this.props.assetsTinyMceLoaded) { return; }

		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			tinymce = require('tinymce');
			require('tinymce/themes/silver');
			require('tinymce/plugins/wordcount');
			require('tinymce/plugins/table');
			require('tinymce/plugins/codesample');
			require('tinymce/plugins/link');
			require('tinymce/plugins/image');
			require('tinymce/plugins/textcolor');

			this.props.handleSetAssetsTinyMceLoaded();
		}
	}

	render() {
		const { content, handleEditorChange, heightEditor } = this.props;

		return (
			<div className={cx('editor-edition')}>
				{
					tinymce && (
						<TinyEditor
							id="tinyEditor"
							onEditorChange={handleEditorChange}
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
	handleEditorChange: PropTypes.func,
	heightEditor: PropTypes.number,
	content: PropTypes.string,
	assetsTinyMceLoaded: PropTypes.bool,
	handleSetAssetsTinyMceLoaded: PropTypes.func
};

export default EditorTiny;
