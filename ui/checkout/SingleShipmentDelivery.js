import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Button, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Link from 'next/link';

import {
  addBusinessAddress,
  addResidentialAddress,
  addCampusAddress,
  setShippingAddress as setShipping,
  zipcode
} from '../../src/graphql/checkout';
import { CheckoutConsumer } from './context';
import ShippingAddress from './ShippingAddress';

const routes = require('next-routes')();

const styles = theme => ({
  container: {
    height: 'calc(100vh - 340px)'
  },
  button: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    backgroundColor: theme.palette.common.grey[600],
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.grey[600]
    }
  },
  endorsedButton: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  typoButton: {
    color: theme.palette.common.grey['800'],
    textDecoration: 'underline',
    cursor: 'pointer',

    '&:hover': {
      fontWeight: 600
    }
  },
  endorsedLink: {
    color: theme.palette.primary.main,

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
});

const ShippingAddressWithContext = ({ classes, ...otherProps }) => (
  <CheckoutConsumer>
    {({
      order,
      residenceHalls,
      schoolcode,
      addNewAddress,
      usedAddresses,
      setCompleted,
      shippingOptions
    }) => (
      <>
        {!!order.consignments.length && (
          <ShippingAddress
            needTitle
            shipment={order.consignments[0]}
            residenceHalls={residenceHalls}
            schoolcode={schoolcode}
            addNewAddress={addNewAddress}
            usedAddresses={usedAddresses}
            setCompleted={setCompleted}
            shippingOptions={shippingOptions}
            {...otherProps}
          />
        )}
        {order.consignments.length === 0 && (
          <Grid
            item
            container
            alignItems="center"
            justify="center"
            direction="column"
            className={classes.container}
          >
            <Grid item>
              <Typography
                className={classes.typography}
                variant="h4"
                align="center"
                gutterBottom
              >
                Your cart is empty.
              </Typography>
              <Typography
                className={classes.typography}
                variant="h6"
                align="center"
                gutterBottom
              >
                Visit our{' '}
                <Link
                  href={`/${
                    schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''
                  }`}
                >
                  <a
                    className={classNames(
                      classes.typoButton,
                      schoolcode.toLowerCase() !== 'ocm'
                        ? classes.endorsedLink
                        : ''
                    )}
                  >
                    home page
                  </a>
                </Link>{' '}
                for featured items or browse our collections
                <br /> above to add items to your cart.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                className={classNames(
                  classes.button,
                  schoolcode.toLowerCase() !== 'ocm'
                    ? classes.endorsedButton
                    : ''
                )}
                onClick={() =>
                  routes.Router.push(
                    `/${schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''}`
                  )
                }
                variant="contained"
              >
                Continue Shopping
              </Button>
            </Grid>
          </Grid>
        )}
      </>
    )}
  </CheckoutConsumer>
);

export default compose(
  graphql(setShipping, { name: 'setShipping' }),
  graphql(addBusinessAddress, { name: 'addBusinessAddress' }),
  graphql(addResidentialAddress, { name: 'addResidentialAddress' }),
  graphql(addCampusAddress, { name: 'addCampusAddress' }),
  graphql(zipcode, { name: 'zipcode' }),
  withStyles(styles)
)(ShippingAddressWithContext);
