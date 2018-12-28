import React from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown } from 'semantic-ui-react';
import classNames from 'classnames/bind';
import styles from './css/courseSearch.scss';

const cx = classNames.bind(styles);

const getOptionsFormsSelect = (categories) => {
	const arrCatList = [{ key: 'all', text: 'All', value: 'all' }];
	for (let i = 0; i < categories.length; i++) {
		arrCatList.push({
			key: categories[i].key,
			text: categories[i].name,
			value: categories[i].key
		});
	}

	return arrCatList;
};

const CourseSearch = ({ handleSearchInput, handleSearchSelect, fieldSearch, categories }) => {
	return (
		<div style={{textAlign: 'center'}} className={cx('search')}>
			<Input
				size="mini"
				action={<Dropdown button basic floating options={getOptionsFormsSelect(categories)} defaultValue="all" onChange={handleSearchSelect} />}
				icon="search"
				iconPosition="left"
				placeholder="Search a course"
				name="search"
				value={fieldSearch.typing || ''}
				onChange={handleSearchInput}
			/>
		</div>
	);
};

CourseSearch.propTypes = {
	handleSearchInput: PropTypes.func,
	handleSearchSelect: PropTypes.func,
	fieldSearch: PropTypes.object,

	categories: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		name: PropTypes.string,
		key: PropTypes.string,
		subCategories: PropTypes.array
	}))
};

export default CourseSearch;
