import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Form } from 'semantic-ui-react';


class SettingsAccount extends Component {
	constructor(props) {
		super(props);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.fields = [];
	}

	getMetaData() {
		return {
			title: 'Settings Account',
			meta: [{ name: 'description', content: 'Settings Account...' }],
			link: []
		};
	}

	handleInputChange(event) {
		this.fields.push(event.target.name);

		// this.props.typingUpdateUserAction(event.target.name, event.target.value);
	}

	handleOnSubmit(event) {
		event.preventDefault();
		// const data = {};

		// updateUserAction(data, _id);
	}

	render() {
		const { userMe } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<h4>Settings Account</h4>

				<Form size="small" onSubmit={this.handleOnSubmit}>
					<Form.Input required label="Email" placeholder="Email" value={userMe.email} onChange={this.handleInputChange} />
					<Form.Input required label="Password" placeholder="Password" type="password" onChange={this.handleInputChange} />

					<Form.Button>Submit</Form.Button>
				</Form>

			</LayoutPage>
		);
	}
}

SettingsAccount.propTypes = {
	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		userMe: state.userMe.data
	};
};

export default connect(mapStateToProps, null)(SettingsAccount);

