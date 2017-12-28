import React from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';

const SettingsAvatar = () => {
	function getMetaData() {
		return {
			title: 'SettingsAvatar',
			meta: [{ name: 'description', content: 'SettingsAvatar...' }],
			link: []
		};
	}

	return (
		<LayoutPage {...getMetaData()}>
			<h4>SettingsAvatar ...</h4>
		</LayoutPage>
	);
};

export default SettingsAvatar;
