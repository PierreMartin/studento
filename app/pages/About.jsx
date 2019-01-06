import React, { Component } from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Container, Header, Segment, Accordion, Icon } from 'semantic-ui-react';
import hubNoteLogo from '../images/logo_hubnote_200.png';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';

const cx = classNames.bind(stylesMain);

class About extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);

		this.state = {
			activeIndex: 0
		};
	}

	getMetaData() {
		return {
			title: 'About | Studento',
			meta: [{ name: 'description', content: 'About' }],
			link: []
		};
	}

	handleClick = (e, { index }) => {
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	}

	render() {
		const { activeIndex } = this.state;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment textAlign="center" vertical>
					<Container text>
						<div className={cx('logo')}>
							<img src={hubNoteLogo} alt="Logo HubNote" />
						</div>

						<Header as="h2" content="About studento" />
						<p>Studento is a global e-learning that allows many participants to master new skills and achieve their goals by following courses</p>

						<Accordion fluid styled>

							<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}><Icon name="dropdown" />Is it only for student?</Accordion.Title>
							<Accordion.Content active={activeIndex === 0}>
								<p>Studento is not only for student, but userfull at work, at home and for all domains: for cooking, in computing / software development, in searching, gardening, do-it-yourself...</p>
							</Accordion.Content>

							<Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}><Icon name="dropdown" />What kinds of courses are there?</Accordion.Title>
							<Accordion.Content active={activeIndex === 1}>
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias at consequuntur ea, et illum labore maiores nobis nostrum, pariatur quibusdam quo, quod sapiente veritatis. Aperiam blanditiis explicabo natus possimus voluptas!</p>
							</Accordion.Content>

							<Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}><Icon name="dropdown" />How do you create a courses?</Accordion.Title>
							<Accordion.Content active={activeIndex === 2}>
								<p>lorem...</p>
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consectetur cum dignissimos dolore eaque eum facere itaque iusto, minima nisi nulla officia porro provident quidem quis quo unde veritatis, voluptatibus?</p>
							</Accordion.Content>

						</Accordion>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

export default About;
