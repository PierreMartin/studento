import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment/moment';
import { Form, Comment, Button, Header } from 'semantic-ui-react';
import defaultAvatar28 from '../../images/default-avatar-28.png';
import { pathImage } from '../../../config/app';


const renderCommentList = (
	comments,
	authentification,
	handleInputCommentSubmit,
	handleReplyCommentClick,
	indexCommentToReply,
	fieldsTypingComment,
	handleInputCommentChange
) => {
	if (comments && comments.length === 0) return;

	return comments.map((comment, key) => {
		const commentDate = moment(comment.at).format('L');
		const commentContent = comment.content || '';
		const author = comment.uId || {};
		const src = author.avatarMainSrc && author.avatarMainSrc.avatar28 ? `${pathImage}/${author.avatarMainSrc.avatar28}` : defaultAvatar28;
		let formReply = '';

		// If comment reply:
		if (key === indexCommentToReply && authentification.authenticated) {
			// Pass the Id of parent comment to handleInputCommentSubmit for bind the parent to reply
			formReply = (
				<Form reply onSubmit={handleInputCommentSubmit(comment._id)}>
					<Form.TextArea placeholder="Your comment here..." name="commentReply" value={fieldsTypingComment.commentReply || ''} /* error={updateMissingRequiredField.content} */ onChange={handleInputCommentChange} />
					<Button content="Add Reply" labelPosition="left" icon="edit" primary />
				</Form>
			);
		}

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
				<Comment.Avatar src={src} />
				<Comment.Content>
					<Comment.Author as={Link} to={`/user/${author._id}`}>{ author.username }</Comment.Author>
					<Comment.Metadata>
						<div>{ commentDate }</div>
					</Comment.Metadata>
					<Comment.Text>{ commentContent }</Comment.Text>
					<Comment.Actions>
						{ authentification.authenticated ?
							<Comment.Action onClick={handleReplyCommentClick(key)}>Reply</Comment.Action> : ''
						}
					</Comment.Actions>
					{ formReply }
				</Comment.Content>
			</Comment>
		);
	});
};

const renderCommentForm = (handleInputCommentChange, handleInputCommentSubmit, fieldsTypingComment) => {
	// const messagesError = this.dispayFieldsErrors(updateMissingRequiredField, updateMessageError);

	return (
		<Form reply /* error={messagesError.props.children.length > 0} */ size="small" onSubmit={handleInputCommentSubmit()}>
			<Form.TextArea placeholder="Your comment here..." name="commentMain" value={fieldsTypingComment.commentMain || ''} /* error={updateMissingRequiredField.content} */ onChange={handleInputCommentChange} />
			{/* <Message error content={messagesError} /> */}
			<Button content="Add Reply" labelPosition="left" icon="edit" primary />
		</Form>
	);
};

const Comments = ({
										commentedBy,
										authentification,
										handleInputCommentChange,
										handleInputCommentSubmit,
										fieldsTypingComment,
										handleReplyCommentClick,
										indexCommentToReply
}) => {
	return (
		<Comment.Group size="mini">
			<Header as="h3" dividing>Comments</Header>

			{ renderCommentList(commentedBy, authentification, handleInputCommentSubmit, handleReplyCommentClick, indexCommentToReply, fieldsTypingComment, handleInputCommentChange) }
			{ authentification.authenticated && renderCommentForm(handleInputCommentChange, handleInputCommentSubmit, fieldsTypingComment) }
		</Comment.Group>
	);
};

Comments.propTypes = {
	commentedBy: PropTypes.arrayOf(PropTypes.shape({
		uId: PropTypes.shape({ // populate
			_id: PropTypes.string,
			username: PropTypes.string,
			avatarMainSrc: PropTypes.shape({
				avatar28: PropTypes.string
			})
		}),
		content: PropTypes.string,
		at: PropTypes.string
	})),

	authentification: PropTypes.object,
	handleInputCommentChange: PropTypes.func,
	handleInputCommentSubmit: PropTypes.func,
	fieldsTypingComment: PropTypes.object,

	handleReplyCommentClick: PropTypes.func,
	indexCommentToReply: PropTypes.number
};

export default Comments;
