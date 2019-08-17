import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesAddOrEditCourse from '../../pages/css/courseAddOrEdit.scss';
import stylesCourse from '../../pages/css/course.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse, ...stylesCourse});

class EditorMd extends Component {
	render() {
		const { content, refEditorMd, handleScroll } = this.props;

		return (
			<div className={cx('editor-edition')} onScroll={handleScroll('editor')}>
				<Form size="small">
					<textarea ref={refEditorMd} name="editorCm" id="editorMd" value={content} onChange={() => {}} />
				</Form>
			</div>
		);
	}
}

EditorMd.propTypes = {
	content: PropTypes.string,
	refEditorMd: PropTypes.any,
	handleScroll: PropTypes.func
};

export default EditorMd;
