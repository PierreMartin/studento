import React from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { title, meta, link } from '../components/assets/assets';

const App = props => (
  <LayoutPage title={title} meta={meta} link={link}>
		{ props.children }
  </LayoutPage>
);

export default App;
