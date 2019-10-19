import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class EditorMd extends Component {
	componentDidMount() {
		if (this.props.codeMirror) { return; }

		const codeMirror = require('codemirror/lib/codemirror'); // codeMirrorLib
		require('codemirror/lib/codemirror.css');

		// Addon JS:
		require('codemirror/addon/dialog/dialog.js');
		require('codemirror/addon/search/matchesonscrollbar.js');
		require('codemirror/addon/fold/foldgutter.js');
		require('codemirror/addon/fold/foldcode.js');
		require('codemirror/addon/fold/brace-fold.js');
		require('codemirror/addon/fold/comment-fold.js');
		require('codemirror/addon/fold/indent-fold.js');
		require('codemirror/addon/fold/markdown-fold.js');
		require('codemirror/addon/fold/xml-fold.js');
		require('codemirror/addon/edit/closebrackets.js');

		// Addon CSS:
		require('codemirror/addon/dialog/dialog.css');
		require('codemirror/addon/search/matchesonscrollbar.css');
		require('codemirror/addon/fold/foldgutter.css');

		// Theme CSS:
		require('codemirror/theme/blackboard.css');
		// require('codemirror/theme/mbo.css');
		// require('codemirror/theme/monokai.css');

		// keyMap:
		require('codemirror/keymap/sublime.js');

		// modes:
		require('codemirror/mode/markdown/markdown');
		require('codemirror/mode/javascript/javascript');
		require('codemirror/mode/php/php');
		require('codemirror/mode/gfm/gfm');
		require('codemirror/mode/python/python');
		require('codemirror/mode/ruby/ruby');
		require('codemirror/mode/sass/sass');
		require('codemirror/mode/shell/shell');
		require('codemirror/mode/sql/sql');
		require('codemirror/mode/stylus/stylus');
		require('codemirror/mode/xml/xml');
		require('codemirror/mode/coffeescript/coffeescript');
		require('codemirror/mode/css/css');
		require('codemirror/mode/cmake/cmake');
		require('codemirror/mode/htmlmixed/htmlmixed');
		require('codemirror/mode/mathematica/mathematica');

		this.props.handleSetCodeMirror(codeMirror);
	}

	render() {
		const { content, refEditorMd } = this.props;

		return (
			<div
				className={cx('editor-edition')}
				// onScroll={handleScroll('editor')}
			>
				<Form size="small">
					<textarea ref={refEditorMd} name="editorCm" id="editorMd" value={content} onChange={() => {}} />
				</Form>
			</div>
		);
	}
}

EditorMd.propTypes = {
	codeMirror: PropTypes.any,
	handleSetCodeMirror: PropTypes.func,
	content: PropTypes.string,
	refEditorMd: PropTypes.any
};

export default EditorMd;
