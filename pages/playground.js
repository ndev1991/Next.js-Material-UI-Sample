import Page from '../components/layout/Page';
import Login from '../components/layout/Header/Login';

const LoginContainer = ({ query: { school } }) => (
  <Page>
    <Login schoolCode={school || ''} />
  </Page>
);

export default LoginContainer;
