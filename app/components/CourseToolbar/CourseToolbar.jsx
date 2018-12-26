import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ratingCourseAction } from '../../actions/courses';
import { Icon, Menu, Rating } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/courseToolbar.scss';

const cx = classNames.bind(styles);

class CourseToolbar extends Component {
	constructor(props) {
		super(props);
		this.handleItemClick = this.handleItemClick.bind(this);
		this.handleRating = this.handleRating.bind(this);
	}

	componentDidMount() {
		//
	}

	handleItemClick = (e, { name }) => {
		console.log(name);
	};

	handleRating = (e, { rating }) => {
		const { ratingCourseAction, userMe, course } = this.props;
		const data = {
			stars: course.stars || {},
			rating,
			uId: userMe._id,
			courseId: course._id,
			at: new Date().toISOString()
		};

		ratingCourseAction(data);
	};

	render() {
		const { course, authentification, userMe } = this.props;
		const author = course.uId || {};
		const disableRating = !authentification.authenticated || author._id === userMe._id;
		const stars = course.stars || {};
		const average = stars.average || 0;
		let numberOfVote = 'No vote';

		if (stars.numberOfTimeVoted === 1) {
			numberOfVote = stars.numberOfTimeVoted + ' vote';
		} else if (stars.numberOfTimeVoted > 1) {
			numberOfVote = stars.numberOfTimeVoted + ' votes';
		}

		return (
			<Menu size="tiny" icon="labeled" className={cx('toolbar-container')}>
				{ authentification.authenticated ? (
					<Menu.Item disabled name="favorite" onClick={this.handleItemClick}>
						<Icon name="favorite" />
						Add to fav
					</Menu.Item>
				) : '' }

				<Menu.Item disabled name="download" onClick={this.handleItemClick}>
					<Icon name="download" />
					Download to PDF
				</Menu.Item>

				{ authentification.authenticated && author._id === userMe._id ? (
					<Menu.Item name="setting" onClick={this.handleItemClick}>
						<Icon name="setting" />
						Edit
					</Menu.Item>
				) : '' }

				<Menu.Item name="star">
					<Rating disabled={disableRating} rating={average} maxRating={5} style={{ marginBottom: '13px' }} onRate={this.handleRating} />
					{ numberOfVote }
				</Menu.Item>
			</Menu>
		);
	}
}

CourseToolbar.propTypes = {
	authentification: PropTypes.object,
	ratingCourseAction: PropTypes.func,

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string
	}),

	course: PropTypes.shape({
		_id: PropTypes.string,
		stars: PropTypes.shape({
			average: PropTypes.number,
			numberOfTimeVoted: PropTypes.number
		})
	})
};

export default connect(null, { ratingCourseAction })(CourseToolbar);
