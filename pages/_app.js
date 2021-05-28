import '@babel/polyfill';
// From https://github.com/mui-org/material-ui/tree/next/examples/nextjs
import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
// import getConfig from 'next/config';
// import gql from 'graphql-tag';
import { CloudinaryContext } from 'cloudinary-react';
import { ApolloProvider } from 'react-apollo';
// import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import cookies from 'next-cookies';

import redirectTo from '../lib/redirectTo';
import { SchoolProvider } from '../lib/schoolContext';
import { NotificationsProvider } from '../lib/notificationsContext';
import withApolloClient from '../lib/withApolloClient';
import getPageContext from '../src/getPageContext';
import { SessionProvider, getSessionId } from '../lib/sessionContext';
import { getBrowserId } from '../lib/weMade';
import gtmSetup from '../lib/gtm';
import { getToken } from '../lib/auth';

import '../lib/errorHandlerUtility';

class MyApp extends App {
  constructor() {
    super();
    this.state = {
      sessionId: null,
      browserId: null,
      notification: {
        type: '',
        name: ''
      },
      domain: null
    };
    this.pageContext = getPageContext();
  }

  static async getInitialProps({ ctx }) {
    const c = cookies(ctx);
    const token = (process.browser && getToken()) || c.authtoken;
    if (
      process.browser &&
      typeof token === 'undefined' &&
      ctx.pathname === '/profile'
    )
      redirectTo('/register', { res: ctx.res });
  }

  async componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    if (process.browser) {
      const sessionId = getSessionId();
      let browserId = null;

      try {
        browserId = await getBrowserId();
      } catch (err) {
        console.error(err);
      }

      const { asPath, query, pathname } = this.props.router;
      gtmSetup(
        sessionId,
        browserId,
        asPath.indexOf('search') !== -1 ? 'search' : pathname,
        query.lineOfBusiness,
        query.school
      );

      this.setState({
        sessionId,
        browserId,
        domain: window.location.hostname
      });
    }
  }

  showNotification = ({ type, message }) => {
    this.setState({ notification: { type, message } });
  };

  resetNotification = () => {
    this.setState({ notification: { type: '', message: '' } });
  };

  render() {
    const { pageContext } = this;
    const { Component, pageProps, apolloClient, router } = this.props;
    const { notification, sessionId, browserId, domain } = this.state;

    return (
      <Container>
        <Head />
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={pageContext.sheetsRegistry}
          generateClassName={pageContext.generateClassName}
        >
          <IntlProvider locale="en">
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={pageContext.theme}
              sheetsManager={pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
              <CloudinaryContext cloudName="ocm" crop="scale" secure>
                <ApolloProvider client={apolloClient}>
                  <NotificationsProvider
                    value={{
                      type: notification.type,
                      message: notification.message,
                      showNotification: this.showNotification,
                      resetNotification: this.resetNotification
                    }}
                  >
                    <SessionProvider value={{ sessionId, browserId }}>
                      <SchoolProvider value={router.query.school || 'ocm'}>
                        <Component
                          pageContext={pageContext}
                          {...pageProps}
                          domain={domain}
                          query={router.query}
                        />
                      </SchoolProvider>
                    </SessionProvider>
                  </NotificationsProvider>
                </ApolloProvider>
              </CloudinaryContext>
            </MuiThemeProvider>
          </IntlProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
