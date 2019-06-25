import React, { Component } from 'react';
import PropTypes from 'prop-types';


class TinyEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editor: null
		};
	}

	componentDidMount() {
		this.props.tinymce.init({
			min_height: this.props.heightDocument,
			external_plugins: { tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js' },
			language: 'en',
			plugins: 'link image table codesample textcolor tiny_mce_wiris',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | codesample | table | formatselect | forecolor backcolor | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry',
			selector: `#${this.props.id}`,
			skin_url: '/skins/oxide-dark', // css base
			content_css: '/skins/default/content.css', // css content
			codesample_content_css: '/css/prism.css', // css code
			skin: 'oxide-dark',
			setup: (editor) => {
				this.setState({ editor });

				editor.on('keyup change', () => {
					const content = editor.getContent();
					this.props.onEditorChange(content);
				});
			}
		});
	}

	componentWillUnmount() {
		this.props.tinymce.remove(this.state.editor);
	}

	render() {
		return (
			<textarea
				id={this.props.id}
				value={this.props.content}
				onChange={() => console.log('Editor chanded')}
			/>
		);
	}
}

TinyEditor.propTypes = {
	tinymce: PropTypes.object,
	id: PropTypes.string,
	content: PropTypes.string,
	heightDocument: PropTypes.number,
	onEditorChange: PropTypes.func
};

export default TinyEditor;
