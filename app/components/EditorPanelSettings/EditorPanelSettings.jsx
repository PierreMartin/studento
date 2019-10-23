import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getColumnsFormsSelect, getCategoriesFormsSelect } from './attributesForms';
import { Segment, Form, Header, Message, Select, Icon, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorPanelSettings.scss';

const cx = classNames.bind(styles);

class EditorSettingsExplorer extends Component {
	/**
	 * Display a error if a field is wrong
	 * addOrEditMissingField - object with true as key if a field is missing
	 * addOrEditFailure - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors() {
		const { addOrEditMissingField, addOrEditFailure } = this.props;
		const errorsField = [];

		if (addOrEditMissingField.title) errorsField.push({ message: 'the title is required ', key: 'title' });
		if (addOrEditMissingField.category) errorsField.push({ message: 'the category is required ', key: 'category' });

		// Pas obligé d'afficher les erreurs back-end dans le form, on devrait plutôt les aficher dans une notification
		if (addOrEditFailure && addOrEditFailure.length > 0) errorsField.push({ message: addOrEditFailure, key: 'backendError' });

		const messagesListNode = errorsField.map((errorField, key) => {
			return (
				<li key={key}>{errorField.message}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	render() {
		const {
			isOpen,
			addOrEditMissingField,
			handleSave,
			fieldsTyping,
			fields,
			category,
			isEditing,
			handleInputChange,
			categories,
			course,
			pageMode,
			handleModalOpen_DeleteNote,
			heightEditor
		} = this.props;

		const messagesError = this.dispayFieldsErrors();
		const { categoriesOptions, subCategoriesOptions } = getCategoriesFormsSelect({ categories, course, category, isEditing });
		const columnsOptions = getColumnsFormsSelect();
		const isDisableButtonSubmit = !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && typeof fieldsTyping.isPrivate === 'undefined' && (!fieldsTyping.template || (fieldsTyping.template && Object.keys(fieldsTyping.template).length === 0));
		const selectTemplatesHeaders = [
			{ label: 'h1', name: 'columnH1' },
			{ label: 'h2', name: 'columnH2' },
			{ label: 'h3', name: 'columnH3' }
		];

		return (
			<div className={cx('panel-settings-container', isOpen ? 'menu-open' : '')} style={{ height: heightEditor }}>
				<div className={cx('panel-settings-properties')}>
					<Form error={messagesError.props.children.length > 0} size="mini" onSubmit={handleSave}>
						<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={handleInputChange} />
						<Form.TextArea label="Description" placeholder="The description of your Note..." name="description" value={fields.description || ''} onChange={handleInputChange} />

						<Form.Select className={cx('select')} required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={handleInputChange} />
						{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select className={cx('select')} label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={handleInputChange} /> : '' }

						<Form.Checkbox className={cx('checkbox')} toggle label="Private" name="isPrivate" checked={fields.isPrivate || false} onChange={handleInputChange} />
						<Popup trigger={<Icon className={cx('info')} name="info circle" size="big" color="grey" />} flowing hoverable>
							<Message info icon size="mini">
								<Icon name="info circle" size="small" />
								<Message.Header>
									The more notes you will have in private, the lower your 'sharing score' will be.
									<br />
									Don't forget that the goal of this platform is to share as much your knowledge.
								</Message.Header>
							</Message>
						</Popup>

						{ pageMode !== 'wy' ? (
							<Segment className={cx('form-templates-container')}>
								<Header as="h4" icon="edit" content="Templates" className={cx('header')} />
								<Form.Field inline className={cx('form-templates')}>
									{ selectTemplatesHeaders.map((select, key) => {
										return (
											<div key={key} className={cx('field')}>
												<label htmlFor={select.name}>{select.label}</label>
												<Select className={cx('input-select')} name={select.name} options={columnsOptions} value={fields.template[select.name] || 1} onChange={handleInputChange} />
											</div>
										);
									}) }
								</Form.Field>
							</Segment>
						) : '' }

						<Message error content={messagesError} />

						<Form.Button basic primary fluid inverted disabled={isDisableButtonSubmit}>Save properties</Form.Button>
					</Form>

					<Form size="mini" onSubmit={handleModalOpen_DeleteNote(course)} style={{ marginTop: '20px' }}>
						{
							isEditing && (
								<div>
									<Form.Button size="mini" basic primary fluid inverted content="Delete the note" />
								</div>
							)
						}
					</Form>
				</div>
			</div>
		);
	}
}

EditorSettingsExplorer.propTypes = {
	isOpen: PropTypes.bool,
	pageMode: PropTypes.string,
	heightEditor: PropTypes.number,

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
	fieldsTyping: PropTypes.object,
	fields: PropTypes.object,
	addOrEditMissingField: PropTypes.object,
	addOrEditFailure: PropTypes.string,

	category: PropTypes.shape({
		lastSelected: PropTypes.string
	}),

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	})),

	handleInputChange: PropTypes.func,
	handleSave: PropTypes.func,
	handleModalOpen_DeleteNote: PropTypes.func
};

export default EditorSettingsExplorer;
