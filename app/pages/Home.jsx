import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { Button, Container, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import CourseSearch from '../components/CourseSearch/CourseSearch';
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
		const { category, fieldSearchTyping, paginationIndexPage } = this.state;
		const styles = authentification.authenticated ? { marginTop: '110px' } : {};
		const citationStr = '"Every scientist knows that thorough examinations and skepticism are the power of science. All theories and knowledge are tentative and science is slowly leading us to a better understanding of the truth. There is no certainty, only probability and statistical significance"';

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" vertical className={cx('home-header-segment')}>
					<Container className={cx('home-header-container')} style={styles} >
						<Header as="h1" content="Start to share your notes with the world" inverted className={cx('title')} />
						<Header as="h2" content="Goodbye flying paper - HubNote is a social network that allows to take and share yours notes in class, at works, for tips or all other domain." inverted className={cx('sub-title')} />
						{ !authentification.authenticated && <Button className={cx('signup-button')} as={Link} to="/signup" basic inverted size="huge">Sign up<Icon name="right arrow" /></Button> }
					</Container>
				</Segment>

				<Segment textAlign="center" vertical className={cx('home-citation-segment')}>
					<Container>
						<blockquote><Header as="h2" content={citationStr} className={cx('title')} /></blockquote>
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>

						<div className={cx('categories')}>
							{categories.map((cat, index) => (<Button key={index} active={category.lastClicked === cat.key} onClick={this.handleSelectCategory(cat.key, index)}>{cat.name}</Button>))}
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
