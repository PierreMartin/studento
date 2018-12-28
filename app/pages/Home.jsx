import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { Button, Container, Header, Icon, Segment, Divider, Message } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import CourseSearch from '../components/CourseSearch/CourseSearch';
import classNames from 'classnames/bind';
import styles from './css/home.scss';

const cx = classNames.bind(styles);

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
			fieldSearch: {
				select: 'all',
				typing: ''
			},
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
			title: 'Home | Studento',
			meta: [{ name: 'description', content: 'Studento' }],
			link: []
		};
	}

	handleSelectCategory = (clickedCategory, clickedIndex) => () => {
		const { fetchCoursesByFieldAction } = this.props;
		this.setState({
			category: { lastClicked: clickedCategory, clickedIndex},
			paginationIndexPage: 1, // reset
			fieldSearch: { typing: '', select: 'all' }, // reset
			subCategory: { lastClicked: null } // reset
		});
		fetchCoursesByFieldAction({ keyReq: 'category', valueReq: clickedCategory });
	}

	handleSelectSubCategory = clickedSubCategory => () => {
		const { fetchCoursesByFieldAction } = this.props;
		this.setState({
			subCategory: { lastClicked: clickedSubCategory },
			paginationIndexPage: 1, // reset
			fieldSearch: { typing: '', select: 'all' } // reset
		});
		fetchCoursesByFieldAction({ keyReq: 'subCategories', valueReq: clickedSubCategory });
	}

	handleSearchSelect = (e, { value }) => {
		this.setState({ fieldSearch: { ...this.state.fieldSearch, select: value }, paginationIndexPage: 1 }, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	handleSearchInput = (e, { value }) => {
		if (value === ' ' || value === '  ') return;

		this.setState({
			fieldSearch: { ...this.state.fieldSearch, typing: value },
			paginationIndexPage: 1, // reset
			category: { lastClicked: null }, // reset
			subCategory: { lastClicked: null } // reset
		}, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, courses, fetchCoursesBySearchAction } = this.props;
		const { category, subCategory, fieldSearch, paginationIndexPage } = this.state;
		if (activePage === paginationIndexPage) return;

		const directionIndex = activePage - paginationIndexPage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		this.setState({ paginationIndexPage: activePage });

		if (category.lastClicked !== null) return fetchCoursesByFieldAction({ keyReq: 'category', valueReq: category.lastClicked, currentCourseId, directionIndex });
		if (subCategory.lastClicked !== null) return fetchCoursesByFieldAction({ keyReq: 'subCategory', valueReq: subCategory.lastClicked, currentCourseId, directionIndex });
		if (fieldSearch.typing !== '') return fetchCoursesBySearchAction({ ...fieldSearch, currentCourseId, directionIndex });

		fetchCoursesByFieldAction({ keyReq: 'all', valueReq: 'all', currentCourseId, directionIndex });
	}

	renderSubCategories(categoryParam) {
		const { subCategory } = this.state;

		const buttonsSubCategoriesNode = categoryParam.subCategories.map((subCat, index) => {
			return (<Button key={index} basic size="tiny" active={subCategory.lastClicked === subCat.key} onClick={this.handleSelectSubCategory(subCat.key)}>{subCat.name}</Button>);
		});

		return (
			<div style={{textAlign: 'center'}} className={cx('sub-categories')}>
				{buttonsSubCategoriesNode}
			</div>
		);
	}

  render() {
		const { courses, coursesPagesCount, categories, authentification } = this.props;
		const { category, fieldSearch, paginationIndexPage } = this.state;
		const styles = authentification.authenticated ? { marginTop: '110px' } : {};
		const citationStr = '"Every scientist knows that thorough examinations and skepticism are the power of science. All theories and knowledge are tentative and science is slowly leading us to a better understanding of the truth. There is no certainty, only probability and statistical significance"';

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" vertical className={cx('home-header-segment')}>
					<Container className={cx('home-header-container')} style={styles} >
						<Header as="h1" content="Start to share you courses / knowledges with the world" inverted className={cx('title')} />
						<Header as="h2" content="HubNote (Studento) is simple to use and allows you to create a course in a few clicks" inverted className={cx('sub-title')} />
						{ !authentification.authenticated && <Button className={cx('signup-button')} as={Link} to="/signup" basic inverted size="huge">Sign up<Icon name="right arrow" /></Button> }
						{ !authentification.authenticated && <Message compact icon="info circle" content="Please login (or signup) for test the main features." style={{width: 'auto'}} size="small" /> }
					</Container>
				</Segment>

				<Segment textAlign="center" vertical className={cx('home-citation-segment')}>
					<Container>
						<blockquote><Header as="h2" content={citationStr} className={cx('title')} /></blockquote>
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>

						<Divider horizontal className={cx('categories')}>
							<Button.Group basic size="tiny">
								{categories.map((cat, index) => (<Button key={index} active={category.lastClicked === cat.key} onClick={this.handleSelectCategory(cat.key, index)}>{cat.name}</Button>))}
							</Button.Group>
						</Divider>

						{ category.lastClicked && category.lastClicked.length > 0 ? this.renderSubCategories(categories[category.clickedIndex]) : ''}

						<CourseSearch
							handleSearchInput={this.handleSearchInput}
							handleSearchSelect={this.handleSearchSelect}
							fieldSearch={fieldSearch}
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
