import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './css/coursePage.scss';

const cx = classNames.bind(styles);

const CoursePage = ({ contentMarkedSanitized }) => {
	return (
		<div className={cx('container-page')} dangerouslySetInnerHTML={{ __html: contentMarkedSanitized }} />
	);
};

CoursePage.propTypes = {
	contentMarkedSanitized: PropTypes.string
};

export default CoursePage;
