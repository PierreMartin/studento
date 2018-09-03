import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCoursesByIdAction } from '../actions/courses';
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

		this.state = {
			lastCategoryClicked: null
		};
	}

	getMetaData() {
		return {
			title: 'Home | react stater',
			meta: [{ name: 'description', content: 'react stater' }],
			link: []
		};
	}

	getOptionsFormsSelect() {
		return [
			{ key: 'all', text: 'All', value: 'all' },
			{ key: 'technology', text: 'Technology', value: 'technology' },
			{ key: 'life', text: 'Life / Arts', value: 'life' },
			{ key: 'culture', text: 'Culture / Recreation', value: 'culture' },
			{ key: 'science', text: 'Science', value: 'science' },
			{ key: 'other', text: 'Other', value: 'other' }
		];
	}

	handleSelectCategory = clickedCategory => () => {
		const { fetchCoursesByIdAction } = this.props;
		this.setState({ lastCategoryClicked: clickedCategory });
		// fetchCoursesByIdAction(clickedCategory, 'category'); // 'category' => name of field in Model to find
	}

	renderSubCategories() {
		// const { subCategories } = this.props;

		return (
			<div style={{textAlign: 'center'}} className={cx('sub-categories')}>
				<Button basic size="tiny">Web development</Button>
				<Button basic size="tiny">Administrators</Button>
				<Button basic size="tiny">Linux</Button>
				<Button basic size="tiny">Game development</Button>
				<Button basic size="tiny">Software ingineering</Button>
				<Button basic size="tiny">RaspBerry Pi</Button>
				<Button basic size="tiny">Aduino</Button>
				<Button basic size="tiny">Bitcoin and Cryptocurrencies</Button>
			</div>
		);
	}

  render() {
		const { lastCategoryClicked } = this.state;
		const { courses } = this.props;

    return (
      <LayoutPage {...this.getMetaData()}>
				<Segment inverted textAlign="center" style={{ minHeight: 400, padding: '1em 0em' }} vertical>
					<Container text>
						<Header as="h1" content="Hello!" inverted className={cx('myClass')} style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }} />
						<Header as="h2" content="Start to share you courses / knowledges with the world." inverted style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
						<Button primary size="huge">Sign up<Icon name="right arrow" /></Button>
					</Container>
				</Segment>

				<Segment vertical>
					<Container text className={cx('courses-container')}>
						<Header as="h2" content="Courses list" />

						<Divider horizontal className={cx('categories')}>
							<Button.Group basic size="tiny">
								<Button active={lastCategoryClicked === 'technology'} onClick={this.handleSelectCategory('technology')}>Technology</Button>
								<Button active={lastCategoryClicked === 'life'} onClick={this.handleSelectCategory('life')}>Life / Arts</Button>
								<Button active={lastCategoryClicked === 'culture'} onClick={this.handleSelectCategory('culture')}>Culture / Recreation</Button>
								<Button active={lastCategoryClicked === 'science'} onClick={this.handleSelectCategory('science')}>Science</Button>
								<Button active={lastCategoryClicked === 'other'} onClick={this.handleSelectCategory('other')}>Other</Button>
							</Button.Group>
						</Divider>

						{ lastCategoryClicked && lastCategoryClicked.length > 0 ? this.renderSubCategories() : ''}

						<div style={{textAlign: 'center'}} className={cx('search')}>
							<Input
								size="mini"
								action={<Dropdown button basic floating options={this.getOptionsFormsSelect()} defaultValue="all" />}
								icon="search"
								iconPosition="left"
								placeholder="Search"
							/>
						</div>

						<br />

						<CoursesList courses={courses} />
					</Container>
				</Segment>

      </LayoutPage>
    );
  }
}

/*
 Home.propTypes = {
	optionalArray: PropTypes.array, || PropTypes.arrayOf()
	optionalBool: PropTypes.bool,
	optionalFunc: PropTypes.func,
	optionalNumber: PropTypes.number,
	optionalObject: PropTypes.object,
	optionalString: PropTypes.string,
	optionalSymbol: PropTypes.symbol
};
*/


Home.propTypes = {
	fetchCoursesByIdAction: PropTypes.func,

	courses: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string,
		id: PropTypes.string,
		price: PropTypes.number,
		title: PropTypes.string
	})).isRequired
};

const mapStateToProps = (state) => {
	return {
		courses: state.courses.all
	};
};

export default connect(mapStateToProps, { fetchCoursesByIdAction })(Home);
