import React, { useState, useEffect } from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Hidden, Button } from '@material-ui/core';
import classNames from 'classnames';

import SchoolLogo from '../../static/img/icons/SchoolLogo';
import { orderMessaging } from '../../src/graphql/checkout';
import { CheckoutConsumer } from './context';
import ShipmentInfo from './ShipmentInfo';
import OrderPriceList from './OrderPriceList';
import Shipment from './Shipment';

const routes = require('next-routes')();

const styles = theme => ({
  blackImg: {
    background: 'transparent',
    width: 100,
    height: 100,
    maxWidth: '100%',

    [theme.breakpoints.down('sm')]: {
      width: 85,
      height: 85
    },

    '&.small': {
      width: 80,
      height: 80
    },

    '& > img': {
      width: '100%',
      maxWidth: '100%',
      paddingBottom: '75%'
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  redTypo: {
    color: 'red'
  },
  logo: {
    width: 42,
    height: 42
  },
  typoId: {
    color: theme.palette.secondary.main,
    fontSize: 20,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 'bold'
  },
  normalTypo: {
    color: theme.palette.common.grey['800'],
    fontSize: 20,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 'bold'
  },
  field: {
    height: 44,
    textTransformation: 'none'
  },
  group: {
    flexDirection: 'row'
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
  primaryButton: {
    backgroundColor: theme.palette.common.grey['800'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  method: {
    border: '1px solid grey',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  typoButton: {
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  normalText: {
    textTransform: 'none',
    textAlign: 'left'
  },
  formControl: {
    width: '50%',
    paddingTop: 14,
    paddingBottom: 14
  },
  inner: {
    paddingLeft: `${theme.spacing.unit * 2}px !important`,
    paddingRight: `${theme.spacing.unit * 2}px !important`
  },
  icon: {
    [theme.breakpoints.down('sm')]: {
      width: 45,
      height: 45
    }
  },
  typography: {
    color: theme.palette.common.grey['800'],
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: 16,
    fontWeight: 400,

    '&.productTitle': {
      fontSize: 18,
      fontWeight: 'bold'
    },

    '&.title': {
      fontSize: 28
    }
  }
});

Shipment.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object
};

const OrderDetail = props => {
  const { classes } = props;
  const [occasions, setOccasions] = useState([]);

  useEffect(() => {
    if (!props.orderMessaging.loading) {
      setOccasions(props.orderMessaging.orderMessaging.occasions);
    }
  }, [props.orderMessaging.loading]);

  return (
    <CheckoutConsumer>
      {({
        order,
        billingAddress,
        paymentMethod,
        usedAddresses,
        schoolcode,
        color
      }) => {
        const isMultiple = order.consignments.length > 1;
        const canShipToSchool = order.consignments.reduce(
          (css, consignment) => {
            const addressId = consignment.addressId;
            const shipAddress =
              usedAddresses.filter(
                addr => parseInt(addr.id, 10) === addressId
              ) || [];
            return css || JSON.parse(shipAddress[0].type).isCampusDelivery;
          },
          false
        );
        const endorsed = schoolcode.toLowerCase() !== 'ocm';

        let shippingAddress;
        if (isMultiple) {
          shippingAddress =
            'You are shipping to multiple addresses. See each shipment for details';
        } else {
          shippingAddress =
            usedAddresses.filter(
              addr => parseInt(addr.id, 10) === order.consignments[0].addressId
            ) || [];
        }

        return (
          <Grid container direction="column">
            <Hidden smDown>
              <Grid item container justify="space-between">
                <Grid item>
                  <Typography
                    className={classNames(classes.typography, 'title')}
                    gutterBottom
                  >
                    Thank you for your support!
                  </Typography>
                  <Typography
                    className={classNames(classes.typography, 'productTitle')}
                  >
                    Your order has been placed.
                  </Typography>
                  <Typography className={classes.typography}>
                    Please check your email for order confirmation and detailed
                    delivery information.
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Divider className={classes.divider} />
              </Grid>
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'title')}
                  gutterBottom
                >
                  Order Details
                </Typography>
              </Grid>
              <Grid item>
                <Divider className={classNames(classes.divider, 'dotted')} />
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  className={
                    schoolcode === 'ocm' ? classes.normalTypo : classes.typoId
                  }
                  gutterBottom
                >
                  Order ID: {order.ecometryOrderNumber}
                </Typography>
              </Grid>
              <ShipmentInfo
                classes={classes}
                page="placeOrder"
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                isMultiple={isMultiple}
                paymentMethod={paymentMethod}
                gotoStep={() => {}}
                changePayment={() => {}}
                endorsed={endorsed}
              />
              {canShipToSchool && (
                <>
                  <Grid item container spacing={8} alignItems="center">
                    <Grid
                      item
                      container
                      md={1}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item className={classes.logo}>
                        <SchoolLogo color={color} />
                      </Grid>
                    </Grid>
                    <Grid item md={11}>
                      <Typography
                        className={classNames(
                          classes.typography,
                          'productTitle'
                        )}
                      >
                        You Scored Campus Delivery!
                      </Typography>
                      <Typography className={classes.typography}>
                        One or more of your items is being shipped directly to
                        Campus.
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Divider className={classes.divider} />
                  </Grid>
                </>
              )}
            </Hidden>
            <Hidden mdUp>
              <Grid item container direction="column" spacing={8}>
                <Grid item>
                  <Typography
                    className={classNames(classes.typography, 'title')}
                    gutterBottom
                  >
                    Thank you for your support!
                  </Typography>
                  <Typography
                    className={classNames(classes.typography, 'productTitle')}
                  >
                    Your order has been placed.
                  </Typography>
                  <Typography className={classes.typography}>
                    Please check your email for order confirmation and detailed
                    delivery information.
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <Button
                    className={classNames(
                      classes.button,
                      endorsed ? classes.endorsedButton : ''
                    )}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => routes.Router.push(`/${schoolcode}`)}
                  >
                    Continue Shopping
                  </Button>
                </Grid>
                <Grid item>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item>
                  <Typography
                    className={classNames(classes.typography, 'title')}
                    gutterBottom
                  >
                    Order Details
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider className={classNames(classes.divider, 'dotted')} />
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    className={
                      schoolcode === 'ocm' ? classes.normalTypo : classes.typoId
                    }
                    gutterBottom
                  >
                    Order ID: {order.ecometryOrderNumber}
                  </Typography>
                </Grid>
                <OrderPriceList classes={classes} order={order} />
              </Grid>
              <Grid item>
                <Divider className={classes.divider} />
              </Grid>
              <ShipmentInfo
                classes={classes}
                page="placeOrder"
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                isMultiple={isMultiple}
                paymentMethod={paymentMethod}
                gotoStep={() => {}}
                changePayment={() => {}}
                endorsed={endorsed}
              />
            </Hidden>
            <Grid item container direction="column">
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'title')}
                  gutterBottom
                >
                  Shipment Details
                </Typography>
              </Grid>
              {isMultiple && (
                <Grid item>
                  <Divider className={classes.divider} />
                </Grid>
              )}
              {order.consignments.map((consignment, idx) => {
                let shippingAddr = [];
                const isCampusAvailable =
                  consignment.canShipToSchool || consignment.mustShipToSchool;

                if (consignment.addressId) {
                  shippingAddr = usedAddresses.filter(
                    addr => parseInt(addr.id, 10) === consignment.addressId
                  );
                }

                return (
                  <React.Fragment key={idx}>
                    {isMultiple && (
                      <Grid item container spacing={8}>
                        <Grid item md={6}>
                          <Typography
                            className={classNames(
                              classes.typography,
                              'productTitle'
                            )}
                          >
                            {`Shipment ${idx + 1} of ${
                              order.consignments.length
                            }`}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {consignment.shipments[0].items.map((item, id) => (
                      <React.Fragment key={id}>
                        <Grid item>
                          <Divider
                            className={classNames(classes.divider, 'dotted')}
                          />
                        </Grid>
                        <Grid item>
                          <Shipment
                            no={id}
                            step="thankyou"
                            occasions={occasions}
                            onAddDeliveryLocation={() => {}}
                            item={item}
                            giftMessage={{
                              code: consignment.giftMessageCode,
                              to: consignment.giftMessageTo,
                              from: consignment.giftMessageFrom,
                              message: consignment.giftMessageMessage
                            }}
                            isCampusAvailable={isCampusAvailable}
                            shippingAddress={shippingAddr[0]}
                          />
                        </Grid>
                      </React.Fragment>
                    ))}
                    <Grid item>
                      <Divider className={classes.divider} />
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
            <Hidden smUp>
              <Grid item md={12}>
                <Button
                  className={classNames(
                    classes.button,
                    endorsed ? classes.endorsedButton : ''
                  )}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => routes.Router.push(`/${schoolcode}`)}
                >
                  Continue Shopping
                </Button>
              </Grid>
            </Hidden>
          </Grid>
        );
      }}
    </CheckoutConsumer>
  );
};

OrderDetail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  graphql(orderMessaging, { name: 'orderMessaging' }),
  withStyles(styles)
)(OrderDetail);
