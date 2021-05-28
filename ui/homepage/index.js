import propTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Typography, Grid, Hidden, withStyles } from '@material-ui/core';
import Head from 'next/head';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as Templates from './templates';
import Page from '../../components/layout/Page';
import Wizard from './wizard';
import { queryTemplateConfiguration } from '../../src/graphql/site';

const defaultTitle = 'Dorm Room Ideas - Dorm Gifts - Graduation | OCM';

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

const getTemplate = (templateName, options, schoolCode = 'OCM') => {
  const t = templateName ? templateName.replace(/-/, '_') : 'Default';
  const Template = Templates[t];
  return Template ? (
    <Template templateOptions={options} schoolCode={schoolCode} />
  ) : (
    <Templates.Default templateOptions={options} schoolCode={schoolCode} />
  );
};

const HomePage = ({ classes, query }) => {
  const schoolCode = (query && query.school) || undefined;

  return (
    <Page>
      <Hidden smDown implementation="css">
        <Wizard />
      </Hidden>
      <Query
        query={queryTemplateConfiguration}
        variables={{ schoolCode, path: `/${schoolCode}` }}
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
          const { configuration } = data.spa;
          const { root: config } = JSON.parse(configuration);
          const { templateName, options } = config;
          return (
            <Grid container className={classes.container}>
              {options.head && (
                <Head>
                  <title>{options.head.title || defaultTitle}</title>
                  {options.head.metaTags &&
                    options.head.metaTags.map((h, k) => (
                      <meta key={k} {...h} />
                    ))}
                </Head>
              )}
              {getTemplate(templateName, options, schoolCode)}
            </Grid>
          );
        }}
      </Query>
    </Page>
  );
};

HomePage.propTypes = {
  classes: propTypes.object.isRequired,
  query: propTypes.object.isRequired
};

export default withStyles(styles)(HomePage);
