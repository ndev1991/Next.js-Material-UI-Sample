import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

const styles = theme => ({
  root: {
    fontFamily: 'Montserrat',
    color: theme.palette.primary.main,
    padding: theme.spacing.unit * 2,
    textAlign: 'right'
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  addrIcon: { padding: 0, margin: 0 },
  addressTitle: { padding: 0 }
});

const OrderAddress = ({ classes, address }) => {
  return (
    <Grid item container className={classes.root}>
      <Grid item xs={12} className={classes.address}>
        <Typography variant="body1" className={classes.title}>
          SHIPPING ADDRESS
        </Typography>
        <Typography variant="body1">{address.address1}</Typography>
        <Typography variant="body1">{address.address2}</Typography>
        <Typography variant="body1">{address.address3}</Typography>
        <Typography variant="body1">
          {address.postalCode} {address.city}, {address.stateProvince}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(OrderAddress);
