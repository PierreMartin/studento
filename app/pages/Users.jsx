import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUsersByFieldAction } from '../actions/user';
import { Container, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import UsersList from '../components/UsersList/UsersList';


class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paginationIndexPage: 1
		};
	}

	componentDidMount() {
		this.props.fetchUsersByFieldAction({ keyReq: 'all', valueReq: 'all' });
	}

	getMetaData() {
		return {
			title: 'Users list',
			meta: [{ name: 'description', content: 'bla blah' }],
			link: []
		};
	}

	handlePaginationChange = (e, { activePage }) => {
		const { fetchUsersByFieldAction, users } = this.props;
		const { paginationIndexPage } = this.state;
		if (activePage === paginationIndexPage) return;

		const directionIndex = activePage - paginationIndexPage;
		const currentUserId = users[0] && users[0]._id; // id of first record on current page.

		this.setState({ paginationIndexPage: activePage });

		fetchUsersByFieldAction({ keyReq: 'all', valueReq: 'all', currentUserId, directionIndex });
	}

	render() {
		const { users, usersPagesCount } = this.props;
		const { paginationIndexPage } = this.state;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<Container text>
						<UsersList
							users={users}
							usersPagesCount={usersPagesCount}
							handlePaginationChange={this.handlePaginationChange}
							paginationIndexPage={paginationIndexPage}
						/>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

Users.propTypes = {
	fetchUsersByFieldAction: PropTypes.func,
	usersPagesCount: PropTypes.number,

	users: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})).isRequired
};

const mapStateToProps = (state) => {
	return {
		users: state.users.all,
		usersPagesCount: state.users.pagesCount
	};
};

export default connect(mapStateToProps, { fetchUsersByFieldAction })(Users);
