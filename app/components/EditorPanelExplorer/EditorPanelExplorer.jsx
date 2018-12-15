import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Segment, Popup, Button, List, Form, Header, Message, Select, Icon, Pagination } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorPanelExplorer.scss';

const cx = classNames.bind(styles);


const getOptionsFormsSelect = (categories, course, category, isEditing) => {
	let lastCategorySelected = category.lastSelected;

	// If update and no yet select some Inputs:
	if (isEditing && category.lastSelected === null) {
		lastCategorySelected = course.category;
	}

	// CATEGORIES - Convert to Input formate:
	const arrCatList = [];
	if (categories.length > 0) {
		for (let i = 0; i < categories.length; i++) {
			arrCatList.push({
				key: categories[i].key,
				text: categories[i].name,
				value: categories[i].key
			});
		}
	}

	// SUB CATEGORIES - 1) Get the category selected by the 1st Input:
	let categorySelected = {};
	if (categories.length > 0 && lastCategorySelected) {
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].key === lastCategorySelected) {
				categorySelected = categories[i];
				break;
			}
		}
	}

	// SUB CATEGORIES - 2) Convert to Input formate:
	const arrSubCatList = [];
	if (categorySelected.subCategories && categorySelected.subCategories.length > 0) {
		for (let i = 0; i < categorySelected.subCategories.length; i++) {
			arrSubCatList.push({
				key: categorySelected.subCategories[i].key,
				text: categorySelected.subCategories[i].name,
				value: categorySelected.subCategories[i].key
			});
		}
	}

	const columnsOptions = [
		{ key: 1, text: '1 column', value: 1 },
		{ key: 2, text: '2 columns', value: 2 },
		{ key: 3, text: '3 columns', value: 3 },
		{ key: 4, text: '4 columns', value: 4 }
	];

	return { categoriesOptions: arrCatList, subCategoriesOptions: arrSubCatList, columnsOptions };
};

/**
 * Display a error if a field is wrong
 * @param {object} missingField - object with true as key if a field is missing
 * @param {string} messageErrorBe - message from back-end
 * @return {HTML} the final message if error
 * */
const dispayFieldsErrors = (missingField, messageErrorBe) => {
	const errorsField = [];
	if (missingField.title) errorsField.push({message: 'the title is required ', key: 'title'});
	if (missingField.category) errorsField.push({message: 'the category is required ', key: 'category'});

	// Pas obligé d'afficher les erreurs back-end dans le form, on devrait plutôt les aficher dans une notification
	if (messageErrorBe && messageErrorBe.length > 0) errorsField.push({message: messageErrorBe, key: 'backendError'});

	const messagesListNode = errorsField.map((errorField, key) => {
		return (
			<li key={key}>{errorField.message}</li>
		);
	});

	return <ul className={cx('error-message')}>{messagesListNode}</ul>;
};

const renderCoursesList = (courses, course, handleSelectCourse) => {
	if (courses.length === 0) return;

	return courses.map((c, key) => {
		const pathCourseToEdit = c.type !== 'wy' ? `/courseMd/edit/${c._id}` : `/course/edit/${c._id}`;
		const isActive = course._id === c._id;

		return (
			<List.Item key={c._id} as={Link} active={isActive} className={cx(isActive ? 'active-course' : '')} to={pathCourseToEdit} icon="file text" content={c.title} onClick={handleSelectCourse(key)} />
		);
	});
};

const renderPaginationCoursesList = (coursesPagesCount, pagination, handlePaginationChange) => {
	return (
		<Pagination
			activePage={pagination.indexPage}
			boundaryRange={1}
			siblingRange={1}
			onPageChange={handlePaginationChange}
			size="mini"
			totalPages={coursesPagesCount}
			ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
			prevItem={{ content: <Icon name="angle left" />, icon: true }}
			nextItem={{ content: <Icon name="angle right" />, icon: true }}
			firstItem={null}
			lastItem={null}
		/>
	);
};

const EditorPanelExplorer = ({
																course,
																courses,
																isEditing,
																fieldsTyping,
																fields,
																addOrEditMissingField,
																addOrEditFailure,
																coursesPagesCount,
																pagination,
																category,
																categories,
																handleInputChange,
																handleOnSubmit,
																handlePaginationChange,
																handleSelectCourse,
																fromPage,
																isEditorChanged
}) => {
	const messagesError = dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
	const { categoriesOptions, subCategoriesOptions, columnsOptions } = getOptionsFormsSelect(categories, course, category, isEditing);
	const isDisableButtonSubmit = !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && !fieldsTyping.isPrivate && (!fieldsTyping.template || (fieldsTyping.template && Object.keys(fieldsTyping.template).length === 0));
	const selectTemplatesHeaders = [
		{ label: 'h1', name: 'columnH1' },
		{ label: 'h2', name: 'columnH2' },
		{ label: 'h3', name: 'columnH3' },
		{ label: 'h4', name: 'columnH4' },
		{ label: 'h5', name: 'columnH5' },
		{ label: 'h6', name: 'columnH6' }
	];

	return (
		<div className={cx('panel-explorer-container')}>
			<div className={cx('panel-explorer-nav-bar')}>
				<Button.Group basic size="small">
					<Popup trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Go to dashboard" />
					<Popup trigger={<Button icon="file" as={Link} to="/course/create/new" />} content="New course" />
					<Popup trigger={<Button icon="file" as={Link} to="/courseMd/create/new" />} content="New MarkDown course" />
					{ !isEditorChanged ? <Popup trigger={<Button disabled icon="save" onClick={handleOnSubmit} />} content="Save" /> : <Popup trigger={<Button icon="save" onClick={handleOnSubmit} />} content="Save" />}
					{ !isEditing ? <Button disabled icon="sticky note outline" /> : <Popup trigger={<Button icon="sticky note outline" as={Link} to={`/course/${course._id}`} />} content="See the course (you should save before)" /> }
				</Button.Group>
			</div>

			<div className={cx('panel-explorer-tree-folder')}>
				<List className={cx('panel-explorer-tree-folder-itemslist')} link>{ renderCoursesList(courses, course, handleSelectCourse) }</List>
				{ coursesPagesCount > 1 && renderPaginationCoursesList(coursesPagesCount, pagination, handlePaginationChange) }
			</div>

			<div className={cx('panel-explorer-properties')}>
				<Form error={messagesError.props.children.length > 0} size="small" onSubmit={handleOnSubmit}>
					<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={handleInputChange} />
					<Form.TextArea label="Description" placeholder="The description of your course..." name="description" value={fields.description || ''} onChange={handleInputChange} />

					<Form.Select required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={handleInputChange} />
					{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={handleInputChange} /> : ''}

					<Form.Checkbox disabled label="Private" name="isPrivate" value={fields.isPrivate || ''} onChange={handleInputChange} />

					{ fromPage !== 'wy' ? (
						<Segment>
							<Header as="h4" icon="edit" content="Templates" />
							<Form.Field inline className={cx('header-select-container')}>
								{ selectTemplatesHeaders.map((select, key) => {
									return (
										<div key={key}>
											<label htmlFor={select.name}>{select.label}</label>
											<Select className={cx('header-select')} name={select.name} options={columnsOptions} value={fields.template[select.name] || 1} onChange={handleInputChange} />
										</div>
									);
								}) }
							</Form.Field>
						</Segment>
					) : '' }

					<Message error content={messagesError} />

					{ isDisableButtonSubmit ? <Form.Button basic disabled>Save properties</Form.Button> : <Form.Button basic>Save properties</Form.Button>}
				</Form>
			</div>
		</div>
	);
};

EditorPanelExplorer.propTypes = {
	fromPage: PropTypes.string,
	isEditorChanged: PropTypes.bool,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		type: PropTypes.string
	})),

	isEditing: PropTypes.bool,
	fieldsTyping: PropTypes.object,
	fields: PropTypes.object,
	addOrEditMissingField: PropTypes.object,
	addOrEditFailure: PropTypes.string,
	coursesPagesCount: PropTypes.number,

	pagination: PropTypes.shape({
		indexPage: PropTypes.number
	}),

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
	handleOnSubmit: PropTypes.func,
	handlePaginationChange: PropTypes.func,
	handleSelectCourse: PropTypes.func
};

export default EditorPanelExplorer;
