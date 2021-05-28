import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.grey[50],
    border: `2px solid ${theme.palette.common.grey[300]}`,
    padding: theme.spacing.unit * 4
  },
  infoBold: {
    color: theme.palette.primary.default,
    fontSize: 22,
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      overflow: 'show'
    }
  },
  infoRegular: {
    color: theme.palette.primary.default,
    fontSize: 16
  }
});

const ProfileInfo = props => {
  const { classes, profile } = props;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography className={classes.infoBold}>
          {`${profile.firstName} ${profile.lastName}`}
        </Typography>
        <Typography className={classes.infoRegular}>
          {`${profile.email}`}
        </Typography>
        <Typography className={classes.infoRegular}>
          I am a {`${profile.iam}`}.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ProfileInfo);
