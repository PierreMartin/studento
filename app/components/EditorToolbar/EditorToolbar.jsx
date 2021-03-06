import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Icon, Button, Popup, Form, Message } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorToolbar.scss';

const cx = classNames.bind(styles);

/**
 * Display a error if a field is wrong
 * addOrEditMissingField - object with true as key if a field is missing
 * addOrEditFailure - message from back-end
 * @return {string} the final message if error
 * */
const dispayFieldsErrors = (addOrEditMissingField, addOrEditFailure) => {
	let messagesNode = '';
	const missingFieldArr = Object.keys(addOrEditMissingField);

	if (missingFieldArr.length === 1) {
		messagesNode = `The field ${missingFieldArr[0]} is required`;
	} else if (missingFieldArr.length > 1) {
		let fields = '';
		let comma = ', ';
		for (let i = 0; i < missingFieldArr.length; i++) {
			if (i === missingFieldArr.length - 2) { comma = ' and '; }
			if (i >= missingFieldArr.length - 1) { comma = ''; }
			fields += `${missingFieldArr[i]}${comma}`;
		}
		messagesNode += `The fields ${fields} are required`;
	}

	if (addOrEditFailure && addOrEditFailure.length > 0) messagesNode += addOrEditFailure;

	return messagesNode;
};

const EditorToolbar = (
	{ course,
		isEditing,
		isEditMode,
		isDirty,
		handleModalOpen_CanClose,
		fields,
		fieldsTyping,
		addOrEditMissingField,
		addOrEditFailure,
		handleClickToolbarMain,
		handleInputChange,
		handleSave,
		editorToolbarRef
	}) => {
	const messagesError = dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
	const isPropertiesChanged = fieldsTyping.title || fieldsTyping.category;
	const stylePopup = { fontWeight: '900' };

	return (
		<div className={cx('toolbar', 'toolbar-settings')} ref={editorToolbarRef}>
			<Button.Group basic size="small" className={cx('button-group')}>
				<Button icon="arrow left" title="Exit" as={isDirty ? 'button' : Link} to="/dashboard" onClick={isDirty ? handleModalOpen_CanClose('/dashboard') : null} />
				<Button style={stylePopup} size="small" icon="file text" as={isDirty ? 'button' : Link} to={{ pathname: '/course/create/new', state: { typeNote: 'wy' } }} onClick={isDirty ? handleModalOpen_CanClose({ pathname: '/course/create/new', state: { typeNote: 'wy' } }) : null} title="New Note" />
				<Button style={stylePopup} size="small" icon="file" as={isDirty ? 'button' : Link} to={{ pathname: '/course/create/new', state: { typeNote: 'md' } }} onClick={isDirty ? handleModalOpen_CanClose({ pathname: '/course/create/new', state: { typeNote: 'md' } }) : null} title="New Markdown Note" />
				<Button disabled={!isEditing} icon="eye" title="Got to page" as={isDirty ? 'button' : Link} to={`/course/${course._id}`} onClick={isDirty ? handleModalOpen_CanClose(`/course/${course._id}`) : null} />
			</Button.Group>

			<Form error={messagesError.length > 0} size="mini" onSubmit={handleSave} className={cx('form-properties', isEditMode ? 'edit-mode' : '')}>
				{
					isEditMode ? (
						<Form.Input size="tiny" required placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={handleInputChange} className={cx('title', 'input')} />
					) : (
						<span className={cx('title', 'span')} >{fields.title || ''}</span>
					)
				}

				{
					(isEditMode && messagesError.length > 0) ? (
						<Popup trigger={<Icon className={cx('error')} name="warning sign" size="big" color="red" />} flowing hoverable>
							<Message error icon size="mini">
								<Icon name="warning sign" size="small" />
								<Message.Header>
									{messagesError}
								</Message.Header>
							</Message>
						</Popup>
					) : null
				}

				{ isEditMode && <Form.Button size="tiny" basic primary disabled={!isPropertiesChanged && !isDirty}>Save</Form.Button> }
			</Form>

			<div className={cx('container-buttons-right')}>
				{ !isEditMode && <button title="Edit" className={cx('button-edit')} onClick={handleClickToolbarMain('toggle preview')}><Icon name="pencil" /></button>}
				{ isEditMode && <button title="Close" className={cx('button-close')} onClick={handleClickToolbarMain('toggle preview')}><Icon name="x" /></button>}
			</div>
		</div>
	);
};

EditorToolbar.propTypes = {
	addOrEditMissingField: PropTypes.object,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	isEditing: PropTypes.bool,
	isEditMode: PropTypes.bool,
	isDirty: PropTypes.bool,
	fields: PropTypes.object,
	fieldsTyping: PropTypes.object,
	addOrEditFailure: PropTypes.string,

	handleClickToolbarMain: PropTypes.func,
	handleInputChange: PropTypes.func,
	handleSave: PropTypes.func,
	handleModalOpen_CanClose: PropTypes.func,
	editorToolbarRef: PropTypes.func
};

export default EditorToolbar;
