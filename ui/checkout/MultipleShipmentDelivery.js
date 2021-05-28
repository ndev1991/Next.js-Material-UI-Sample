import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid, Divider, Hidden } from '@material-ui/core';
import Link from 'next/link';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import classNames from 'classnames';
import numeral from 'numeral';

// import DeliveryIcon from '../../static/img/icons/delivery.png';
import CheckoutContext from './context';
import Shipment from './Shipment';
import ShippingAddressModal from './ShippingAddressModal';
import OverlayProgress from '../../components/progress/OverlayProgress';

const styles = theme => ({
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  flexbox: {
    display: 'flex'
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
    marginBottom: theme.spacing.unit,

    '&:hover': {
      backgroundColor: theme.palette.common.grey['100']
    }
  },
  method: {
    border: '1px solid grey',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
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

const MultipleShipmentDelivery = props => {
  const { classes, onNext } = props;
  const {
    order,
    residenceHalls,
    usedAddresses,
    shippingOptions,
    addNewAddress,
    schoolcode,
    addressLoading,
    setCompleted
  } = useContext(CheckoutContext);
  const [goodToGo, setGoodToGo] = useState(false);
  const totalPrice = order.total;
  const [selectedConsignment, setSelectedConsignment] = useState({});
  const [open, setOpen] = useState(false);
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  useEffect(() => {
    if (order) {
      const isGoodToGo = order.consignments.reduce(
        (good, con) => good && con.addressId !== 0,
        true
      );

      setGoodToGo(isGoodToGo);
    }
  }, [order]);

  const handleSetAddress = con => () => {
    setSelectedConsignment(con);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setCompleted(0);
    onNext();
  };

  return (
    <Grid container direction="column">
      <Hidden smDown>
        <Grid item container justify="space-between">
          <Grid item>
            <Typography className={classNames(classes.typography, 'title')}>
              Shipping Delivery Options
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Button
              className={classNames(
                classes.button,
                endorsed ? classes.endorsedButton : ''
              )}
              variant="contained"
              onClick={handleNext}
              fullWidth
              disabled={!goodToGo}
            >
              Continue to Payment
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.divider} />
        </Grid>
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
        <Grid item>
          <Divider className={classes.divider} />
        </Grid>
        {order.consignments
          .sort((con1, con2) => con1.id - con2.id)
          .map((consignment, idx) => {
            let shippingAddress = [];
            const isCampusAvailable =
              consignment.canShipToSchool || consignment.mustShipToSchool;

            if (consignment.addressId) {
              shippingAddress = usedAddresses.filter(
                addr => parseInt(addr.id, 10) === consignment.addressId
              );
            }

            return (
              <React.Fragment key={idx}>
                <Grid item container spacing={8}>
                  <Grid item md={6}>
                    <Typography
                      className={classNames(classes.typography, 'productTitle')}
                    >
                      {`Shipment ${idx + 1} of ${order.consignments.length}`}
                    </Typography>
                  </Grid>
                </Grid>
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
                        onAddDeliveryLocation={handleSetAddress(consignment)}
                        item={item}
                        giftMessage={{
                          code: consignment.giftMessageCode,
                          to: consignment.giftMessageTo,
                          from: consignment.giftMessageFrom,
                          message: consignment.giftMessageMessage,
                          image: consignment.giftMessageImage
                        }}
                        isCampusAvailable={isCampusAvailable}
                        shippingAddress={shippingAddress[0]}
                        step="shipping"
                      />
                    </Grid>
                  </React.Fragment>
                ))}
                {/* <Hidden smUp>
                <Grid item xs={12}>
                  <Divider className={classNames(classes.divider, 'dotted')} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth>
                    <Grid
                      container
                      spacing={8}
                      alignItems="center"
                      justify="space-between"
                    >
                      <Grid item xs={2}>
                        <img
                          className={classes.icon}
                          src={DeliveryIcon}
                          alt="delivery_icon"
                        />
                      </Grid>
                      <Grid item xs={8} className={classes.normalText}>
                        <Typography variant="subtitle2">
                          FREE Ground Shipping
                        </Typography>
                        <Typography>Get it by Monday, Aug 26</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <ArrowForwardIcon />
                      </Grid>
                    </Grid>
                  </Button>
                </Grid>
              </Hidden> */}
                <Grid item>
                  <Divider className={classes.divider} />
                </Grid>
              </React.Fragment>
            );
          })}
      </Grid>
      <Grid item container justify="space-between" spacing={8}>
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
            <Link href={`/${endorsed ? `${schoolcode}/` : ''}privacy-policy`}>
              <a target="_blank">
                <Typography className={classNames(classes.typoButton)}>
                  Privacy Policy
                </Typography>
              </a>
            </Link>
            &nbsp;and&nbsp;
            <Link
              href={`/${endorsed ? `${schoolcode}/` : ''}terms-and-conditions`}
            >
              <a target="_blank">
                <Typography className={classNames(classes.typoButton)}>
                  Terms & Conditions.
                </Typography>
              </a>
            </Link>
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Button
            className={classNames(
              classes.button,
              endorsed ? classes.endorsedButton : ''
            )}
            variant="contained"
            onClick={handleNext}
            fullWidth
            disabled={!goodToGo}
          >
            Continue to Payment
          </Button>
        </Grid>
      </Grid>
      <ShippingAddressModal
        shipment={selectedConsignment}
        residenceHalls={residenceHalls}
        schoolcode={schoolcode}
        usedAddresses={usedAddresses}
        shippingOptions={shippingOptions}
        addNewAddress={addNewAddress}
        open={open}
        zip=""
        handleClose={handleCloseModal}
      />
      {addressLoading && <OverlayProgress />}
    </Grid>
  );
};

MultipleShipmentDelivery.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MultipleShipmentDelivery);
