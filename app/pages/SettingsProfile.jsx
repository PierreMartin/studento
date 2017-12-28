import React from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';

const SettingsProfile = () => {
	function getMetaData() {
		return {
			title: 'SettingsProfile',
			meta: [{ name: 'description', content: 'SettingsProfile...' }],
			link: []
		};
	}

	return (
		<LayoutPage {...getMetaData()}>
			<h4>SettingsProfile ...</h4>
		</LayoutPage>
	);
};

export default SettingsProfile;
