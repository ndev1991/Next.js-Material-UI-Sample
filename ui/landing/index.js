import propTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Typography, Grid, withStyles } from '@material-ui/core';
// import Head from 'next/head';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as Landings from './templates';
import Page from '../../components/layout/Page';
import { queryTemplateLanding } from '../../src/graphql/landing';

// const defaultTitle = 'Welcome to our site | OCM';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit / 2, // Header shadow
    paddingLeft: '0 !important'
  },
  nowLoading: {
    margin: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

const getLanding = (query, items = []) => {
  const t = query.slug ? query.slug.replace(/-/, '_') : 'Default';
  const Landing = Landings[t];
  return Landing ? (
    <Landing items={items} query={query} />
  ) : (
    <Landings.Default items={items} query={query} />
  );
};

const LandingPage = ({ classes, query }) => (
  <Page>
    <Query
      query={queryTemplateLanding}
      variables={{ schoolCode: query.school, path: `${query.slug}` }}
    >
      {({ error, loading, data }) => {
        if (error)
          return (
            <h1 style={{ color: 'red', textAlign: 'center' }}>
              Error querying endpoint.
            </h1>
          );
        if (loading)
          return (
            <div className={classes.nowLoading}>
              <Typography component="h1" className={classes.nowLoading}>
                Welcome to OCM
              </Typography>
              <LoadingSpinner />
            </div>
          );
        const { items } = data.spa;
        return (
          <Grid container className={classes.container}>
            {/* {options.head && (
              <Head>
                <title>{options.head.title || defaultTitle}</title>
                {options.head.metaTags &&
                  options.head.metaTags.map((h, k) => <meta key={k} {...h} />)}
              </Head>
            )} */}
            {getLanding(query, items)}
          </Grid>
        );
      }}
    </Query>
  </Page>
);

LandingPage.propTypes = {
  classes: propTypes.object.isRequired,
  query: propTypes.object.isRequired
};

export default withStyles(styles)(LandingPage);
