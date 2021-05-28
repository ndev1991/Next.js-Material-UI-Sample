import React from 'react';
import Home from '../ui/homepage';

const HomePage = props => <Home {...props} />;

HomePage.getInitialProps = ({ query }) => ({ query });

export default HomePage;
