import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Header } from 'semantic-ui-react';

const BasicModal = ({
		isOpen,
		title,
		cancelAction,
		submitAction,
		description,
		handleModalSetContent,
		handleModalClose,
		handleModalSubmit,
		datas
	}) => {
	return (
		<Modal open={isOpen} onClose={handleModalClose}>
			<Modal.Header>{title}</Modal.Header>

			<Modal.Content image>
				<Modal.Description>
					<Header>{description}</Header>

					{ handleModalSetContent && handleModalSetContent() }

				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button color="black" onClick={handleModalClose}>{cancelAction}</Button>
				<Button icon="checkmark" color="red" labelPosition="right" content={submitAction} onClick={handleModalSubmit(datas)} />
			</Modal.Actions>
		</Modal>
	);
};

BasicModal.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	cancelAction: PropTypes.string,
	submitAction: PropTypes.string,
	handleModalSetContent: PropTypes.func,
	handleModalClose: PropTypes.func,
	handleModalSubmit: PropTypes.func,
	datas: PropTypes.any
};

export default BasicModal;
