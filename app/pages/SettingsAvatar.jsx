import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadAvatarUserAction, avatarMainAction } from '../actions/userMe';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Button, Grid, Modal, Header, Image, Message } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { pathImage } from './../../config/app';
import defaultAvatar150 from '../images/default-avatar-150.png';
import classNames from 'classnames/bind';
import styles from './css/settingsAvatar.scss';

const cx = classNames.bind(styles);

class SettingsAvatar extends Component {
	constructor(props) {
		super(props);
		this.dropHandler = this.dropHandler.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.uploadAvatarAction = this.uploadAvatarAction.bind(this);
		this.handleDefaultAvatar = this.handleDefaultAvatar.bind(this);
		this.renderItemsAvatar = this.renderItemsAvatar.bind(this);
		this.numberTryingLoadImg = 0;
		this.numberItems = 6; // define here the number of avatars to show
		this.numberItems--; // -1 because start to index 0

		// generate the refs :
		this.avatarsRef = [];

		for (let i = 0; i < this.numberItems; i++) {
			this.avatarsRef.push('avatarRef' + i);
		}

		// initialize the state :
		this.state = {
			avatarUploadImagePreview: {},
			openModal: false
		};
	}

	getMetaData() {
		return {
			title: 'Settings Avatar',
			meta: [{ name: 'description', content: 'Settings Avatar...' }],
			link: []
		};
	}

	/**
	 * Get the avatar by the id given by parameter
	 * @param {number} avatarId - the id of the avatar we want find
	 * @param {object} avatarsList - the list of avatars to check, from the props
	 * @return {object | null} the avatar find in the list
	 * */
	getAvatarById(avatarId, avatarsList) {
		let avatarSelected = null;

		for (let i = 0; i < avatarsList.length; i++) {
			const avatar = avatarsList[i];
			if (avatar.avatarId === avatarId) {
				avatarSelected = avatar;
				break;
			}
		}

		return avatarSelected;
	}

	/**
	 * To load the image immediately after the upload - because sometime the back-end is long :
	 * @param {string} avatarId - the id of the avatar we want find
	 * @return {void}
	 * */
	reloadImage(avatarId) {
		const { avatarsSrc } = this.props;
		const image = this.avatarsRef[avatarId];
		const that = this;

		if (image) {
			image.onerror = () => {
				that.numberTryingLoadImg++;
				if (that.numberTryingLoadImg < 5) {
					setTimeout(() => {
						image.src = `${pathImage}/${that.getAvatarById(avatarId, avatarsSrc).avatar150}`;
					}, 2000);
				}
			};
		}
	}

	/** Upload - step 1 - open the modal with image selected **/
	dropHandler(avatarId) {
		const that = this;

		function dropHandlerFile(file) {
			if (!file[0] || !file[0].preview) return;

			// send image in state for displaying in Cropper
			that.setState({avatarUploadImagePreview: {nameField: avatarId, imageSrc: file[0].preview}});

			// open modal :
			that.setState({ openModal: true });
		}

		return dropHandlerFile;
	}

	/** Upload - step 2 - close the modal and call the API **/
	uploadAvatarAction() {
		const { userMe, uploadAvatarUserAction } = this.props;
		const userId = userMe._id;
		const that = this;

		this.handleCloseModal();

		this.cropperRef.cropper.getCroppedCanvas({
			width: 150,
			height: 150,
			fillColor: '#fff',
			imageSmoothingEnabled: false,
			imageSmoothingQuality: 'high'
		});

		this.cropperRef.cropper.getCroppedCanvas().toBlob((blob) => {
			const avatarId = that.state.avatarUploadImagePreview.nameField;
			const $filename = document.querySelectorAll('#formAvatar input[type="file"]') && document.querySelectorAll('#formAvatar input[type="file"]')[avatarId];
			const filename = ($filename.files[0] && $filename.files[0].name) || 'undefined.jpg';
			const formData = new FormData();
			formData.append('formAvatar', blob, filename); // 'formAvatar' is used in routes.js

			// send image cropped to back-end :
			if (userId && formData && typeof avatarId !== 'undefined') {
				uploadAvatarUserAction(formData, userId, avatarId);
			}

			that.reloadImage(avatarId);
		});
	}

	/**
	 * Close the modal
	 * */
	handleCloseModal() {
		this.setState({ openModal: false });
	}

	/**
	 * Update the default avatar id
	 * */
	handleDefaultAvatar(avatarId) {
		const { userMe, avatarMainAction } = this.props;
		return () => {
			avatarMainAction(avatarId, userMe._id);
		};
	}

	/**
	 * render the HTML elements dropzone
	 * */
	renderItemsAvatar() {
		const { avatarMainSrc, avatarsSrc } = this.props;
		const nodeItemsAvatar = [];

		for (let i = 0; i <= this.numberItems; i++) {
			const avatarObj = this.getAvatarById(i, avatarsSrc);
			const src = avatarObj ? `${pathImage}/${avatarObj.avatar150}` : defaultAvatar150;
			const isSettableMainAvatar = avatarObj && i !== avatarMainSrc.avatarId;
			const isMainAvatar = avatarObj && i === avatarMainSrc.avatarId;
			const label = isMainAvatar ? { content: 'default', ribbon: true } : false;

			nodeItemsAvatar.push(
				<Grid.Column width={6} key={i} className={cx('dropzone-column')} >
					<div><strong>Image {i + 1}</strong><br /></div>
					<Dropzone onDrop={this.dropHandler(i)} multiple={false} accept={'image/*'} className={cx('dropzone-input')} >
						<Image src={src} alt="avatar" ref={(avatar) => { this.avatarsRef[i] = avatar; }} className={cx('avatar150')} label={label} />
					</Dropzone>

					{(isSettableMainAvatar) ? <Button basic size="tiny" style={{ margin: '5px' }} onClick={this.handleDefaultAvatar(i)}>Define as default</Button> : ''}
				</Grid.Column>
			);
		}

		return nodeItemsAvatar;
	}

	render() {
		// const { avatarMainSrc } = this.props;
		// const src = avatarMainSrc.avatar150 ? `${pathImage}/${avatarMainSrc.avatar150}` : defaultAvatar150;

		return (
			<LayoutPage {...this.getMetaData()}>
				<div>
					<h2>Add a avatar</h2>
					<p>Drag and drop a image or click for select a image.</p>
					{/*<img src={src} alt="avatar" className={cx('avatar150')} />*/}

					<Modal open={this.state.openModal} onClose={this.handleCloseModal}>
						<Modal.Header>Cropp the image</Modal.Header>
						<Modal.Content image>
							<Modal.Description>
								<Header>Cropp your Profile Image</Header>
								<Cropper
									ref={(cropper) => { this.cropperRef = cropper; }}
									src={this.state.avatarUploadImagePreview.imageSrc}
									style={{height: 400, maxWidth: '640px', margin: '0 auto'}}
									zoomable={false}
									aspectRatio={1}
									guides={false}
								/>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button color="black" onClick={this.handleCloseModal}>Cancel</Button>
							<Button positive icon="checkmark" labelPosition="right" content="Ok" onClick={this.uploadAvatarAction} />
						</Modal.Actions>
					</Modal>

					<Grid className={cx('dropzone-container')} id="formAvatar">
						<Grid.Row className={cx('row')}>
							{ this.renderItemsAvatar() }
						</Grid.Row>
					</Grid>

					<Message header="Note" content="Don't forget to select a avatar as default." />

				</div>
			</LayoutPage>
		);
	}
}

SettingsAvatar.propTypes = {
	uploadAvatarUserAction: PropTypes.func,
	avatarMainAction: PropTypes.func,

	avatarsSrc: PropTypes.arrayOf(PropTypes.shape({
		avatarId: PropTypes.number,
		avatar80: PropTypes.string,
		avatar150: PropTypes.string
	})),

	avatarMainSrc: PropTypes.shape({
		avatarId: PropTypes.number,
		avatar80: PropTypes.string,
		avatar150: PropTypes.string
	}),

	userMe: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		_id: PropTypes.string,
		password: PropTypes.string
	})
};

const mapStateToProps = (state) => {
	return {
		userMe: state.userMe.data,
		avatarsSrc: state.userMe.data.avatarsSrc,
		avatarMainSrc: state.userMe.data.avatarMainSrc
	};
};

export default connect(mapStateToProps, { uploadAvatarUserAction, avatarMainAction })(SettingsAvatar);
