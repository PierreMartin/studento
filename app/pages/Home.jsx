import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Fade from 'react-reveal/Fade';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { Button, Container, Grid, Icon, Segment } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import CourseSearch from '../components/CourseSearch/CourseSearch';
import editorTiny from '../images/editor_tiny.jpg';
import editorMd from '../images/editor_md.jpg';
import editorCode from '../images/editor_code.jpg';
import chat from '../images/chat.jpg';
import katex from '../images/katex.jpg';
import tables from '../images/tables.jpg';
import sci from '../images/sci.jpg';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesHome from './css/home.scss';

const cx = classNames.bind({...stylesMain, ...stylesHome});

class Home extends Component {
	constructor(props) {
		super(props);
		this.handleSelectCategory = this.handleSelectCategory.bind(this);
		this.handleSelectSubCategory = this.handleSelectSubCategory.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.handleSearchSelect = this.handleSearchSelect.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);

		this.state = {
			paginationIndexPage: 1,
			fieldSearchTyping: '',
			fieldSearchSelect: 'all',
			category: {
				lastClicked: null,
				clickedIndex: 0
			},
			subCategory: {
				lastClicked: null
			}
		};
	}

	componentDidMount() {
		this.props.fetchCoursesByFieldAction({ keyReq: 'all', valueReq: 'all' }); // All courses
	}

	getMetaData() {
		return {
			title: 'HubNote | Home',
			meta: [{ name: 'description', content: 'HubNote' }],
			link: []
		};
	}

	handleSelectCategory = (clickedCategory, clickedIndex) => () => {
		const { fetchCoursesByFieldAction } = this.props;
		this.setState({
			category: { lastClicked: clickedCategory, clickedIndex},
			paginationIndexPage: 1, // reset
			fieldSearchTyping: '', // reset
			fieldSearchSelect: 'all', // reset
			subCategory: { lastClicked: null } // reset
		});
		fetchCoursesByFieldAction({ keyReq: 'category', valueReq: clickedCategory });
	};

	handleSelectSubCategory = clickedSubCategory => () => {
		const { fetchCoursesByFieldAction } = this.props;
		this.setState({
			subCategory: { lastClicked: clickedSubCategory },
			paginationIndexPage: 1, // reset
			fieldSearchTyping: '', // reset
			fieldSearchSelect: 'all' // reset
		});
		fetchCoursesByFieldAction({ keyReq: 'subCategories', valueReq: clickedSubCategory });
	};

	handleSearchSelect = (e, { value }) => {
		this.setState({ fieldSearchSelect: value, paginationIndexPage: 1 }, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearchTyping, { valueReq: this.state.fieldSearchSelect });
		});
	};

	handleSearchInput = (e, { value }) => {
		if (value === ' ' || value === '  ') return;

		this.setState({
			fieldSearchTyping: value,
			paginationIndexPage: 1, // reset
			category: { lastClicked: null }, // reset
			subCategory: { lastClicked: null } // reset
		}, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearchTyping, { valueReq: this.state.fieldSearchSelect });
		});
	};

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, fetchCoursesBySearchAction } = this.props;
		const { category, subCategory, paginationIndexPage, fieldSearchTyping } = this.state;
		if (activePage === paginationIndexPage) return;

		this.setState({ paginationIndexPage: activePage });

		if (category.lastClicked !== null) return fetchCoursesByFieldAction({ keyReq: 'category', valueReq: category.lastClicked, activePage });
		if (subCategory.lastClicked !== null) return fetchCoursesByFieldAction({ keyReq: 'subCategory', valueReq: subCategory.lastClicked, activePage });
		if (fieldSearchTyping !== '') return fetchCoursesBySearchAction(fieldSearchTyping, { valueReq: this.state.fieldSearchSelect }, activePage);

		fetchCoursesByFieldAction({ keyReq: 'all', valueReq: 'all', activePage });
	};

	renderSubCategories(categoryParam) {
		const { subCategory } = this.state;

		const buttonsSubCategoriesNode = categoryParam.subCategories.map((subCat, index) => {
			return (<Button key={index} basic secondary size="tiny" active={subCategory.lastClicked === subCat.key} onClick={this.handleSelectSubCategory(subCat.key)}>{subCat.name}</Button>);
		});

		return (
			<div style={{textAlign: 'center'}} className={cx('sub-categories')}>
				{buttonsSubCategoriesNode}
			</div>
		);
	}

  render() {
		const { courses, coursesPagesCount, categories, authentification } = this.props;
		const { category, fieldSearchTyping, paginationIndexPage } = this.state;
		const styles = authentification.authenticated ? { marginTop: '110px' } : {};
		const citationStr = '"Every scientist knows that thorough examinations and skepticism are the power of science. All theories and knowledge are tentative and science is slowly leading us to a better understanding of the truth. There is no certainty, only probability and statistical significance"';

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" vertical className={cx('home-header-segment')}>
					<Container className={cx('home-header-container')} style={styles} >
						<Fade top ssrReveal duration={800}>
							<h1 className={cx('title')}>Start to share your notes <br />with the world</h1>
						</Fade>
						<Fade bottom ssrReveal duration={1000}>
							<h2 className={cx('sub-title')}>Goodbye flying paper - HubNote is a social network that allows to take and share yours notes in class, at works, for tips or all other domain.</h2>
						</Fade>
						{ !authentification.authenticated && <Button className={cx('signup-button')} as={Link} to="/signup" basic inverted size="huge">Sign up<Icon name="right arrow" /></Button> }
					</Container>
				</Segment>

				<Segment vertical className={cx('home-infos-segment')}>
					<Container className={cx('home-infos-container')}>
						<Grid divided stackable>
							<Grid.Row className={cx('row')}>
								<Grid.Column width={11}>
									<Fade ssrReveal left duration={800} delay={800}><img src={editorTiny} alt="The editor" /></Fade>
								</Grid.Column>
								<Grid.Column width={5}>
									<h2>More than just a note</h2>
									<p>Take and share yours notes in class, at works, for tips or all other domain. Add some personality with images, source code, mathematical formulas and diagrams.</p>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={5}>
									<h2>Markdown editor</h2>
									<p>Developer or developer-Friendly? Create yours notes with markdown syntax. A toolbar will help you to format the documents.</p>
								</Grid.Column>
								<Grid.Column width={11}>
									<Fade ssrReveal right duration={800} delay={900}><img src={editorMd} alt="Markdown editor" /></Fade>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={11}>
									<Fade left duration={800}><img src={editorCode} alt="Code editor" /></Fade>
								</Grid.Column>
								<Grid.Column width={5}>
									<h2>Write your code</h2>
									<p>Select a language and start to write some code for insert where you want in your document.</p>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={5}>
									<h2>Katex editor</h2>
									<p>Use the fastest math typesetting for the web. Insert hundreds of expressions in your documents.</p>
								</Grid.Column>
								<Grid.Column width={11}>
									<Fade right duration={800}><img src={katex} alt="Katex editor" /></Fade>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={11}>
									<Fade left duration={800}><img src={sci} alt="Science & chemistry editor" /></Fade>
								</Grid.Column>
								<Grid.Column width={5}>
									<h2>Math equations & chemistry editor</h2>
									<p>Use Wiris Mathtype for easily include quality math equations in your documents and digital content.</p>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={5}>
									<h2>Tables</h2>
									<p>Insert easily tables in your documents and presentations.</p>
								</Grid.Column>
								<Grid.Column width={11}>
									<Fade right duration={800}><img src={tables} alt="Tables" /></Fade>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row className={cx('row')}>
								<Grid.Column width={11}>
									<Fade left duration={800}><img src={chat} alt="Real time chat" /></Fade>
								</Grid.Column>
								<Grid.Column width={5}>
									<h2>Real time chat</h2>
									<p>Interact with others users with a real time chat.</p>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
				</Segment>

				{/*
				<Segment inverted textAlign="center" vertical className={cx('home-templates-segment')}>
					<Container className={cx('home-templates-container')} >
						<h2 className={cx('title')}>Templates</h2>
						<Fade left duration={800}>
							<img src="" alt="" />
						</Fade>
					</Container>
				</Segment>
				*/}

				<Segment textAlign="center" vertical className={cx('home-citation-segment')}>
					<Container>
							<blockquote>
								<Fade ssrReveal duration={3000}>
									<h2 className={cx('title')}>{citationStr}</h2>
								</Fade>
							</blockquote>
					</Container>
				</Segment>

				<Segment vertical className={cx('home-courses-segment')}>
					<Container text className={cx('courses-container')}>
						<h2 style={{ textAlign: 'center' }}>Trendy notes</h2>

						<div className={cx('categories')}>
							{categories.map((cat, index) => (<Button basic primary key={index} active={category.lastClicked === cat.key} onClick={this.handleSelectCategory(cat.key, index)}>{cat.name}</Button>))}
						</div>

						{ category.lastClicked && category.lastClicked.length > 0 ? this.renderSubCategories(categories[category.clickedIndex]) : ''}

						<CourseSearch
							handleSearchInput={this.handleSearchInput}
							handleSearchSelect={this.handleSearchSelect}
							fieldSearchTyping={fieldSearchTyping}
							categories={categories}
							from="home"
						/>
						<br />

						<CoursesList
							courses={courses}
							coursesPagesCount={coursesPagesCount}
							handlePaginationChange={this.handlePaginationChange}
							paginationIndexPage={paginationIndexPage}
						/>

					</Container>
				</Segment>

				{/*
				<Segment inverted textAlign="center" vertical className={cx('home-templates-segment')}>
					<Container className={cx('home-templates-container')} >
						<h2 className={cx('title')}>Sign up</h2>
					</Container>
				</Segment>
				*/}

      </LayoutPage>
    );
  }
}

Home.propTypes = {
	fetchCoursesByFieldAction: PropTypes.func,
	fetchCoursesBySearchAction: PropTypes.func,
	coursesPagesCount: PropTypes.number,

	authentification: PropTypes.shape({
		authenticated: PropTypes.bool
	}),

	courses: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		id: PropTypes.string,
		price: PropTypes.number,
		title: PropTypes.string
	})).isRequired,

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	}))
};

const mapStateToProps = (state) => {
	return {
		courses: state.courses.all,
		coursesPagesCount: state.courses.pagesCount,
		categories: state.categories.all,
		authentification: state.authentification
	};
};

export default connect(mapStateToProps, { fetchCoursesByFieldAction, fetchCoursesBySearchAction })(Home);
