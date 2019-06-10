import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Form } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './birthdateField.scss';

const cx = classNames.bind(styles);

const BirthdateField = ({ fields, updateMissingRequiredField, typingUpdateUserAction }) => {
	const getOptionsFormsSelect = () => {
		const options = {};

		const day = [];
		for (let i = 1; i <= 31; i++) {
			day.push({key: i + '', text: i + '', value: i});
		}
		options.day = day;

		const month = [];
		for (let j = 1; j <= 12; j++) {
			month.push({key: j + '', text: j + '', value: j});
		}
		options.month = month;

		const year = [];
		for (let k = 1970; k <= 2012; k++) {
			year.push({key: k + '', text: k + '', value: k});
		}
		options.year = year;

		return options;
	};

	const handleSelectDateChange = () => {
		return (event, field) => {
			typingUpdateUserAction(field.name, field.value);
		};
	};

	const options = getOptionsFormsSelect();

	return (
		<Segment className={cx('birthdate-container')}>
			<Header as="h4" icon="birthday" content="Birthdate" />
			<Form.Group widths="equal">
				<Form.Select label="Day" options={options.day} placeholder="Day" width={8} name="birthDateDay" value={fields.birthDateDay || ''} error={updateMissingRequiredField.birthDateDay && updateMissingRequiredField.birthDateDay.length > 0} onChange={handleSelectDateChange()} />
				<Form.Select label="Month" options={options.month} placeholder="Month" width={8} name="birthDateMonth" value={fields.birthDateMonth || ''} error={updateMissingRequiredField.birthDateMonth && updateMissingRequiredField.birthDateMonth.length > 0} onChange={handleSelectDateChange()} />
			</Form.Group>
			<Form.Select label="Year" options={options.year} placeholder="Year" width={16} name="birthDateYear" value={fields.birthDateYear || ''} error={updateMissingRequiredField.birthDateYear && updateMissingRequiredField.birthDateYear.length > 0} onChange={handleSelectDateChange()} />
		</Segment>
	);
};

BirthdateField.propTypes = {
	fields: PropTypes.object,
	typingUpdateUserAction: PropTypes.func.isRequired,
	updateMissingRequiredField: PropTypes.object
};

export default BirthdateField;
