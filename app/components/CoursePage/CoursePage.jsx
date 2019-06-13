import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import stylesCourse from './../../pages/css/course.scss';

const cx = classNames.bind(stylesCourse);

const CoursePage = ({ contentMarkedSanitized }) => {
	return (
		<div className={cx('container-page-dark')} id="container-page-view" dangerouslySetInnerHTML={{ __html: contentMarkedSanitized }} />
	);
};

CoursePage.propTypes = {
	contentMarkedSanitized: PropTypes.string
};

export default CoursePage;
