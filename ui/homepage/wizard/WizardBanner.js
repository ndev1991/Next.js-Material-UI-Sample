import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'cloudinary-react';
import { Button, Grid, Paper, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    // marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `1px solid ${theme.palette.primary.highlight}`,
    borderWidth: '1px 1px 1px 20px',
    maxWidth: 1400,
    width: '95%',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
      margin: `0 ${theme.spacing.unit * 2}px`
    }
  },
  inlineElement: {
    whiteSpace: 'nowrap',
    margin: theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      whiteSpace: 'unset',
      margin: 0
    }
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing.unit * 3.5,
      marginLeft: -1 * (theme.spacing.unit * 2.5)
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 2,
      fontSize: 8,
      marginLeft: -1 * (theme.spacing.unit * 5)
    }
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    textTransform: 'uppercase',
    [theme.breakpoints.up('xs')]: {
      fontSize: 10,
      textAlign: 'center',
      marginLeft: theme.spacing.unit * 1.5
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit * 1.5,
      fontSize: 17,
      textAlign: 'center',
      marginLeft: 40
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 20,
      marginLeft: 20
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2,
      fontSize: 30
    }
  },
  element: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2.1,
    marginLeft: 50,
    fontSize: 15,
    [theme.breakpoints.up('xs')]: {
      fontSize: 8,
      textAlign: 'center',
      marginLeft: theme.spacing.unit * 3.5,
      maxWidth: 175
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center',
      fontSize: 9,
      maxWidth: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing.unit * 2.5,
      fontSize: 8,
      fontWeight: 400,
      marginLeft: 80
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing.unit * 2.3,
      fontWeight: 400,
      marginLeft: 100,
      fontSize: 12
    },
    [theme.breakpoints.up('xl')]: {
      marginLeft: 80
    }
  },
  buttonGrid: {
    textAlign: 'right'
  },
  img: {
    width: 'auto',
    height: 50,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing.unit * 2
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 1.5,
      height: 35
    }
  }
});

const WizardBanner = ({ classes, onClick }) => {
  return (
    <Fragment>
      <Grid container justify="center" alignItems="center">
        <Paper className={classes.root} elevation={2}>
          <Grid item container>
            <Grid item xs={1}>
              <Image
                publicId="https://res.cloudinary.com/ocm/image/upload/spa/home/icn_value-pack-01.png"
                responsive
                className={classes.img}
              />
            </Grid>
            <Grid item container xs={9}>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  className={classNames(classes.inlineElement, classes.title)}
                >
                  Complete your room in 3 easy steps!
                </Typography>
              </Grid>
              {/* <Grid item xs={12} md={6} lg={6}>
                <Typography
                  variant="body1"
                  className={classNames(classes.inlineElement, classes.element)}
                >
                  All products can be delivered directly to your dorm on move-in
                  day.
                </Typography>
              </Grid> */}
            </Grid>
            <Grid item xs={2} sm={2} className={classes.buttonGrid}>
              <Button
                variant="contained"
                className={classNames(classes.button, classes.inlineElement)}
                onClick={onClick}
                disableTouchRipple
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  );
};

WizardBanner.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(WizardBanner);
