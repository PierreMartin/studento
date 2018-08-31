import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Table, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { doSortCoursesAction } from '../../actions/courses';
import classNames from 'classnames/bind';
import styles from './css/courseList.scss';

const cx = classNames.bind(styles);


class CoursesList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lastColumnClicked: null,
			direction: null
		};
	}

	/**
	 * Handle the sorting when click on the columns in the table
	 *
	 * @param {string} clickedColumn - the name of the colmun, it must match with the name of the field in the store
	 * @return {void}
	 * */
	handleSort = clickedColumn => () => {
		const { doSortCoursesAction } = this.props;
		const { lastColumnClicked, direction } = this.state;

		// If clicked on a new column:
		if (lastColumnClicked !== clickedColumn) {
			doSortCoursesAction({ clickedColumn, doReverse: false });
			return this.setState({ lastColumnClicked: clickedColumn, direction: 'ascending' });
		}

		doSortCoursesAction({ clickedColumn, doReverse: true });
		this.setState({ direction: direction === 'ascending' ? 'descending' : 'ascending' });
	}

	renderCoursesList(courses) {
		if (courses.length === 0) return 'No yet courses';

		return courses.map((course, key) => {
			const courseDate = moment(course.created_at).format('L');

			return (
				<Table.Row key={key} className={cx('table-body')}>
						<Table.Cell>{course.category}</Table.Cell>
						<Table.Cell>{course.subCategories.map(sb => sb)}</Table.Cell>
						<Table.Cell>{course.uId.username}</Table.Cell>
						<Table.Cell className={cx('title')}><a href={`/course/${course._id}`}>{course.title}</a></Table.Cell>
						<Table.Cell>{courseDate}</Table.Cell>
						<Table.Cell><Icon color="red" name="star" /> 121</Table.Cell>
				</Table.Row>
			);
		});
	}

	render() {
		const { courses } = this.props;
		const { lastColumnClicked, direction } = this.state;

		return (
			<div>
				<Table basic="very" padded="very" unstackable sortable className={cx('table-container')} >
					<Table.Header>
						<Table.Row className={cx('table-header')}>
							<Table.HeaderCell>Category</Table.HeaderCell>
							<Table.HeaderCell>Sub category</Table.HeaderCell>
							<Table.HeaderCell>Author</Table.HeaderCell>
							<Table.HeaderCell sorted={lastColumnClicked === 'title' ? direction : null} onClick={this.handleSort('title')}>Title</Table.HeaderCell>
							<Table.HeaderCell sorted={lastColumnClicked === 'created_at' ? direction : null} onClick={this.handleSort('created_at')}>Date</Table.HeaderCell>
							<Table.HeaderCell>Stars</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{ this.renderCoursesList(courses) }
					</Table.Body>

					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan="6">
								<Menu pagination>
									<Menu.Item as="a" icon><Icon name="chevron left" /></Menu.Item>
									<Menu.Item as="a">1</Menu.Item>
									<Menu.Item as="a">2</Menu.Item>
									<Menu.Item as="a" icon><Icon name="chevron right" /></Menu.Item>
								</Menu>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</div>
		);
	}
}

CoursesList.propTypes = {
	doSortCoursesAction: PropTypes.func,

	courses: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		category: PropTypes.string,
		subCategories: PropTypes.array,
		isPrivate: PropTypes.bool,
		content: PropTypes.string
	})).isRequired
};

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps, { doSortCoursesAction })(CoursesList);
