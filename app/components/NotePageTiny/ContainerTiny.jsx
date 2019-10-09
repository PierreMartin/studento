import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorTiny from '../NotePageTiny/EditorTiny';
import PreviewTiny from '../NotePageTiny/PreviewTiny';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesNotePage from '../../pages/css/notePage.scss';

const cx = classNames.bind({...stylesMain, ...stylesNotePage});

class ContainerTiny extends Component {
	render() {
		const { isCanEdit, isEditMode } = this.props;

		return (
			<div>
				<div className={cx('tiny-editor-container')}>
					{ isCanEdit && isEditMode && <EditorTiny {...this.props} />}
					{ !isEditMode && <PreviewTiny {...this.props} />}
				</div>
			</div>
		);
	}
}

ContainerTiny.propTypes = {
	isCanEdit: PropTypes.bool,
	isEditMode: PropTypes.bool
};

export default ContainerTiny;
