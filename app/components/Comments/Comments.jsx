import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { Form, Comment, Button, Header } from 'semantic-ui-react';
import defaultAvatar28 from '../../images/default-avatar-28.png';
import { pathImage } from '../../../config/app';

const renderCommentReplyList = (commentsReply) => {
	if (commentsReply.length <= 0) return false;

	return commentsReply.map((comment, key) => {
		const commentDate = moment(comment.at).format('MMMM Y Do LT');
		const commentContent = comment.content || '';
		const author = comment.uId || {};
		const src = author.avatarMainSrc && author.avatarMainSrc.avatar28 ? `${pathImage}/${author.avatarMainSrc.avatar28}` : defaultAvatar28;

		return (
			<Comment key={key}>
				<Comment.Avatar src={src} />
				<Comment.Content>
					<Comment.Author as={Link} to={`/user/${author._id}`}>{ author.username }</Comment.Author>
					<Comment.Metadata>
						<div>{ commentDate }</div>
					</Comment.Metadata>
					<Comment.Text>{ commentContent }</Comment.Text>
				</Comment.Content>
			</Comment>
		);
	});
};

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
		const commentDate = moment(comment.at).format('MMMM Y Do LT');
		const commentContent = comment.content || '';
		const author = comment.uId || {};
		const replyBy = comment.replyBy || [];
		const src = author.avatarMainSrc && author.avatarMainSrc.avatar28 ? `${pathImage}/${author.avatarMainSrc.avatar28}` : defaultAvatar28;
		const commentReplyListNode = renderCommentReplyList(replyBy);
		let formReply = '';

		// Display form reply when clicked:
		if (key === indexCommentToReply && authentification.authenticated) {
			// Pass the Id of parent comment to handleInputCommentSubmit for bind the parent to reply
			formReply = (
				<Form reply onSubmit={handleInputCommentSubmit(comment._id)}>
					<Form.TextArea placeholder="Your comment here..." name="commentReply" value={fieldsTypingComment.commentReply || ''} /* error={updateMissingRequiredField.content} */ onChange={handleInputCommentChange} />
					<Button content="Add Reply" labelPosition="left" icon="edit" primary />
				</Form>
			);
		}

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

				{ commentReplyListNode && <Comment.Group size="mini">{ commentReplyListNode } </Comment.Group> }
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
		at: PropTypes.string,
		replyBy: PropTypes.array
	})),

	authentification: PropTypes.object,
	handleInputCommentChange: PropTypes.func,
	handleInputCommentSubmit: PropTypes.func,
	fieldsTypingComment: PropTypes.object,

	handleReplyCommentClick: PropTypes.func,
	indexCommentToReply: PropTypes.number
};

export default Comments;
