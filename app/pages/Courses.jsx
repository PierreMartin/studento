import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { fetchCategoryAction } from '../actions/category';
import { Button, Container, Header, Segment, Divider, Input, Dropdown } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import classNames from 'classnames/bind';
import styles from './css/home.scss';

const cx = classNames.bind(styles);

class Courses extends Component {
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
			categoryAction: {
				lastClicked: null,
				clickedIndex: 0
			},
			subCategory: {
				lastClicked: null
			}
		};
	}

	componentDidMount() {
		const { fetchCategoryAction, fetchCoursesByFieldAction } = this.props;
		const category = (this.props && this.props.params && this.props.params.category) || '';
		const subcategory = (this.props && this.props.params && this.props.params.subcategory) || '';

		let categoryType = 'subCategories';
		let categoryKey = subcategory;

		// If no subcategory:
		if (subcategory === 'list') {
			categoryType = 'category';
			categoryKey = category;
		}

		fetchCategoryAction(category, subcategory);
		fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryKey });
	}

	componentDidUpdate(prevProps) {
		// Change pages:
		// TODO finir ca :
		if (prevProps.courses !== this.props.courses && false) {
			const { fetchCategoryAction, fetchCoursesByFieldAction } = this.props;
			const category = (this.props && this.props.params && this.props.params.category) || '';
			const subcategory = (this.props && this.props.params && this.props.params.subcategory) || '';

			let categoryType = 'subCategories';
			let categoryKey = subcategory;

			// If no subcategory:
			if (subcategory === 'list') {
				categoryType = 'category';
				categoryKey = category;
			}

			fetchCategoryAction(category, subcategory);
			fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryKey });
		}
	}

	getMetaData() {
		const nameCategory = (this.props && this.props.category && this.props.category.name) || 'No category';
		return {
			title: nameCategory,
			meta: [{ name: 'description', content: 'Courses by categories' }],
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
			categoryAction: { lastClicked: clickedCategory, clickedIndex},
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
			categoryAction: { lastClicked: null }, // reset
			subCategory: { lastClicked: null } // reset
		}, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, courses, fetchCoursesBySearchAction } = this.props;
		const { categoryAction, subCategory, fieldSearch, paginationIndexPage } = this.state;
		if (activePage === paginationIndexPage) return;

		const directionIndex = activePage - paginationIndexPage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		this.setState({ paginationIndexPage: activePage });

		if (categoryAction.lastClicked !== null) return fetchCoursesByFieldAction({ keyReq: 'category', valueReq: categoryAction.lastClicked, currentCourseId, directionIndex });
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
		const { courses, coursesPagesCount, categories, category } = this.props;
		const { categoryAction, fieldSearch, paginationIndexPage } = this.state;
		const nameCategory = category.name || 'No category';

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment textAlign="center" vertical className={cx('home-citation-segment')}>
					<Container>
						<Header as="h2" content={nameCategory} className={cx('title')} />
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>

						<Divider horizontal className={cx('categories')}>
							<Button.Group basic size="tiny">
								{categories.map((cat, index) => (<Button key={index} active={categoryAction.lastClicked === cat.key} onClick={this.handleSelectCategory(cat.key, index)}>{cat.name}</Button>))}
							</Button.Group>
						</Divider>

						{ categoryAction.lastClicked && categoryAction.lastClicked.length > 0 ? this.renderSubCategories(categories[categoryAction.clickedIndex]) : ''}

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

Courses.propTypes = {
	fetchCoursesByFieldAction: PropTypes.func,
	fetchCoursesBySearchAction: PropTypes.func,
	fetchCategoryAction: PropTypes.func,
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
	})),

	category: PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		picto: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	})
};

const mapStateToProps = (state) => {
	return {
		courses: state.courses.all,
		coursesPagesCount: state.courses.pagesCount,
		categories: state.categories.all,
		category: state.categories.one,
		authentification: state.authentification
	};
};

export default connect(mapStateToProps, { fetchCoursesByFieldAction, fetchCategoryAction, fetchCoursesBySearchAction })(Courses);