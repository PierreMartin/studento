import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { fetchCategoriesAction } from '../actions/category';
import { Button, Container, Header, Icon, Segment, Divider, Input, Dropdown } from 'semantic-ui-react';
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
		this.paginationChange = this.paginationChange.bind(this);

		this.state = {
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
			title: 'Home | react stater',
			meta: [{ name: 'description', content: 'react stater' }],
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
		this.setState({ category: { lastClicked: clickedCategory, clickedIndex} });
		fetchCoursesByFieldAction({ keyReq: 'category', valueReq: clickedCategory });
	}

	handleSelectSubCategory = clickedSubCategory => () => {
		const { fetchCoursesByFieldAction } = this.props;
		this.setState({ subCategory: { lastClicked: clickedSubCategory } });
		fetchCoursesByFieldAction({ keyReq: 'subCategories', valueReq: clickedSubCategory });
	}

	handleSearchSelect = (e, { value }) => {
		this.setState({ fieldSearch: { ...this.state.fieldSearch, select: value } }, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	handleSearchInput = (e, { value }) => {
		if (value === ' ' || value === '  ') return;

		this.setState({ fieldSearch: { ...this.state.fieldSearch, typing: value } }, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	paginationChange(activePage, lastActivePage) {
		const { fetchCoursesByFieldAction, courses } = this.props;
		const { category, subCategory, fieldSearch } = this.state;
		const directionIndex = activePage - lastActivePage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		if (category.lastClicked !== null) {
			return fetchCoursesByFieldAction({ keyReq: 'category', valueReq: category.lastClicked, currentCourseId, directionIndex });
		}

		if (subCategory.lastClicked !== null) {
			return fetchCoursesByFieldAction({ keyReq: 'subCategory', valueReq: subCategory.lastClicked, currentCourseId, directionIndex });
		}

		if (fieldSearch.typing !== '') {
			// return fetchCoursesBySearchAction(); // TODO a finir
		}

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
		const { courses, coursesPagesCount, categories } = this.props;
		const { category, fieldSearch } = this.state;

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" style={{ minHeight: 400, padding: '1em 0em' }} vertical>
					<Container text>
						<Header as="h1" content="-.-" inverted style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }} />
						<Header as="h2" content="Start to share you courses / knowledges with the world." inverted style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<Button primary size="huge">Sign up<Icon name="right arrow" /></Button>
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
								placeholder="Search"
								name="search"
								value={fieldSearch.typing || ''}
								onChange={this.handleSearchInput}
							/>
						</div>

						<br />

						<CoursesList courses={courses} coursesPagesCount={coursesPagesCount} paginationChange={this.paginationChange} />
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
		categories: state.categories.all
	};
};

export default connect(mapStateToProps, { fetchCoursesByFieldAction, fetchCategoriesAction, fetchCoursesBySearchAction })(Home);
