import React from 'react';
import Landing from '../ui/landing';

const LandingPage = props => <Landing {...props} />;

LandingPage.getInitialProps = ({ query }) => ({ query });

export default LandingPage;
