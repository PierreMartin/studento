import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Form, Icon, Button } from 'semantic-ui-react';
import { Picker } from 'emoji-mart';
import { emojify } from 'react-emojione';
import styles from './css/tchat.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class TchatInput extends Component {
	constructor(props) {
		super(props);

		// handle open modal emoji:
		this.handleClickOpenModalEmoji = this.handleClickOpenModalEmoji.bind(this);
		this.handleClickOutsideModalEmoji = this.handleClickOutsideModalEmoji.bind(this);

		this.handleSubmitEmoji = this.handleSubmitEmoji.bind(this);

		this.state = {
			openModalEmoji: false
		};
	}

	componentDidMount() {
		// Obliged to use addEventListener for handle the events outside a element
		document.addEventListener('mousedown', this.handleClickOutsideModalEmoji);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutsideModalEmoji);
	}

	handleClickOpenModalEmoji() {
		this.setState({ openModalEmoji: !this.state.openModalEmoji });
	}

	handleClickOutsideModalEmoji(event) {
		const contentEmojiNode = ReactDOM.findDOMNode(this.contentEmojiRef);

		// If picker open and click ouside him:
		if (this.state.openModalEmoji && contentEmojiNode && !contentEmojiNode.contains(event.target)) {
			this.setState({ openModalEmoji: false });
		}
	}

	handleSubmitEmoji(emoji) {
		if (!emoji.native) return;

		this.props.addEmoji(emoji.native);
		this.setState({ openModalEmoji: false });
	}

	renderUsersTyping(typings) {
		let usersToDisplay = '';

		if (typings.length > 0) {
			for (let i = 0; i < typings.length; i++) {
				const typing = typings[i];
				if (typing.username) {
					const multiUsers = (typings.length > 1 && i + 1 < typings.length) ? ', ' : '';
					usersToDisplay += `${typing.username} is typing...` + multiUsers;
				}
			}
		}

		return usersToDisplay;
	}

	render() {
		const { handleChangeSendMessage, handleSubmitSendMessage, value, typings } = this.props;
		const usersTyping = this.renderUsersTyping(typings);
		const valueEmojify = emojify(value, {output: 'unicode'});

		return (
			<Form onSubmit={handleSubmitSendMessage}>
				<Form.Input placeholder={usersTyping || 'Your message...'} >
					<input value={valueEmojify || ''} onChange={handleChangeSendMessage} ref={(el) => { this.inputRef = el; }} style={{ background: 'inherit' }} />

					<span ref={(el) => { this.contentEmojiRef = el; }} >
						{ this.state.openModalEmoji && <Picker set="apple" emojiSize={20} onClick={this.handleSubmitEmoji} /> }
						<Icon size="big" name="smile" color="grey" link onClick={this.handleClickOpenModalEmoji} className={cx('picto-emoji')} />
					</span>

					<Button icon="send" color="teal" type="submit" />
				</Form.Input>
			</Form>
		);
	}
}


TchatInput.propTypes = {
	handleChangeSendMessage: PropTypes.func,
	handleSubmitSendMessage: PropTypes.func,
	addEmoji: PropTypes.func,
	value: PropTypes.string,

	typings: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string,
		channelId: PropTypes.string
	}))
};

export default TchatInput;
