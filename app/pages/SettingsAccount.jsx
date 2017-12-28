import React from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';

const SettingsAccount = () => {
	function getMetaData() {
		return {
			title: 'SettingsAccount',
			meta: [{ name: 'description', content: 'SettingsAccount...' }],
			link: []
		};
	}

	return (
		<LayoutPage {...getMetaData()}>
			<h4>SettingsAccount ...</h4>
		</LayoutPage>
	);
};

export default SettingsAccount;
