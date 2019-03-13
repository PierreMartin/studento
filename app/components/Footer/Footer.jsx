import React from 'react';
import { Link } from 'react-router';
import { Grid, Header, List, Segment, Container } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/footer.scss';

const cx = classNames.bind(styles);


const Footer = () => {
	return (
		<Segment vertical className={cx('footer-container')}>
			<Container text>
				<Grid divided stackable>
					<Grid.Row className={cx('footer-row')}>
						<Grid.Column width={3}>
							<Header as="h4" content="Navigation" className={cx('header')} />
							<List link>
								<List.Item as={Link} to={'/'}>Home</List.Item>
								<List.Item as={Link} to={'/about'}>About</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={4}>
							<Header as="h4" content="Terms & Privacy" className={cx('header')} />
							<List link>
								<List.Item as={Link} to={'/terms'}>Terms of service - Conditions Générales d'Utilisation (CGU)</List.Item>
								<List.Item as={Link} to={'/privacy-policy'}>Privacy Policy - Politique de confidentialité</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={4}>
							<Header as="h4" className={cx('header')}>HubNote</Header>
							<p><a href="mailto:pierremartin.pro@gmail.com?subject=Demande%information%HubNote">Contact</a></p>
							<p>Copyright © 2019 HubNote - All rights reserved</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</Segment>
	);
};

export default Footer;
