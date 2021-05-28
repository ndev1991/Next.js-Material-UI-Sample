import React, { Fragment } from 'react';
import { ButtonBase, Grid, Typography, withStyles } from '@material-ui/core';
import { ButtonLink } from '../../../components';
import { OCMLogoBig } from '../../../static/img';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  footerLinks: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: '18px',
    fontWeight: 400,
    cursor: 'pointer',
    '&:hover': {
      fontWeight: 500
    }
  },
  helpBlock: {
    marginTop: `${theme.spacing.unit * 3}px`,
    marginBottom: `${theme.spacing.unit * 3}px`,
    color: theme.palette.primary.main
  },
  helpText: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: 16
  },
  helpIcons: {
    width: '50px',
    height: '50px'
  },
  navColumnText: {
    marginLeft: `${theme.spacing.unit * 2}px`,
    padding: theme.spacing.unit,
    fontFamily: 'Rubik',
    fontSize: '16px',
    fontWeight: 400,
    color: theme.palette.primary.default,
    cursor: 'pointer'
  },
  navColumnTitle: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    textTransform: 'uppercase',
    fontWeight: 400,
    fontSize: '20px',
    color: theme.palette.primary.default
  },
  navColumnTitleContainer: {
    paddingLeft: `${theme.spacing.unit * 5}px`,
    backgroundSize: '30px',
    backgroundRepeat: 'no-repeat'
  }
});

const DesktopFooter = ({ classes, navOptions }) => {
  const preparedNavigation = id => navOptions.filter(nav => nav.id === id)[0];

  const privacyUrl = preparedNavigation('legal').children[0].url;
  const termsUrl = preparedNavigation('legal').children[1].url;
  const customerUrl = preparedNavigation('customerservice').url;

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={6} container justify="center" alignItems="center">
          <img src={OCMLogoBig} alt="OCM Logo" style={{ width: '80px' }} />
          <Typography
            variant="body1"
            style={{ fontSize: '18px', color: '#343434' }}
          >
            Copyright {new Date().getFullYear()} On Campus Marketing LLC
          </Typography>
        </Grid>
        <Grid item xs={6} container justify="space-around" alignItems="center">
          <ButtonBase component={ButtonLink} href={`/${privacyUrl}`}>
            <Typography variant="body1" className={classes.footerLinks}>
              Privacy
            </Typography>
          </ButtonBase>
          <ButtonBase component={ButtonLink} href={`/${customerUrl}`}>
            <Typography variant="body1" className={classes.footerLinks}>
              Customer Service
            </Typography>
          </ButtonBase>
          <ButtonBase component={ButtonLink} href={`/${termsUrl}`}>
            <Typography variant="body1" className={classes.footerLinks}>
              Terms &amp; Conditions
            </Typography>
          </ButtonBase>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(DesktopFooter);
