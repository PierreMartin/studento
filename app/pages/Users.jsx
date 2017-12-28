import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UsersList from '../components/UsersList/UsersList';


class Users extends Component {
	getMetaData() {
		return {
			title: 'Users',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	render() {
		const { users } = this.props;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<UsersList users={users} />
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Users.propTypes = {
	users: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})).isRequired
};

const mapStateToProps = (state) => {
	return {
		users: state.users.all
	};
};

export default connect(mapStateToProps, null)(Users);
