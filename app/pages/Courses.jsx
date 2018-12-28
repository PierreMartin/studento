import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link} from 'react-router';
import { fetchCoursesByFieldAction, fetchCoursesBySearchAction } from '../actions/courses';
import { fetchCategoryAction } from '../actions/category';
import { Button, Container, Header, Segment, Input, Dropdown, Breadcrumb } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import classNames from 'classnames/bind';
import styles from './css/home.scss';

const cx = classNames.bind(styles);

class Courses extends Component {
	constructor(props) {
		super(props);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.handleSearchSelect = this.handleSearchSelect.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);

		this.state = {
			paginationIndexPage: 1,
			fieldSearch: {
				select: 'all',
				typing: ''
			}
		};
	}

	componentDidMount() {
		// TODO mettre tout ca dans une function :
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
		// Change route:
		if (this.props.params.category !== prevProps.params.category || this.props.params.subcategory !== prevProps.params.subcategory) {
			const { fetchCategoryAction, fetchCoursesByFieldAction } = this.props;
			const category = (this.props && this.props.params && this.props.params.category) || '';
			const subcategory = (this.props && this.props.params && this.props.params.subcategory) || '';

			let categoryType = 'subCategories';
			let categoryKey = subcategory;

			// If not subCategory:
			if (subcategory === 'list') {
				categoryType = 'category';
				categoryKey = category;
			}

			fetchCategoryAction(category, subcategory);
			fetchCoursesByFieldAction({ keyReq: categoryType, valueReq: categoryKey });
		}
	}

	getMetaData() {
		const { category } = this.props;
		return {
			title: category.name || '',
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
		}, () => {
			this.props.fetchCoursesBySearchAction(this.state.fieldSearch);
		});
	}

	handlePaginationChange = (e, { activePage }) => {
		const { fetchCoursesByFieldAction, courses, fetchCoursesBySearchAction } = this.props;
		const { fieldSearch, paginationIndexPage } = this.state;
		if (activePage === paginationIndexPage) return;

		const directionIndex = activePage - paginationIndexPage;
		const currentCourseId = courses[0] && courses[0]._id; // id of first record on current page.

		this.setState({ paginationIndexPage: activePage });

		if (fieldSearch.typing !== '') return fetchCoursesBySearchAction({ ...fieldSearch, currentCourseId, directionIndex });

		fetchCoursesByFieldAction({ keyReq: 'all', valueReq: 'all', currentCourseId, directionIndex });
	}

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
		const { courses, coursesPagesCount, category, params } = this.props;
		const { fieldSearch, paginationIndexPage } = this.state;
		let subCategory = {};

		// Get subCategory from the params (if params !== 'list'):
		for (let i = 0; i < (category.subCategories && category.subCategories.length); i++) {
			if (category.subCategories[i].key === params.subcategory) {
				subCategory = category.subCategories[i];
				break;
			}
		}

		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment textAlign="center" vertical className={cx('home-citation-segment')}>
					<Container>
						{ this.renderBreadcrumb(category, subCategory, params) }
						<Header as="h2" content={typeof subCategory.name !== 'undefined' ? subCategory.name : category.name} className={cx('title')} />
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>

						{ this.renderSubCategories(category) }

						{/* TODO externaliser : */}
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
