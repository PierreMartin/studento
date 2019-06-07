import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Icon, Button, Popup, Form, Message } from 'semantic-ui-react';
import { getOptionsFormsSelect } from '../../components/EditorPanelExplorer/attributesForms';
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
		categories,
		category,
		isEditing,
		isEditorChanged,
		fields,
		fieldsTyping,
		addOrEditMissingField,
		addOrEditFailure,
		isPreviewModeActive,
		handleClickToolbar,
		handleInputChange,
		handleOnSubmit,
		fromPage
	}) => {
	const messagesError = dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
	const { categoriesOptions } = getOptionsFormsSelect({ categories, course, category, isEditing });
	const isPropertiesChanged = fieldsTyping.title || fieldsTyping.category;
	const stylePopup = { fontWeight: '900' };

	return (
		<div className={cx('toolbar', 'toolbar-settings')}>
			<Button.Group basic size="small" className={cx('button-group')}>
				<Popup style={stylePopup} inverted trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Exit (you should save before)" />

				<Popup trigger={<Button icon="file" />} flowing hoverable inverted on="click">
					<div className={cx('buttons-add-note')}>
						<Button style={stylePopup} inverted basic size="small" icon="file text" as={Link} to="/course/create/new" content="New Note" />
						<Button style={stylePopup} inverted basic size="small" icon="file" as={Link} to="/courseMd/create/new" content="New Markdown Note" />
					</div>
				</Popup>

				{ fromPage === 'md' && <Popup style={stylePopup} inverted trigger={<Button toggle icon="eye" basic className={cx('button')} active={isPreviewModeActive} onClick={handleClickToolbar('toggle preview')} />} content="Preview mode" /> }

				{ !isEditing ? <Button disabled icon="arrow circle up" /> : <Popup style={stylePopup} inverted trigger={<Button icon="arrow circle up" as={Link} to={`/course/${course._id}`} />} content="Got to page (you should save before)" /> }
			</Button.Group>

			<Form error={messagesError.length > 0} size="mini" onSubmit={handleOnSubmit} className={cx('form-properties')}>
				<Form.Input size="tiny" required placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={handleInputChange} className={cx('title')} />
				<Form.Select size="tiny" required placeholder="Category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={handleInputChange} className={cx('category')} />

				{
					messagesError.length > 0 ? (
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

				<Form.Button size="tiny" basic fluid inverted disabled={!isPropertiesChanged && !isEditorChanged}>Save</Form.Button>
			</Form>
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

	category: PropTypes.shape({
		lastSelected: PropTypes.string
	}),

	isEditing: PropTypes.bool,
	isEditorChanged: PropTypes.bool,
	fields: PropTypes.object,
	fieldsTyping: PropTypes.object,
	addOrEditFailure: PropTypes.string,
	isPreviewModeActive: PropTypes.bool,
	fromPage: PropTypes.string,

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	})),

	handleClickToolbar: PropTypes.func,
	handleInputChange: PropTypes.func,
	handleOnSubmit: PropTypes.func,
};

export default EditorToolbar;
