import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link} from 'react-router';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { fetchCategoryAction } from '../actions/category';
import { Button, Container, Header, Segment, Breadcrumb, Menu } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import CourseSearch from '../components/CourseSearch/CourseSearch';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';
import stylesCourses from './css/courses.scss';

const cx = classNames.bind({...stylesMain, ...stylesCourses});

class Courses extends Component {
	constructor(props) {
		super(props);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
		this.handleSortBy = this.handleSortBy.bind(this);

		this.state = {
			paginationIndexPage: 1,
			fieldSearchTyping: '',
			sortByField: 'created_at'
		};
	}

	componentDidMount() {
		this.loadDatas();
	}

	componentDidUpdate(prevProps) {
		// Change route:
		if (this.props.params.category !== prevProps.params.category || this.props.params.subcategory !== prevProps.params.subcategory) {
			this.loadDatas();
			this.setState({ paginationIndexPage: 1, fieldSearchTyping: '' });
		}
	}

	getMetaData() {
		const { category } = this.props;
		const subCategory = this.getInfosSubCategory();
		const currentCategoryString = typeof subCategory.name !== 'undefined' ? subCategory.name : category.name;

		return {
			title: currentCategoryString || '',
			meta: [{ name: 'description', content: 'Notes by categories' }],
			link: []
		};
	}

	/**
	 * Get the subCategory info from the param and the category
	 * return {object} object empty if no clicked on subCategory
	 * */
	getInfosSubCategory() {
		const { category, params } = this.props;

		let subCategory = {};
		// Get subCategory from the params (if params !== 'list'):
		for (let i = 0; i < (category.subCategories && category.subCategories.length); i++) {
			if (category.subCategories[i].key === params.subcategory) {
				subCategory = category.subCategories[i];
				break;
			}
		}

		return subCategory;
	}

	getCategoriesFromParamsForPayload() {
		const category = (this.props.params && this.props.params.category) || '';
		const subcategory = (this.props.params && this.props.params.subcategory) || '';

		let categoryType = 'subCategories';
		let categoryValue = subcategory;

		// If no subcategory:
		if (subcategory === 'list') {
			categoryType = 'category';
			categoryValue = category;
		}

		return { categoryType, categoryValue };
	}

	loadDatas(activePage = false) {
		const { fetchCategoryAction, fetchCoursesByFieldAction } = this.props;
		const { sortByField } = this.state;
		const { categoryType, categoryValue } = this.getCategoriesFromParamsForPayload();

		// If fetch for pagination:
		if (activePage) {
			fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryValue, activePage, sortByField });
		} else {
			const category = (this.props.params && this.props.params.category) || '';
			const subcategory = (this.props.params && this.props.params.subcategory) || '';
			fetchCategoryAction(category, subcategory);
			fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryValue, sortByField });
		}
	}

	handleSearchInput = (e, { value }) => {
		if (value === ' ' || value === '  ') return;

		this.setState({
			fieldSearchTyping: value,
			paginationIndexPage: 1 // reset
		}, () => {
			const { categoryType, categoryValue } = this.getCategoriesFromParamsForPayload();
			this.props.fetchCoursesBySearchAction(this.state.fieldSearchTyping, { keyReq: categoryType, valueReq: categoryValue, sortByField: this.state.sortByField });
		});
	};

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesBySearchAction } = this.props;
		const { fieldSearchTyping, paginationIndexPage, sortByField } = this.state;
		if (activePage === paginationIndexPage) return;

		this.setState({ paginationIndexPage: activePage });

		// If pagination at search:
		if (fieldSearchTyping !== '') {
			const { categoryType, categoryValue } = this.getCategoriesFromParamsForPayload();
			fetchCoursesBySearchAction(fieldSearchTyping, { keyReq: categoryType, valueReq: categoryValue, sortByField }, activePage);
			return;
		}

		// Else if pagination normal:
		this.loadDatas(activePage);
	};

	handleSortBy = (e, { name }) => {
		const { fetchCoursesByFieldAction, fetchCoursesBySearchAction } = this.props;
		const { fieldSearchTyping } = this.state;
		const { categoryType, categoryValue } = this.getCategoriesFromParamsForPayload();

		this.setState({ sortByField: name, paginationIndexPage: 1 });

		// If search query:
		if (fieldSearchTyping !== '') {
			fetchCoursesBySearchAction(fieldSearchTyping, { keyReq: categoryType, valueReq: categoryValue, sortByField: name });
		} else {
			// Else if normal query:
			fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryValue, sortByField: name });
		}
	};

	renderSubCategories(categoryParam) {
		if (!categoryParam.subCategories) return;

		const { params } = this.props;
		const buttonsSubCategoriesNode = categoryParam.subCategories.map((subCat, index) => {
			return (<Button key={index} basic size="tiny" as={Link} to={`/courses/${categoryParam.key}/${subCat.key}`} active={params.subcategory === subCat.key}>{subCat.name}</Button>);
		});

		return (
			<div style={{textAlign: 'center'}} className={cx('sub-categories')}>
				{buttonsSubCategoriesNode}
			</div>
		);
	}

	renderBreadcrumb(category, subCategory, params) {
		if (!category.key) return;

		const itemsBreadCrumb = [{
			key: 'home',
			name: 'Home',
			link: '/'
		}, {
			key: category.key,
			name: category.name,
			link: `/courses/${category.key}/list`
		}];

		// If clicked on subCategory:
		if (!!subCategory.name) {
			itemsBreadCrumb.push({
				key: subCategory.key,
				name: subCategory.name,
				link: `/courses/${subCategory.key}/${subCategory.name}`
			});
		}

		const itemsBreadCrumbNode = itemsBreadCrumb.map((itemMenu, key) => {
			let isActive = false;

			// If not clicked on subCategory:
			if (params.subcategory === 'list') {
				isActive = params.category === itemMenu.key;
			} else {
				isActive = params.subcategory === itemMenu.key;
			}

			return (
				<span key={key}>
					{ !isActive && <Breadcrumb.Section as={Link} to={itemMenu.link} active={isActive}>{itemMenu.name}</Breadcrumb.Section> }
					{ isActive && <Breadcrumb.Section active={isActive}>{itemMenu.name}</Breadcrumb.Section> }
					{ (key !== itemsBreadCrumb.length - 1) && <Breadcrumb.Divider icon="right angle" /> }
				</span>
			);
		});

		return (
			<Breadcrumb>
				{ itemsBreadCrumbNode }
			</Breadcrumb>
		);
	}

	render() {
		const { courses, coursesCount, pagesCount, category, params } = this.props;
		const { fieldSearchTyping, paginationIndexPage, sortByField } = this.state;
		const subCategory = this.getInfosSubCategory();
		const currentCategoryString = typeof subCategory.name !== 'undefined' ? subCategory.name : category.name;
		const results = coursesCount > 1 ? `${coursesCount} results` : `${coursesCount} result`;

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment textAlign="center" vertical className={cx('header-container')}>
					<Container>
						{ this.renderBreadcrumb(category, subCategory, params) }
						<Header as="h2" content={currentCategoryString} className={cx('title')} />
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>

						{ this.renderSubCategories(category) }

						<CourseSearch
							handleSearchInput={this.handleSearchInput}
							fieldSearchTyping={fieldSearchTyping}
							from="courses"
						/>
						<br />

						<Header sub>{ results }</Header>

						<Menu pointing secondary>
							<Menu.Item
								name="created_at"
								content="New"
								active={sortByField === 'created_at'}
								onClick={this.handleSortBy}
							/>
							<Menu.Item
								name="stars.average"
								content="Best average"
								active={sortByField === 'stars.average'}
								onClick={this.handleSortBy}
							/>
							<Menu.Item
								name="stars.numberOfTimeVoted"
								content="Most voted"
								active={sortByField === 'stars.numberOfTimeVoted'}
								onClick={this.handleSortBy}
							/>
							<Menu.Item
								name="uId"
								content="User"
								active={sortByField === 'uId'}
								onClick={this.handleSortBy}
							/>
						</Menu>

						<CoursesList
							courses={courses}
							coursesPagesCount={pagesCount}
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
	coursesCount: PropTypes.number,
	pagesCount: PropTypes.number,

	courses: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		id: PropTypes.string,
		price: PropTypes.number,
		title: PropTypes.string
	})).isRequired,

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
		coursesCount: state.courses.coursesCount,
		pagesCount: state.courses.pagesCount,
		category: state.categories.one,
		authentification: state.authentification
	};
};

export default connect(mapStateToProps, { fetchCoursesByFieldAction, fetchCategoryAction, fetchCoursesBySearchAction })(Courses);
