import React, { useState, useEffect, useContext } from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid, Divider, Hidden } from '@material-ui/core';
import classNames from 'classnames';
import numeral from 'numeral';
import Link from 'next/link';

import SchoolLogo from '../../static/img/icons/SchoolLogo';
// import DeliveryIcon from '../../static/img/icons/delivery.png';
import CheckoutContext, { CheckoutConsumer } from './context';
import { orderMessaging } from '../../src/graphql/checkout';
import Shipment from './Shipment';
import OverlayProgress from '../../components/LoadingSpinner';
import ShippingAddressModal from './ShippingAddressModal';
import PaypalSmartButton from './PaypalSmartButton';
import ShipmentInfo from './ShipmentInfo';
import OrderPriceList from './OrderPriceList';

const styles = theme => ({
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  logo: {
    width: 42,
    height: 42
  },
  redTypo: {
    color: 'red'
  },
  field: {
    height: 44,
    textTransformation: 'none'
  },
  group: {
    flexDirection: 'row'
  },
  primaryButton: {
    backgroundColor: theme.palette.common.grey['800'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,

    '&:hover': {
      backgroundColor: theme.palette.common.grey['100']
    }
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
  flexbox: {
    display: 'flex'
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
  },
  method: {
    border: '1px solid grey',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
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
  error: {
    color: theme.palette.common.error
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
  },
  positionRelative: {
    position: 'relative',
    overflow: 'hidden'
  }
});

const PlaceOrder = props => {
  const { classes, onBack, onStepN } = props;
  const { usedAddresses } = useContext(CheckoutContext);
  const [occasions, setOccasions] = useState([]);
  const [selectedConsignment, setSelectedConsignment] = useState({});
  const [open, setOpen] = useState(false);
  let prevAvailableAddresses;

  useEffect(() => {
    if (!props.orderMessaging.loading) {
      setOccasions(props.orderMessaging.orderMessaging.occasions);
    }
  }, [props.orderMessaging.loading]);

  const handleSetAddress = con => () => {
    setSelectedConsignment(con);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  if (selectedConsignment.mustShipToSchool) {
    prevAvailableAddresses = usedAddresses.filter(
      addr => JSON.parse(addr.type).isCampusDelivery
    );
  } else if (!selectedConsignment.canShipToSchool) {
    prevAvailableAddresses = usedAddresses.filter(
      addr => !JSON.parse(addr.type).isCampusDelivery
    );
  } else {
    prevAvailableAddresses = usedAddresses;
  }

  return (
    <CheckoutConsumer>
      {({
        order,
        residenceHalls,
        billingAddress,
        shippingOptions,
        addNewAddress,
        paymentMethod,
        handleSaveGiftMessage,
        handlePlaceOrder,
        orderMessage,
        isProceeding,
        completed,
        schoolcode,
        addressLoading,
        color
      }) => {
        const totalPrice = order.total;
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
                  <Typography variant="h5">
                    Almost Done! Please review and place your Order.
                  </Typography>
                </Grid>
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
                gotoStep={onStepN}
                changePayment={onBack}
                endorsed={endorsed}
              />
              {endorsed && canShipToSchool && (
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
            <Hidden smUp>
              <Grid item container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="h5">Place Order</Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classNames(classes.flexbox, classes.typography)}
                  >
                    By placing your order, you agree to OCM's &nbsp;
                    <Link
                      href={`/${
                        endorsed ? `${schoolcode}/` : ''
                      }privacy-policy`}
                    >
                      <a target="_blank">
                        <Typography
                          className={classNames(
                            classes.typoButton,
                            endorsed ? classes.endorsedLink : ''
                          )}
                        >
                          Privacy Policy
                        </Typography>
                      </a>
                    </Link>
                    &nbsp;and&nbsp;
                    <Link
                      href={`/${
                        endorsed ? `${schoolcode}/` : ''
                      }terms-and-conditions`}
                    >
                      <a target="_blank">
                        <Typography
                          className={classNames(
                            classes.typoButton,
                            endorsed ? classes.endorsedLink : ''
                          )}
                        >
                          Terms & Conditions.
                        </Typography>
                      </a>
                    </Link>
                  </Typography>
                </Grid>
                <Grid item className={classes.positionRelative}>
                  {orderMessage !== '' && (
                    <Typography className={classes.error} align="right">
                      {orderMessage}
                    </Typography>
                  )}
                  <Button
                    className={classNames(
                      classes.button,
                      endorsed ? classes.endorsedButton : ''
                    )}
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={completed[2] || isProceeding}
                    fullWidth
                  >
                    Place order
                  </Button>
                  {paymentMethod.type === 'paypal' && !completed[2] && (
                    <PaypalSmartButton
                      orderId={order.id}
                      id="paypal-button-1"
                    />
                  )}
                </Grid>
                <Grid item>
                  <Divider className={classes.divider} />
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
                gotoStep={onStepN}
                changePayment={onBack}
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
                            step="confirm"
                            onAddDeliveryLocation={handleSetAddress(
                              consignment
                            )}
                            item={item}
                            giftMessage={{
                              code: consignment.giftMessageCode,
                              to: consignment.giftMessageTo,
                              from: consignment.giftMessageFrom,
                              message: consignment.giftMessageMessage
                            }}
                            isCampusAvailable={isCampusAvailable}
                            shippingAddress={shippingAddr[0]}
                            occasions={occasions}
                            saveGiftMessage={cardInfo =>
                              handleSaveGiftMessage(consignment.id, cardInfo)
                            }
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
            <Grid item container justify="space-between" spacing={16}>
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'productTitle')}
                >
                  {`Order Total: ${numeral(totalPrice).format('$0,0.00')}`}
                </Typography>
                <Typography
                  className={classNames(classes.flexbox, classes.typography)}
                >
                  By placing your order, you agree to OCM's &nbsp;
                  <Link
                    href={`/${endorsed ? `${schoolcode}/` : ''}privacy-policy`}
                  >
                    <a target="_blank">
                      <Typography className={classNames(classes.typoButton)}>
                        Privacy Policy
                      </Typography>
                    </a>
                  </Link>
                  &nbsp;and&nbsp;
                  <Link
                    href={`/${
                      endorsed ? `${schoolcode}/` : ''
                    }terms-and-conditions`}
                  >
                    <a target="_blank">
                      <Typography className={classNames(classes.typoButton)}>
                        Terms & Conditions.
                      </Typography>
                    </a>
                  </Link>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12} className={classes.positionRelative}>
                {orderMessage !== '' && (
                  <Typography className={classes.error} align="right">
                    {orderMessage}
                  </Typography>
                )}
                <Button
                  className={classNames(
                    classes.button,
                    endorsed ? classes.endorsedButton : ''
                  )}
                  variant="contained"
                  onClick={handlePlaceOrder}
                  disabled={completed[2] || isProceeding}
                  fullWidth
                >
                  Place order
                </Button>
                {paymentMethod.type === 'paypal' && !completed[2] && (
                  <PaypalSmartButton orderId={order.id} id="paypal-button-2" />
                )}
              </Grid>
            </Grid>
            <ShippingAddressModal
              shipment={selectedConsignment}
              residenceHalls={residenceHalls}
              schoolcode={schoolcode}
              usedAddresses={prevAvailableAddresses}
              shippingOptions={shippingOptions}
              addNewAddress={addNewAddress}
              open={open}
              zip=""
              handleClose={handleCloseModal}
            />
            {(isProceeding || addressLoading) && <OverlayProgress />}
          </Grid>
        );
      }}
    </CheckoutConsumer>
  );
};

PlaceOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  onBack: PropTypes.func
};

export default compose(
  graphql(orderMessaging, { name: 'orderMessaging' }),
  withStyles(styles)
)(PlaceOrder);
