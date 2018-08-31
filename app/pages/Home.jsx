import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Container, Header, Icon, Segment, Divider, Input, Dropdown } from 'semantic-ui-react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import CoursesList from '../components/CoursesList/CoursesList';
import classNames from 'classnames/bind';
import styles from './css/home.scss';

const cx = classNames.bind(styles);

class Home extends Component {
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

  render() {
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
					<Container text>
						<Header as="h2" content="Courses list" />

						<Divider horizontal>
							<Button.Group basic size="tiny">
								<Button>Technology</Button>
								<Button>Life / Arts</Button>
								<Button>Culture / Recreation</Button>
								<Button>Science</Button>
								<Button>Other</Button>
							</Button.Group>
						</Divider>

						<div style={{textAlign: 'center'}}>
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

export default connect(mapStateToProps, null)(Home);
