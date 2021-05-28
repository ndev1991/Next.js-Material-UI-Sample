import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Typography, Button } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import Link from 'next/link';
import classNames from 'classnames';

import Header from './Header';
import Footer from './Footer';
import ShippingDelivery from './SingleShipmentDelivery';
import MultipleShippingDelivery from './MultipleShipmentDelivery';
import Payment from './Payment';
import PlaceOrder from './PlaceOrder';
import OrderSummary from './OrderSummary';
import OrderDetail from './OrderDetail';
import { CheckoutProvider } from './context';
import {
  checkout,
  placeOrder,
  addPromoCode,
  setGiftMessage,
  setShippingAddress,
  setShippingMethod,
  setStudentInfo,
  addCardPayment,
  addPaypalPayment
} from '../../src/graphql/checkout';
import {
  gtmShipping,
  gtmBilling,
  gtmPlaceOrder,
  gtmConfirmation,
  gtmAddPromoCode
} from '../../src/gtm/checkout';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationsContext from '../../lib/notificationsContext';

const routes = require('next-routes')();

const styles = theme => ({
  container: {
    height: 'calc(100vh - 337px)'
  },
  root: {
    width: '90%',
    margin: 'auto',
    padding: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 0
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
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  }
});

const DEFAULT_LOGO =
  'https://res.cloudinary.com/ocm/image/upload/wws/logos/ocm';

const getStepContent = (stepIndex, onNext, onBack, onStepN, isMultiple) => {
  switch (stepIndex) {
    case 0:
      return (
        <>
          {isMultiple ? (
            <MultipleShippingDelivery
              onStepN={onStepN}
              onNext={onNext}
              onBack={onBack}
            />
          ) : (
            <ShippingDelivery
              onStepN={onStepN}
              onNext={onNext}
              onBack={onBack}
            />
          )}
        </>
      );
    // case 1:
    //   return <GiftOptions onNext={onNext} onBack={onBack} />;
    case 1:
      return <Payment onNext={onNext} onBack={onBack} />;
    case 2:
      return <PlaceOrder onNext={onNext} onBack={onBack} onStepN={onStepN} />;
    case 3:
      return <OrderDetail />;
    default:
      return 'Unknown stepIndex';
  }
};

const Checkout = props => {
  const {
    classes,
    schoolcode,
    logo,
    domain,
    residenceHalls,
    userId,
    browserId,
    sessionId,
    navOptions,
    color
  } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [billingAddress, setBillingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({ cardInfo: {} });
  const [shipAddress, setShipAddress] = useState({});
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [usedAddresses, setUsedAddresses] = useState([]);
  const [isProceeding, setIsProceeding] = useState(false);
  const { showNotification } = useContext(NotificationsContext);
  const [orderMessage, setOrderMessage] = useState('');
  const [completed, setCompleted] = useState([false, false, false]);
  const [promoError, setPromoError] = useState('');
  const [shippingOptions, setShippingOptions] = useState({});
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  const getOrder = async () => {
    const data = await props.checkout({
      variables: {
        schoolcode,
        domain
      }
    });

    const shipOptions = {};

    if (data.data.checkout) {
      data.data.checkout.consignments.forEach(consignment =>
        Object.assign(shipOptions, {
          [consignment.id]: consignment.shippingOptions
        })
      );
    }

    setIsLoading(false);
    setOrder(data.data.checkout);
    setShippingOptions(shipOptions);
  };

  useEffect(() => {
    if (userId || browserId || sessionId) {
      getOrder();
    }
  }, [props.schoolcode, props.domain]);

  const handleNext = () => {
    if (currentStep === 2) {
      // GTM - Confirmation page
      gtmConfirmation(order, couponCode);
    }

    setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleStepTo = n => () => {
    if (completed[n]) {
      setCurrentStep(n);
    }
  };

  const renderNotification = (err, msg = 'Error', type = 'error') => {
    const message = msg;
    showNotification({
      type,
      message
    });

    if (err) {
      console.error(err.message);
    }
  };

  const handlePaymentMethod = async info => {
    // GTM - Billing
    gtmBilling(order);

    setPaymentMethod(info);

    try {
      if (info.type === 'paypal') {
        await props.addPaypalPayment({
          variables: {
            payment: {
              paymentMethod: 'Paypal',
              addressId: info.cardInfo.addressId,
              orderId: order.id
            }
          }
        });
      } else {
        await props.addCardPayment({
          variables: {
            payment: {
              ...info.cardInfo,
              orderId: order.id
            }
          }
        });
      }

      return true;
    } catch (err) {
      renderNotification(err, 'Failed to add payment method.');
      return false;
    }
  };

  const handlePromoCode = code => async () => {
    const data = await props.addPromoCode({
      variables: {
        promo: {
          orderId: order.id,
          code
        }
      }
    });

    if (data.data.addPromoCode) {
      // GTM - Apply promo code
      gtmAddPromoCode(code);

      setCouponCode(code);
      setOrder(data.data.addPromoCode);
    } else {
      setPromoError('Wrong coupon code.');
    }
  };

  const handleSaveGiftMessage = async (conId, cardInfo) => {
    setIsProceeding(true);

    const data = await props.setGiftMessage({
      variables: {
        message: {
          orderId: order.id,
          consignmentId: conId,
          ...cardInfo
        }
      }
    });

    if (data.data.setGiftMessage) {
      setOrder(data.data.setGiftMessage);
    }

    setIsProceeding(false);
  };

  // Mark step n completed
  const handleSetCompleted = n => {
    const arrCompleted = completed.slice();
    arrCompleted[n] = true;
    setCompleted(arrCompleted);
  };

  const handlePlaceOrder = async () => {
    setIsProceeding(true);

    // GTM - Place Order
    gtmPlaceOrder(order);

    const data = await props.placeOrder({
      variables: {
        orderId: order.id
      }
    });

    setIsProceeding(false);

    if (data.data.placeOrder.success) {
      handleSetCompleted(2);
      setOrderMessage('Already submitted!');
      setOrder(data.data.placeOrder.order);
      handleNext();
    } else {
      setOrderMessage(data.data.placeOrder.errorMessage);
    }
  };

  const setDeliveryInfo = async addr => {
    const { consignmentId, id, type } = addr;

    // Set loading state
    setIsProceeding(true);

    // Call setStudent
    try {
      await props.setStudentInfo({
        variables: {
          student: {
            consignmentId,
            orderId: order.id,
            ...addr.student
          }
        }
      });

      // Call setShippingAddress mutation
      try {
        // GTM - Shipping
        gtmShipping(order);

        const resShip = await props.setShippingAddress({
          variables: {
            shipping: {
              addressId: id,
              consignmentId
            }
          }
        });

        if (resShip.data.setShippingAddress) {
          setOrder(resShip.data.setShippingAddress);
          setShipAddress({
            ...addr.address,
            ...addr.student,
            ...addr.campusInfo
          });
        }

        try {
          const { name, deliveryLocation } = JSON.parse(type);
          const resData = await props.setShippingMethod({
            variables: {
              shipping: {
                consignmentId,
                shippingMethod: name,
                deliveryLocation
              }
            }
          });

          if (resData.data.setShippingMethod) {
            setOrder(resData.data.setShippingMethod);
          }

          // Release loading state
          setIsProceeding(false);

          return true;
        } catch (err) {
          renderNotification(err, 'Failed to set shipping method.');
          // Release loading state
          setIsProceeding(false);
          return false;
        }
      } catch (err) {
        renderNotification(err, 'Failed to set shipping address.');
        // Release loading state
        setIsProceeding(false);
        return false;
      }
    } catch (err) {
      renderNotification(err, 'Failed to set student info.');
      // Release loading state
      setIsProceeding(false);
      return false;
    }
  };

  const addNewAddress = async (addr, callback) => {
    const bSuccess = await setDeliveryInfo(addr, callback);
    if (bSuccess) {
      setUsedAddresses([...usedAddresses, addr]);
      return true;
    }
    return false;
  };

  const isMultiple = order ? order.consignments.length > 1 : false;

  return (
    <CheckoutProvider
      value={{
        billingAddress,
        setBillingAddress,
        shippingAddress: shipAddress,
        paymentMethod,
        usedAddresses,
        shippingOptions,
        addNewAddress,
        completed,
        promoError,
        setPromoError,
        setCompleted: handleSetCompleted,
        isProceeding,
        setPaymentMethod: handlePaymentMethod,
        couponCode,
        currentStep,
        residenceHalls,
        orderMessage,
        order,
        schoolcode,
        handlePromoCode,
        handlePlaceOrder,
        handleSaveGiftMessage,
        renderNotification,
        logo,
        color
      }}
    >
      <div className={classes.root}>
        <Head>
          <script src="https://www.paypal.com/sdk/js?client-id=AV5KdXbBFHDtN0bkRuLU-0GDz3V-h3q7_aozSzXafDeCEpKJ134Lu_TUlBrCxees6kwyegttO6By8r37&intent=authorize" />
        </Head>
        <Header
          currentStep={currentStep}
          logo={logo || DEFAULT_LOGO}
          schoolcode={schoolcode}
          setCurrentStep={handleStepTo}
        />
        {!isLoading && !order && (
          <Grid
            item
            container
            alignItems="center"
            justify="center"
            direction="column"
            className={props.classes.container}
          >
            <Grid item>
              <Typography
                className={props.classes.typography}
                variant="h4"
                align="center"
                gutterBottom
              >
                Your cart is empty.
              </Typography>
              <Typography
                className={props.classes.typography}
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
                      endorsed ? classes.endorsedLink : ''
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
                  endorsed ? classes.endorsedButton : ''
                )}
                onClick={() =>
                  routes.Router.push(
                    `/${schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''}`
                  )
                }
                variant="contained"
                disableRipple
              >
                Continue Shopping
              </Button>
            </Grid>
          </Grid>
        )}
        {!isLoading && order && (
          <Grid container spacing={8} disabled>
            <Grid item md={8}>
              {getStepContent(
                currentStep,
                handleNext,
                handleBack,
                handleStepTo,
                isMultiple
              )}
            </Grid>
            <Hidden smDown>
              <Grid item md={4}>
                <OrderSummary onStepN={handleStepTo} schoolcode={schoolcode} />
              </Grid>
            </Hidden>
          </Grid>
        )}
        {isLoading && (
          <div className={classes.container}>
            <LoadingSpinner />
          </div>
        )}
        <Footer navOptions={navOptions} />
      </div>
    </CheckoutProvider>
  );
};

Checkout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  graphql(placeOrder, { name: 'placeOrder' }),
  graphql(setShippingAddress, { name: 'setShippingAddress' }),
  graphql(setShippingMethod, { name: 'setShippingMethod' }),
  graphql(setStudentInfo, { name: 'setStudentInfo' }),
  graphql(addCardPayment, { name: 'addCardPayment' }),
  graphql(addPaypalPayment, { name: 'addPaypalPayment' }),
  graphql(setGiftMessage, { name: 'setGiftMessage' }),
  graphql(addPromoCode, { name: 'addPromoCode' }),
  graphql(checkout, { name: 'checkout' }),
  withStyles(styles)
)(Checkout);
