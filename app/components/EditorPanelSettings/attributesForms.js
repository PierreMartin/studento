export const getCategoriesFormsSelect = ({categories, course, category, isEditing}) => {
	let lastCategorySelected = category.lastSelected;

	// If update and no yet select some Inputs:
	if (isEditing && category.lastSelected === null) {
		lastCategorySelected = course.category;
	}

	// CATEGORIES - Convert to Input formate:
	const categoriesOptions = [];
	if (categories.length > 0) {
		for (let i = 0; i < categories.length; i++) {
			categoriesOptions.push({
				key: categories[i].key,
				text: categories[i].name,
				value: categories[i].key
			});
		}
	}

	// SUB CATEGORIES - 1) Get the category selected by the 1st Input:
	let categorySelected = {};
	if (categories.length > 0 && lastCategorySelected) {
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].key === lastCategorySelected) {
				categorySelected = categories[i];
				break;
			}
		}
	}

	// SUB CATEGORIES - 2) Convert to Input formate:
	const subCategoriesOptions = [];
	if (categorySelected.subCategories && categorySelected.subCategories.length > 0) {
		for (let i = 0; i < categorySelected.subCategories.length; i++) {
			subCategoriesOptions.push({
				key: categorySelected.subCategories[i].key,
				text: categorySelected.subCategories[i].name,
				value: categorySelected.subCategories[i].key
			});
		}
	}

	return { categoriesOptions, subCategoriesOptions };
};

export const getColumnsFormsSelect = () => {
	return [
		{ key: 1, text: '1 column', value: 1 },
		{ key: 2, text: '2 columns', value: 2 },
		{ key: 3, text: '3 columns', value: 3 },
		{ key: 4, text: '4 columns', value: 4 }
	];
};

export const getCodeLanguagesFormsSelect = () => {
	return [
		{ key: 'markdown', text: 'markdown', value: 'markdown' },
		{ key: 'javascript', text: 'Javascript', value: 'javascript' },
		{ key: 'php', text: 'Php', value: 'php' },
		{ key: 'python', text: 'Python', value: 'python' },
		{ key: 'ruby', text: 'Ruby', value: 'ruby' },
		{ key: 'sass', text: 'Sass', value: 'sass' },
		{ key: 'shell', text: 'Shell', value: 'shell' },
		{ key: 'sql', text: 'Sql', value: 'sql' },
		{ key: 'stylus', text: 'Stylus', value: 'stylus' },
		{ key: 'xml', text: 'XML', value: 'xml' },
		{ key: 'coffeescript', text: 'Coffeescript', value: 'coffeescript' },
		{ key: 'css', text: 'Css', value: 'css' },
		{ key: 'cmake', text: 'Cmake', value: 'cmake' },
		{ key: 'htmlmixed', text: 'HTML', value: 'htmlmixed' },
		{ key: 'mathematica', text: 'Mathematica', value: 'mathematica' },
		{ key: 'katex', text: 'Katex', value: 'katex' }
	];
}
