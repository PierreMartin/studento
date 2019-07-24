import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorMd from '../NotePageMd/EditorMd';
import PreviewMd from '../NotePageMd/PreviewMd';
import { Button, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../../css/main.scss';
import stylesAddOrEditCourse from '../../pages/css/courseAddOrEdit.scss';

const cx = classNames.bind({...stylesMain, ...stylesAddOrEditCourse});

class ContainerMd extends Component {
	render() {
		const {
			isCanEdit,
			isEditMode,
			isMobile,
			handleClickToolbarMarkDown
		} = this.props;

		const buttonsToolbar = [
			{ icon: 'bold', content: 'Bold' },
			{ icon: 'italic', content: 'Italic' },
			{ icon: 'header', content: 'Header' },
			{ icon: 'strikethrough', content: 'Strikethrough' },
			{ icon: 'unordered list', content: 'Unordered list' },
			{ icon: 'ordered list', content: 'Ordered list' },
			{ icon: 'check square', content: 'Check list' },
			{ icon: 'quote left', content: 'Quote left' }
		];
		const buttonsForPopupToolbar = [
			{ icon: 'code', content: 'Add a code' },
			{ icon: 'table', content: 'Add a table' },
			{ icon: 'linkify', content: 'Add a link' },
			{ icon: 'file image outline', content: 'Add image' }
		];

		return (
			<div>
				{
					(isCanEdit && isEditMode) && (
						<div className={cx('toolbar-editor-md')}>
							<Button.Group basic size="small" className={cx('button-group')}>
								{ buttonsToolbar.map((button, key) => (<Popup trigger={<Button icon={button.icon} basic className={cx('button')} onClick={handleClickToolbarMarkDown(button.icon)} />} content={button.content} key={key} />)) }
							</Button.Group>

							<Button.Group basic size="small" className={cx('button-group')}>
								{ buttonsForPopupToolbar.map((button, key) => <Button key={key} icon={button.icon} basic className={cx('button')} onClick={handleClickToolbarMarkDown(button.icon)} />) }
							</Button.Group>

							{ !isMobile ? (
								<Button.Group basic size="small" className={cx('button-group')}>
									{/* <Popup trigger={<Button toggle icon="lock" basic className={cx('button')} active={isButtonAutoScrollActive} onClick={handleClickToolbarMarkDown('auto scoll')} />} content="toggle scroll sync" /> */}
								</Button.Group>
							) : '' }
						</div>
					)
				}

				<div className={cx('md-editor-container')}>
					{ isCanEdit && isEditMode && <EditorMd {...this.props} />}
					<PreviewMd {...this.props} />
				</div>
			</div>
		);
	}
}

ContainerMd.propTypes = {
	//
};

export default ContainerMd;
