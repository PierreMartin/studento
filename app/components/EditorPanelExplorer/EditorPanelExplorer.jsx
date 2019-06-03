import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getOptionsFormsSelect } from './attributesForms';
import { fetchCoursesByFieldAction, setPaginationCoursesEditorAction } from '../../actions/courses';
import { fetchCategoriesAction } from '../../actions/category';
import { Segment, List, Form, Header, Message, Select, Icon, Pagination, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/editorPanelExplorer.scss';

const cx = classNames.bind(styles);


class EditorPanelExplorer extends Component {
	constructor(props) {
		super(props);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
	}

	/**
	* Called at reload OR every changed courses because the parents components are 'CourseAddOrEditMd' or 'CourseAddOrEdit'
	* */
	componentDidMount() {
		const { fetchCategoriesAction, fetchCoursesByFieldAction, userMe, paginationEditor } = this.props;

		// If lastActivePage === 1st page:
		if (paginationEditor.lastActivePage === 1) {
			fetchCategoriesAction();
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, showPrivate: true });
		} else if (paginationEditor.lastActivePage > 1) {
			// If lastActivePage > 1st page:
			const activePage = paginationEditor.lastActivePage;
			fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage, showPrivate: true });
		}
	}

	handlePaginationChange = (e, { activePage }) => {
		const { userMe, fetchCoursesByFieldAction, paginationEditor, setPaginationCoursesEditorAction } = this.props;
		const lastActivePage = paginationEditor.lastActivePage;

		if (activePage === lastActivePage) return;

		setPaginationCoursesEditorAction(activePage);
		fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id, activePage, showPrivate: true });
	};

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

	renderCoursesList() {
		const { courses, course } = this.props;

		if (courses.length === 0) return <div className={cx('message-empty-note')}>No yet note</div>;

		return courses.map((c) => {
			const isTypeMarkDown = c.type !== 'wy';
			const pathname = isTypeMarkDown ? `/courseMd/edit/${c._id}` : `/course/edit/${c._id}`;
			const pathCourseToEdit = { pathname, state: { isMenuPanelOpen: false } };
			const icon = isTypeMarkDown ? 'file' : 'file text';
			const isActive = course._id === c._id;

			return (
				<List.Item key={c._id} as={Link} active={isActive} className={cx(isActive ? 'active-course' : '')} to={pathCourseToEdit} icon={icon} content={c.title} />
			);
		});
	}

	renderPaginationCoursesList() {
		const { paginationEditor, coursesPagesCount } = this.props;

		return (
			<Pagination
				inverted
				activePage={paginationEditor.lastActivePage}
				boundaryRange={1}
				siblingRange={1}
				onPageChange={this.handlePaginationChange}
				size="mini"
				totalPages={coursesPagesCount}
				ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
				prevItem={{ content: <Icon name="angle left" />, icon: true }}
				nextItem={{ content: <Icon name="angle right" />, icon: true }}
				firstItem={null}
				lastItem={null}
			/>
		);
	}

	render() {
		const {
			isOpen,
			coursesPagesCount,
			addOrEditMissingField,
			handleOnSubmit,
			fieldsTyping,
			fields,
			category,
			isEditing,
			handleInputChange,
			fromPage,
			categories,
			course
		} = this.props;

		const messagesError = this.dispayFieldsErrors();
		const { categoriesOptions, subCategoriesOptions, columnsOptions } = getOptionsFormsSelect({ categories, course, category, isEditing });
		const isDisableButtonSubmit = !fieldsTyping.title && !fieldsTyping.category && !fieldsTyping.subCategories && !fieldsTyping.description && typeof fieldsTyping.isPrivate === 'undefined' && (!fieldsTyping.template || (fieldsTyping.template && Object.keys(fieldsTyping.template).length === 0));
		const selectTemplatesHeaders = [
			{ label: 'h1', name: 'columnH1' },
			{ label: 'h2', name: 'columnH2' },
			{ label: 'h3', name: 'columnH3' }
		];

		return (
			<div className={cx('panel-explorer-container', isOpen ? 'menu-open' : '')}>
				<div className={cx('nav-bar')}>
					{/*
					<Button.Group basic size="small" id="panel-explorer_button-group" floated="right">
						<Popup inverted trigger={<Button icon="arrow left" as={Link} to="/dashboard" />} content="Go to dashboard" />

						<Popup inverted trigger={<Button icon="file" />} flowing hoverable>
							<Button basic inverted size="small" icon="file text" as={Link} to="/course/create/new" content="New Note" />
							<Button basic inverted size="small" icon="file" as={Link} to="/courseMd/create/new" content="New Markdown Note" />
						</Popup>

						{ !isEditorChanged ? <Popup inverted trigger={<Button disabled icon="save" onClick={handleOnSubmit} />} content="Save" /> : <Popup inverted trigger={<Button icon="save" onClick={handleOnSubmit} />} content="Save" /> }
						{ !isEditing ? <Button disabled icon="eye" /> : <Popup inverted trigger={<Button icon="eye" as={Link} to={`/course/${course._id}`} />} content="See the note (you should save before)" /> }
					</Button.Group>
					*/}
				</div>

				<div className={cx('panel-explorer-tree-folder')}>
					<List className={cx('panel-explorer-tree-folder-itemslist')} link>{ this.renderCoursesList()}</List>
					<div style={{ textAlign: 'center' }}>
						{ coursesPagesCount > 1 && this.renderPaginationCoursesList() }
					</div>
				</div>

				<div className={cx('panel-explorer-properties')}>
					<Form error={messagesError.props.children.length > 0} size="mini" onSubmit={handleOnSubmit}>
						<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={handleInputChange} />
						<Form.TextArea label="Description" placeholder="The description of your Note..." name="description" value={fields.description || ''} onChange={handleInputChange} />

						<Form.Select className={cx('select')} required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={handleInputChange} />
						{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={handleInputChange} /> : '' }

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

						{ fromPage !== 'wy' ? (
							<Segment className={cx('form-templates-container')}>
								<Header as="h4" icon="edit" content="Templates" className={cx('header')} />
								<Form.Field inline className={cx('form-templates')}>
									{ selectTemplatesHeaders.map((select, key) => {
										return (
											<div key={key}>
												<label htmlFor={select.name}>{select.label}</label>
												<Select className={cx('input-select')} name={select.name} options={columnsOptions} value={fields.template[select.name] || 1} onChange={handleInputChange} />
											</div>
										);
									}) }
								</Form.Field>
							</Segment>
						) : '' }

						<Message error content={messagesError} />

						<Form.Button basic fluid inverted disabled={isDisableButtonSubmit}>Save properties</Form.Button>
					</Form>
				</div>
			</div>
		);
	}
}

EditorPanelExplorer.propTypes = {
	isOpen: PropTypes.bool,
	fromPage: PropTypes.string,
	// isEditorChanged: PropTypes.bool,

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

	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	paginationEditor: PropTypes.shape({
		lastActivePage: PropTypes.number
	}),

	isEditing: PropTypes.bool,
	fieldsTyping: PropTypes.object,
	fields: PropTypes.object,
	addOrEditMissingField: PropTypes.object,
	addOrEditFailure: PropTypes.string,
	coursesPagesCount: PropTypes.number,

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
	fetchCoursesByFieldAction: PropTypes.func,
	fetchCategoriesAction: PropTypes.func,
	setPaginationCoursesEditorAction: PropTypes.func
};

export default connect(null, { fetchCategoriesAction, fetchCoursesByFieldAction, setPaginationCoursesEditorAction })(EditorPanelExplorer);
