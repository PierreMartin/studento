import React, { Component } from 'react';


class TinyEditor extends Component {
	constructor() {
		super();
		this.state = {
			editor: null
		};
	}

	componentDidMount() {
		this.props.tinymce.init({
			min_height: this.props.heightDocument,
			external_plugins: { tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js' },
			plugins: 'link image table codesample tiny_mce_wiris',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | codesample | table | blocks | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry',
			selector: `#${this.props.id}`,
			skin_url: '/skins/lightgray',
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
			/>
		);
	}
}

export default TinyEditor;
