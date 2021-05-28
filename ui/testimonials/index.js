import React, { Fragment } from 'react';
import Head from 'next/head';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    maxWidth: 1500,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit * 1.5
    }
  }
});

const Testimonials = ({ classes, page }) => {
  // console.log(`page: ${page}`);
  return (
    <Fragment>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="/static/css/contentpages.css"
        />
      </Head>
      <div className={classes.container}>
        <div
          className={classes.content}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: page }}
        />
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(Testimonials);
