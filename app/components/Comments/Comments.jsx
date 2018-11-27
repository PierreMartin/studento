import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment/moment';
import { Form, Comment, Button, Header } from 'semantic-ui-react';


const renderCommentList = (comments) => {
	if (comments && comments.length === 0) return;

	return comments.map((comment, key) => {
		const commentDate = moment(comment.at).format('L');
		const commentContent = comment.content || '';
		const author = comment.uId || {};

		/*
		<Comment>
			<Comment.Avatar src='/images/avatar/small/elliot.jpg' />
			<Comment.Content>
				<Comment.Author as='a'>Elliot Fu</Comment.Author>
				<Comment.Metadata>
					<div>Yesterday at 12:30AM</div>
				</Comment.Metadata>
				<Comment.Text>
					<p>This has been very useful for my research. Thanks as well!</p>
				</Comment.Text>
				<Comment.Actions>
					<Comment.Action>Reply</Comment.Action>
				</Comment.Actions>
			</Comment.Content>
			<Comment.Group>
				<Comment>
					<Comment.Avatar src='/images/avatar/small/jenny.jpg' />
					<Comment.Content>
						<Comment.Author as='a'>Jenny Hess</Comment.Author>
						<Comment.Metadata>
							<div>Just now</div>
						</Comment.Metadata>
						<Comment.Text>Elliot you are always so right :)</Comment.Text>
						<Comment.Actions>
							<Comment.Action>Reply</Comment.Action>
						</Comment.Actions>
					</Comment.Content>
				</Comment>
			</Comment.Group>
		</Comment>

		<Comment>
			<Comment.Avatar src='/images/avatar/small/joe.jpg' />
			<Comment.Content>
				<Comment.Author as='a'>Joe Henderson</Comment.Author>
				<Comment.Metadata>
					<div>5 days ago</div>
				</Comment.Metadata>
				<Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
				<Comment.Actions>
					<Comment.Action>Reply</Comment.Action>
				</Comment.Actions>
			</Comment.Content>
		</Comment>
		*/

		return (
			<Comment key={key}>
				<Comment.Avatar src="/images/avatar/small/matt.jpg" />
				<Comment.Content>
					<Comment.Author as={Link} to={`/user/${author._id}`}>{ author.username }</Comment.Author>
					<Comment.Metadata>
						<div>{ commentDate }</div>
					</Comment.Metadata>
					<Comment.Text>{ commentContent }</Comment.Text>
					<Comment.Actions>
						<Comment.Action>Reply</Comment.Action>
					</Comment.Actions>
				</Comment.Content>
			</Comment>
		);
	});
};

const renderCommentForm = (handleInputCommentChange, handleInputCommentSubmit, typingContentComment) => {
	// const messagesError = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);

	return (
		<Form reply /* error={messagesError.props.children.length > 0} */ size="small" onSubmit={handleInputCommentSubmit}>
			<Form.TextArea placeholder="Your comment here..." name="content" value={typingContentComment || ''} /* error={updateMissingRequiredField.content} */ onChange={handleInputCommentChange} />
			{/* <Message error content={messagesError} /> */}
			<Button content="Add Reply" labelPosition="left" icon="edit" primary />
		</Form>
	);
};

const Comments = ({ comments, authentification, handleInputCommentChange, handleInputCommentSubmit, typingContentComment }) => {
	return (
		<Comment.Group size="mini">
			<Header as="h3" dividing>Comments</Header>

			{ renderCommentList(comments) }
			{ authentification.authenticated && renderCommentForm(handleInputCommentChange, handleInputCommentSubmit, typingContentComment) }
		</Comment.Group>
	);
};

Comments.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.shape({
		uId: PropTypes.string, // TODO voir si populé
		content: PropTypes.string
	})),

	authentification: PropTypes.object,
	handleInputCommentChange: PropTypes.func,
	handleInputCommentSubmit: PropTypes.func,
	typingContentComment: PropTypes.string
};

export default Comments;
