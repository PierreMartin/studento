import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import { Button, Container, Header, Icon, Segment, Divider, Input, Dropdown, Message } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
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
		this.props.fetchCategoriesAction();
	}

	getMetaData() {
		return {
			title: 'Home | Studento',
			meta: [{ name: 'description', content: 'Studento' }],
			link: []
		};
	}

	getOptionsFormsSelect() {
		const { categories } = this.props;

		const arrCatList = [{ key: 'all', text: 'All', value: 'all' }];
		for (let i = 0; i < categories.length; i++) {
			arrCatList.push({
				key: categories[i].key,
				text: categories[i].name,
				value: categories[i].key
			});
		}

		return arrCatList;
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

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" vertical className={cx('home-header-segment')}>
					<Container className={cx('home-header-container')}>
						<Header as="h1" content="-.-" inverted style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0 }} />
						<Header as="h2" content="Start to share you courses / knowledges with the world." inverted style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						{ !authentification.authenticated && <Button as={Link} to="/signup" basic inverted size="huge">Sign up<Icon name="right arrow" /></Button> }
						<Message compact icon="info circle" content="Please login (or signup) for test the main features." style={{width: 'auto'}} size="small" />
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

						<div style={{textAlign: 'center'}} className={cx('search')}>
							<Input
								size="mini"
								action={<Dropdown button basic floating options={this.getOptionsFormsSelect()} defaultValue="all" onChange={this.handleSearchSelect} />}
								icon="search"
								iconPosition="left"
								placeholder="Search a course"
								name="search"
								value={fieldSearch.typing || ''}
								onChange={this.handleSearchInput}
							/>
						</div>
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
	fetchCategoriesAction: PropTypes.func,
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

export default connect(mapStateToProps, { fetchCoursesByFieldAction, fetchCategoriesAction, fetchCoursesBySearchAction })(Home);
