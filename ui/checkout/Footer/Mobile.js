import React, { Fragment } from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { Link } from '../../../routes';
import { OCMLogoBig } from '../../../static/img';

const styles = theme => ({
  copyright: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: '13px',
    fontWeight: 400
  },
  footerLinks: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    textDecoration: 'underline',
    '&:hover': {
      fontWeight: 500
    },
    [theme.breakpoints.down(321)]: {
      fontSize: 12
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0px`
  }
});

const FooterMobile = ({ classes, navOptions }) => {
  const privacyUrl = navOptions.filter(nav => nav.id === 'legal')[0].children[0]
    .url;
  const termsUrl = navOptions.filter(nav => nav.id === 'legal')[0].children[1]
    .url;
  const customerUrl = navOptions.filter(nav => nav.id === 'customerservice')[0]
    .url;

  return (
    <Fragment>
      <Grid
        item
        container
        xs={12}
        justify="center"
        alignItems="center"
        alignContent="center"
        style={{ marginBottom: '20px' }}
      >
        <img src={OCMLogoBig} alt="OCM Logo" style={{ width: '80px' }} />

        <Typography variant="body1" className={classes.copyright}>
          © Copyright {new Date().getFullYear()} On Campus Marketing LLC
        </Typography>
      </Grid>

      <Grid
        item
        container
        xs={12}
        justify="space-around"
        alignItems="center"
        alignContent="center"
      >
        <Link route={`/${privacyUrl}`}>
          <Typography variant="body1" className={classes.footerLinks}>
            Privacy
          </Typography>
        </Link>
        <Link route={`/${customerUrl}`}>
          <Typography variant="body1" className={classes.footerLinks}>
            Customer Service
          </Typography>
        </Link>
        <Link route={`/${termsUrl}`}>
          <Typography variant="body1" className={classes.footerLinks}>
            Terms &amp; Conditions
          </Typography>
        </Link>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(FooterMobile);
