import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';
import LayoutPage from '../LayoutPage/LayoutPage';
import SettingsNavigation from '../../navigations/SettingsNavigation/SettingsNavigation';

const LayoutSettings = ({ children }) => {
	function getMetaData() {
		return {
			title: 'Settings',
			meta: [{ name: 'description', content: 'Settings ...' }],
			link: []
		};
	}

	return (
		<LayoutPage {...getMetaData()}>
			<Segment vertical style={{ minHeight: 800 }}>
				<Grid container>
					<Grid.Column mobile={16} tablet={4} computer={4}>
						<SettingsNavigation />
					</Grid.Column>

					<Grid.Column stretched mobile={16} tablet={12} computer={12}>
						<Segment>
							{children || <p>Click on a link for display the list</p>}
						</Segment>
					</Grid.Column>
				</Grid>
			</Segment>
		</LayoutPage>
	);
};

LayoutSettings.propTypes = {
	children: PropTypes.object
};

export default LayoutSettings;
