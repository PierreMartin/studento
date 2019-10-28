import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage, ...stylesCourse});

class EditorTiny extends Component {
	constructor(props) {
		super(props);

		this.idEditor = 'tinyEditor';

		this.state = {
			editor: null
		};
	}

	tinyMceInit() {
		const { handleEditorTinyChange, heightEditor, tinyMceLib } = this.props;

		let menubar = true;
		let plugins = 'link image table codesample textcolor tiny_mce_wiris';
		let toolbar = 'undo redo | bold italic | alignleft aligncenter alignright | codesample | table | formatselect | forecolor backcolor | image | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry';
		let pluginWiris = { tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js' };

		// Mobile:
		if (window.matchMedia('(max-width: 410px)').matches) {
			menubar = false;
			plugins = 'link image table textcolor';
			toolbar = 'bold italic | alignleft aligncenter alignright | table | forecolor backcolor | image';
			pluginWiris = {};
		}

		tinyMceLib.init({
			min_height: heightEditor,
			external_plugins: pluginWiris,
			language: 'en',
			plugins,
			toolbar,
			menubar,
			selector: `#${this.idEditor}`,
			skin_url: '/skins/oxide-dark', // css base
			content_css: '/skins/default/content.css', // css content
			codesample_content_css: '/css/prism.css', // css code
			skin: 'oxide-dark',
			mobile: {
				theme: 'silver'
			},
			setup: (editor) => {
				this.setState({ editor });

				editor.on('keyup change', () => {
					handleEditorTinyChange(editor.getContent());
				});
			}
		});
	}

	componentDidMount() {
		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			if (!this.props.tinyMceLib) {
				const tinyMceLib = require('tinymce');
				require('tinymce/themes/silver');
				require('tinymce/plugins/wordcount');
				require('tinymce/plugins/table');
				require('tinymce/plugins/codesample');
				require('tinymce/plugins/link');
				require('tinymce/plugins/image');
				require('tinymce/plugins/textcolor');

				if (window.matchMedia('(max-width: 410px)').matches) {
					require('tinymce/themes/mobile');
				}

				this.props.handleSetTinymce(tinyMceLib, () => {
					this.tinyMceInit();
				});
			} else {
				this.tinyMceInit();
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.heightEditor !== this.props.heightEditor && this.props.tinyMceLib && this.props.tinyMceLib.activeEditor) {
			this.props.tinyMceLib.activeEditor.settings.min_height = this.props.heightEditor;

			if (document.querySelector('.tox-tinymce')) {
				document.querySelector('.tox-tinymce').style.height = `${this.props.heightEditor}px`;
			}
		}
	}

	componentWillUnmount() {
		if (this.props.tinyMceLib) { this.props.tinyMceLib.remove(this.state.editor); }
	}

	render() {
		const { tinyMceLib } = this.props;

		return (
			<div className={cx('editor-edition')}>
				{
					tinyMceLib && (
						<textarea
							id={this.idEditor}
							value={this.props.content}
							onChange={() => console.log('Editor chanded')}
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
	content: PropTypes.string,
	handleEditorTinyChange: PropTypes.func,
	heightEditor: PropTypes.number
};

export default EditorTiny;
