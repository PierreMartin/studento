import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { createCourseAction } from '../actions/courses';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Segment, Container, Form, Message } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from '../css/main.scss';

const cx = classNames.bind(styles);

class CourseAddOrEdit extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);

		this.state = {
			fieldsTyping: {}
		};

		this.isEditing = this.props.course && typeof this.props.course._id !== 'undefined';
	}

	getOptionsFormsSelect() {
		const options = {};

		// TODO get existing categories
		options.categories = [
			{ key: 'informatique', text: 'Informatique', value: 'informatique' },
			{ key: 'edu', text: 'Education', value: 'education'},
			{ key: 'sport', text: 'Sport', value: 'sport' },
			{ key: 'travel', text: 'Travel', value: 'travel' }
		];

		return options;
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
		fields.subCategories = ((typeof fieldsTyping.subCategories !== 'undefined') ? fieldsTyping.subCategories : course && course.subCategories) || '';
		fields.isPrivate = ((typeof fieldsTyping.isPrivate !== 'undefined') ? fieldsTyping.isPrivate : course && course.isPrivate) || false;
		fields.content = ((typeof fieldsTyping.content !== 'undefined') ? fieldsTyping.content : course && course.content) || '';

		return fields;
	}

	handleOnSubmit(event) {
		event.preventDefault();

		const { course, userMe } = this.props;
		const fields = this.getFieldsVal(this.state.fieldsTyping, course);

		/*
		if (this.isEditing) {
			updateCourseAction(fields);
		} else {
			createCourseAction(fields, userMe._id);
		}
		*/
	}

	handleInputChange(event, field) {
		const oldStateTyping = this.state.fieldsTyping;
		this.setState({fieldsTyping: {...oldStateTyping, ...{[field.name]: field.value}}});
	}

	/**
	 * Display a error if a field is wrong
	 * @param {object} missingRequiredField - object with true as key if a field is missing
	 * @param {string} messageErrorState - message from back-end
	 * @return {HTML} the final message if error
	 * */
	dispayFieldsErrors(missingRequiredField, messageErrorState) {
		const errorsField = [];
		if (missingRequiredField.title) {
			errorsField.push({message: 'the title is required ', key: 'title'});
		}

		if (messageErrorState && messageErrorState.length > 0) {
			errorsField.push({message: messageErrorState, key: 'backendError'});
		}

		const messagesListNode = errorsField.map((errorField, key) => {
			return (
				<li key={key}>{errorField.message}</li>
			);
		});

		return <ul className={cx('error-message')}>{messagesListNode}</ul>;
	}

	render() {
		const { course, updateMissingRequiredField, updateMessageError } = this.props;
		const fields = this.getFieldsVal(this.state.fieldsTyping, course);
		const messagesError = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);
		const options = this.getOptionsFormsSelect();

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container>
						<h4>{ this.isEditing ? 'Edit a course' : 'Add a course' }</h4>

						<Form error={messagesError.props.children.length > 0} size="small" onSubmit={this.handleOnSubmit}>
							<Form.Input required label="Title" placeholder="Title" name="title" value={fields.title || ''} error={updateMissingRequiredField.title} onChange={this.handleInputChange} />
							<Form.TextArea label="Content" placeholder="The content of your course..." name="content" value={fields.content || ''} onChange={this.handleInputChange} />

							<Form.Group widths="equal">
								<Form.Input required list="category" label="Category" name="category" placeholder="Choose the category" value={fields.category || ''} onChange={this.handleInputChange} />
								<datalist id="category">{ options.categories.map((cat, i) => (<option key={i} value={cat.text} />))}</datalist>
								<Form.Input label="Sub Categories" placeholder="Sub Categories" name="subCategories" value={fields.subCategories || ''} onChange={this.handleInputChange} />
							</Form.Group>

							<Form.Checkbox disabled label="Private" name="isPrivate" value={fields.isPrivate || ''} onChange={this.handleInputChange} />

							<Message error content={messagesError} />

							<Form.Button>Submit</Form.Button>
						</Form>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

CourseAddOrEdit.propTypes = {
	// createCourseAction: PropTypes.func.isRequired,
	// updateCourseAction: PropTypes.func.isRequired,
	updateMissingRequiredField: PropTypes.object,
	updateMessageError: PropTypes.string,

	course: PropTypes.shape({
		_id: PropTypes.string
	}),

	userMe: PropTypes.shape({
		_id: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		course: state.courses.one,
		userMe: state.userMe.data,
		updateMissingRequiredField: state.userMe.updateMissingRequiredField, // state.courses.addOrEditMissingField
		updateMessageError: state.userMe.updateMessageError // state.courses.addOrEditErrorHappen
	};
};

export default connect(mapStateToProps, null)(CourseAddOrEdit);
