import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { createCourseAction, updateCourseAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { List, Form, Message, Button, Popup } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import styles from './css/courseAddOrEditProto.scss';

const cx = classNames.bind({...styles, ...stylesMain});

class CourseAddOrEditProto extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.goBack = this.goBack.bind(this);

		this.state = {
			fieldsTyping: {},
			isEditing: this.props.course && typeof this.props.course._id !== 'undefined',
			category: { lastSelected: null },
			heightDocument: 0
		};
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		this.props.fetchCategoriesAction();
		// this.props.fetchCoursesByFieldAction({ keyReq: 'uId', valueReq: userMe._id });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.course !== this.props.course) {
			this.setState({isEditing: this.props.course && typeof this.props.course._id !== 'undefined'});
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getOptionsFormsSelect() {
		const { categories, course } = this.props;
		const { category, isEditing } = this.state;
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

		return { categoriesOptions: arrCatList, subCategoriesOptions: arrSubCatList };
	}

	getMetaData() {
		return {
			title: 'Add course',
			meta: [{ name: 'description', content: 'Add course...' }],
			link: []
		};
	}

	getFieldsVal(fieldsTyping, course) {
		const fields = {};
		fields.title = ((typeof fieldsTyping.title !== 'undefined') ? fieldsTyping.title : course && course.title) || '';
		fields.category = ((typeof fieldsTyping.category !== 'undefined') ? fieldsTyping.category : course && course.category) || '';
		fields.subCategories = ((typeof fieldsTyping.subCategories !== 'undefined') ? fieldsTyping.subCategories : course && course.subCategories) || [];
		fields.isPrivate = ((typeof fieldsTyping.isPrivate !== 'undefined') ? fieldsTyping.isPrivate : course && course.isPrivate) || false;
		fields.content = ((typeof fieldsTyping.content !== 'undefined') ? fieldsTyping.content : course && course.content) || '';
		fields.description = ((typeof fieldsTyping.description !== 'undefined') ? fieldsTyping.description : course && course.description) || '';

		return fields;
	}

	updateWindowDimensions() {
		this.setState({ heightDocument: window.innerHeight });
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, userMe, createCourseAction, updateCourseAction } = this.props;
		const data = {};

		if (this.state.isEditing) {
			data.fields = this.state.fieldsTyping;
			data.modifiedAt = new Date().toISOString();
			data.courseId = course._id;
			updateCourseAction(data);
		} else {
			data.fields = this.getFieldsVal(this.state.fieldsTyping, course);
			data.userMeId = userMe._id;
			data.createdAt = new Date().toISOString();
			createCourseAction(data);
		}

		this.setState({ category: { lastSelected: null }, fieldsTyping: {} });
	}

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;

		if (field.name === 'category') {
			return this.setState({
				fieldsTyping: { ...oldStateTyping, ...{[field.name]: field.value }, subCategories: [] },
				category: { lastSelected: field.value}
			});
		}

		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}});
	}

	goBack() {
		browserHistory.goBack();
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingField - object with true as key if a field is missing
	 * @param {string} messageErrorBe - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingField, messageErrorBe) {
		const errorsField = [];
		if (missingField.title) errorsField.push({message: 'the title is required ', key: 'title'});
		if (missingField.category) errorsField.push({message: 'the category is required ', key: 'category'});
		if (missingField.content) errorsField.push({message: 'the content is required ', key: 'content'});

		// Pas obligé d'afficher les erreurs back-end dans le form, on devrait plutôt les aficher dans une notification
		if (messageErrorBe && messageErrorBe.length > 0) errorsField.push({message: messageErrorBe, key: 'backendError'});

		const messagesListNode = errorsField.map((errorField, key) => {
			return (
				<li key={key}>{errorField.message}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	render() {
		const { course, addOrEditMissingField, addOrEditFailure } = this.props;
		const { category, isEditing, fieldsTyping, heightDocument } = this.state;
		const fields = this.getFieldsVal(fieldsTyping, course);
		const messagesError = this.dispayFieldsErrors(addOrEditMissingField, addOrEditFailure);
		const { categoriesOptions, subCategoriesOptions } = this.getOptionsFormsSelect();
		const isDisabled = true;

		return (
			<LayoutPage {...this.getMetaData()}>
				<div className={cx('course-add-or-edit-container')}>
					<div className={cx('panel-explorer-container')}>
						<div className={cx('panel-explorer-nav-bar')}>
							<Button.Group basic size="small">
								<Popup trigger={<Button icon="arrow left" onClick={this.goBack} />} content="Go back" />
								<Popup trigger={<Button icon="file" as={Link} to="/course/create/new" />} content="New file" />
								{ isEditing && Object.keys(fieldsTyping).length === 0 ? <Button disabled icon="save" /> : <Popup trigger={<Button icon="save" onClick={this.handleOnSubmit} />} content="Save" />}
								<Popup trigger={<Button icon="sticky note outline" as={Link} to={`/course/${course._id}`} />} content="See the course (you must save before)" />
							</Button.Group>
						</div>

						<div className={cx('panel-explorer-tree-folder')}>
							<List>
								<List.Item>
									<List.Icon name="file text" />
									<List.Content><List.Header>Course 1</List.Header></List.Content>
								</List.Item>

								<List.Item>
									<List.Icon name="file text" />
									<List.Content><List.Header>Course 2</List.Header></List.Content>
								</List.Item>
							</List>
						</div>

						<div className={cx('panel-explorer-properties')}>
							<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
								<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={addOrEditMissingField.title} onChange={this.handleInputChange} />
								<Form.TextArea label="Description" placeholder="The description of your course..." name="description" value={fields.description || ''} onChange={this.handleInputChange} />

								<Form.Select required label="Category" placeholder="Select your category" name="category" options={categoriesOptions} value={fields.category || ''} error={addOrEditMissingField.category} onChange={this.handleInputChange} />
								{ isEditing || (!isEditing && category.lastSelected && category.lastSelected.length > 0) ? <Form.Select label="Sub Categories" placeholder="Sub Categories" name="subCategories" multiple options={subCategoriesOptions} value={fields.subCategories || ''} onChange={this.handleInputChange} /> : ''}

								<Form.Checkbox disabled label="Private" name="isPrivate" value={fields.isPrivate || ''} onChange={this.handleInputChange} />
								<Message error content={messagesError} />

								{ isEditing && Object.keys(fieldsTyping).length === 0 ? <Form.Button basic disabled>Save properties</Form.Button> : <Form.Button basic>Save properties</Form.Button>}
							</Form>
						</div>
					</div>

					<div className={cx('editor-container-full')}>
						<div className={cx('editor-nav-bar')}>
							<Button.Group basic size="small">
								<Popup trigger={<Button icon="bold" disabled={isDisabled} />} content="bold" />
								<Popup trigger={<Button icon="italic" disabled={isDisabled} />} content="italic" />
								<Popup trigger={<Button icon="underline" disabled={isDisabled} />} content="underline" />
								<Popup trigger={<Button icon="header" disabled={isDisabled} />} content="header" />
								<Popup trigger={<Button icon="strikethrough" disabled={isDisabled} />} content="strikethrough" />
								<Popup trigger={<Button icon="unordered list" disabled={isDisabled} />} content="unordered list" />
								<Popup trigger={<Button icon="ordered list" disabled={isDisabled} />} content="ordered list" />
								<Popup trigger={<Button icon="check square outline" disabled={isDisabled} />} content="check square outline" />
								<Popup trigger={<Button icon="quote left" disabled={isDisabled} />} content="quote left" />
								<Popup trigger={<Button icon="code" disabled={isDisabled} />} content="Add a code snippet" />
								<Popup trigger={<Button icon="table" disabled={isDisabled} />} content="Add a table" />
								<Popup trigger={<Button icon="linkify" disabled={isDisabled} />} content="Add a link" />
								<Popup trigger={<Button icon="file image outline" disabled={isDisabled} />} content="Add image" />
							</Button.Group>
						</div>

						<div className={cx('editor-container')}>
							<div className={cx('editor-edition')}>
								<Form error={messagesError.props.children.length > 0} size="small">
									<Form.TextArea placeholder="The content of your course..." name="content" value={fields.content || ''} error={addOrEditMissingField.content} onChange={this.handleInputChange} style={{ height: (heightDocument - 44) + 'px' }} />
									<Message error content={messagesError} />
								</Form>
							</div>

							<div className={cx('editor-preview')} style={{ height: (heightDocument - 44) + 'px' }}>
								{ fields.content || '' }
							</div>
						</div>
					</div>
				</div>
			</LayoutPage>
		);
	}
}

CourseAddOrEditProto.propTypes = {
	fetchCategoriesAction: PropTypes.func,
	createCourseAction: PropTypes.func,
	updateCourseAction: PropTypes.func,
	addOrEditMissingField: PropTypes.object,
	addOrEditFailure: PropTypes.string,

	course: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string,
		description: PropTypes.string
	}),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	}),

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	}))
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one,
		// courses: state.courses.all,
		userMe: state.userMe.data,
		categories: state.categories.all,
		addOrEditMissingField: state.courses.addOrEditMissingField,
		addOrEditFailure: state.courses.addOrEditFailure
	};
};

export default connect(mapStateToProps, { fetchCategoriesAction, createCourseAction, updateCourseAction })(CourseAddOrEditProto);
