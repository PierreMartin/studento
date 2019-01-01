import React from 'react';
import { Link } from 'react-router';
import { Grid, Header, List, Segment, Container } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/footer.scss';

const cx = classNames.bind(styles);


const Footer = () => {
	return (
		<Segment inverted vertical className={cx('footer-container')}>
			<Container text>
				<Grid divided inverted stackable>
					<Grid.Row className={cx('footer-row')}>
						<Grid.Column width={3}>
							<Header inverted as="h4" content="Navigation" />
							<List link inverted>
								<List.Item as={Link} to={'/'}>Home</List.Item>
								<List.Item as={Link} to={'/about'}>About</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={3}>
							<Header inverted as="h4" content="Services" />
							<List link inverted>
								<List.Item as={Link} to={'/term'}>Terms of service - Conditions Générales d'Utilisation (CGU)</List.Item>
								<List.Item as={Link} to={'/privacy-policy'}>Privacy Policy - Politique de confidentialité</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={7}>
							<Header as="h4" inverted>Pierre Martin</Header>
							<p>Powered by NodeJs, MongoDB, React and Redux</p>
							<p>Source code available on <a href="https://github.com/PierreMartin/studento" rel="noopener noreferrer" target="_blank">Github</a></p>
							<p>Copyright © 2018 Pierre Martin - All rights reserved</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</Segment>
	);
};

export default Footer;
