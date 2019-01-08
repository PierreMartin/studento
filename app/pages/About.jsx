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
			title: 'HubNote | About HubNote',
			meta: [{ name: 'description', content: 'About HubNote' }],
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

						<Header as="h2" content="About HubNote" />
						<p>Create, discover, save time, organize, share, browse the others, collaborate.</p>
						<p>HubNote is a social network that allows to take and share yours notes in class, at works, for tips or all other domain.</p>

						<div style={{ textAlign: 'left' }}>
							The app offers the following services:
							<ul>
								<li>The publication of notes that can contain: text, images, tips, ideas, source code, mathematical formulas, diagrams...</li>
								<li>The ability of giving a reliability grade to a note (between 1 and 5)</li>
								<li>The ability of add comments to a note</li>
								<li>The ability to communicate with others users by a real time chat</li>
							</ul>
						</div>

						<Accordion fluid styled>

							<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}><Icon name="dropdown" />Is it only for student?</Accordion.Title>
							<Accordion.Content active={activeIndex === 0}>
								<p>HubNote is not only for student, but userfull at work, at home and for all domains: for cooking, in computing / software development, in searching, gardening, do-it-yourself...</p>
							</Accordion.Content>

							<Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}><Icon name="dropdown" />What kinds of notes are there?</Accordion.Title>
							<Accordion.Content active={activeIndex === 1}>
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias at consequuntur ea, et illum labore maiores nobis nostrum, pariatur quibusdam quo, quod sapiente veritatis. Aperiam blanditiis explicabo natus possimus voluptas!</p>
							</Accordion.Content>

							<Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}><Icon name="dropdown" />How do you create a notes?</Accordion.Title>
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
