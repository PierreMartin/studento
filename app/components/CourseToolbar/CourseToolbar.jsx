import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ratingCourseAction } from '../../actions/courses';
import { Icon, Menu, Popup, Rating, Header, Message } from 'semantic-ui-react';
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
		// console.log(name);
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
		const pathCourseToEdit = course.type !== 'wy' ? `/courseMd/edit/${course._id}` : `/course/edit/${course._id}`;
		const author = course.uId || {};
		const disableRating = !authentification.authenticated || author._id === userMe._id;
		const stars = course.stars || {};
		const average = stars.average || 0;
		let numberOfVote = 'No vote';

		if (stars.numberOfTimeVoted === 1) {
			numberOfVote = stars.numberOfTimeVoted + ' note';
		} else if (stars.numberOfTimeVoted > 1) {
			numberOfVote = stars.numberOfTimeVoted + ' notes';
		}

		return (
			<Menu size="tiny" icon="labeled" className={cx('toolbar-container')}>
				{ authentification.authenticated ? (
					<Menu.Item disabled name="favorite" onClick={this.handleItemClick}>
						<Icon name="favorite" />
						Add to fav <br /> (coming soon)
					</Menu.Item>
				) : '' }

				<Menu.Item disabled name="download" onClick={this.handleItemClick}>
					<Icon name="download" />
					Download to PDF <br /> (coming soon)
				</Menu.Item>

				{ authentification.authenticated && author._id === userMe._id ? (
					<Menu.Item name="setting" as={Link} to={pathCourseToEdit}>
						<Icon name="pencil" />
						Edit
					</Menu.Item>
				) : '' }

				<Menu.Item name="star">

					<Popup trigger={<Rating disabled={disableRating} icon="star" rating={average} maxRating={5} style={{ marginBottom: '13px' }} onRate={this.handleRating} />} flowing hoverable>
						<Header as="h4">Give a score</Header>
						<Message info icon size="mini">
							<Icon name="attention" size="small" />
							<Message.Header>
								You can give a score for a note one time every 24h.
								<br />
								5/5 stars will correspond to a reliable note. 1/5 star will correspond to a unreliable note.
								<br />
								You can't give a score for your own notes
							</Message.Header>
						</Message>
					</Popup>
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
