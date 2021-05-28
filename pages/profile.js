import React from 'react';

import { Page } from '../components';
import Profile from '../ui/profile';

const ProfilePage = ({ query: { school } }) => (
  <Page>
    <Profile schoolCode={school} />
  </Page>
);

ProfilePage.getInitialProps = ({ query }) => {
  return {
    query
  };
};

export default ProfilePage;
