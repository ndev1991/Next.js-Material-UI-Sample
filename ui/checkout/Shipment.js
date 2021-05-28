import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Hidden,
  // FormControlLabel,
  // Checkbox,
  Button,
  Divider,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import classNames from 'classnames';
import numeral from 'numeral';

import { url, CloudinaryContext } from '../../lib/cloudinary';
import GiftMessage from './GiftMessage';
// import SchoolLogo from '../../static/img/logos/school.png';
import CheckoutContext from './context';

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
  redTypo: {
    color: 'red'
  },
  secondary: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.common.white,
    color: '#21B6A8',
    border: '1px solid #21B6A8',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.white
    },
    [theme.breakpoints.down(321)]: {
      fontSize: 12
    }
  },
  secondaryEndorsed: {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`
  },
  typoButton: {
    color: theme.palette.common.grey['800'],
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 14,

    '&:hover': {
      fontWeight: 600
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
  giftImage: {
    width: 80,
    height: 80,
    padding: theme.spacing.unit,
    maxWidth: '100%',
    paddingBottom: '75%'
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

const Shipment = props => {
  const {
    classes,
    item,
    shippingAddress,
    occasions,
    saveGiftMessage,
    giftMessage,
    step,
    onAddDeliveryLocation,
    no
  } = props;
  const { cloudName, imagePath } = useContext(CloudinaryContext);
  const { order, schoolcode } = useContext(CheckoutContext);
  const isGiftAvailable = item.hasSimpleGiftMessage || item.hasCardGiftMessage;
  const isCardAvailable = item.hasCardGiftMessage;
  const { code, to, from, message } = giftMessage;
  // const [isMoveIn, setIsMoveIn] = useState(false);
  const existGift = code || to || from || message;
  let cardImage = '';
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  if (step !== 'shipping' && code) {
    for (let i = 0; i < occasions.length; i += 1) {
      const selectedCard = occasions[i].designs.filter(c => c.sku === code);
      if (selectedCard.length) {
        cardImage = selectedCard[0].cardImageUrl;
        break;
      }
    }
  }

  const renderOptions = () => {
    if (item.items && item.items.length) {
      return (
        <Grid item container spacing={16} direction="column">
          <Hidden smDown>
            <Grid item>
              <Divider className={classNames(classes.divider, 'dotted')} />
            </Grid>
          </Hidden>
          {item.items.map((subItem, id) => (
            <Grid key={id} item container spacing={8}>
              <Hidden smDown>
                <Grid item>
                  <div className={classNames(classes.blackImg, 'small')}>
                    <img
                      src={url(cloudName, `${imagePath}/${subItem.itemImage}`, {
                        width: 80,
                        crop: 'fit'
                      })}
                      alt={subItem.itemImage}
                    />
                  </div>
                </Grid>
              </Hidden>
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'productTitle')}
                >
                  {subItem.itemTitle}
                </Typography>
                {subItem.options &&
                  subItem.options.map(option => (
                    <Typography
                      className={classes.typography}
                      key={option.optionId}
                    >
                      {`${option.groupName}: ${option.optionName}`}
                    </Typography>
                  ))}
                <Typography className={classes.typography} gutterBottom>
                  SKU: {subItem.itemSku}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
    }

    return null;
  };

  return (
    <Grid container>
      <Grid item container spacing={8}>
        <Grid item md={2} xs={4}>
          <div className={classes.blackImg}>
            <img
              src={url(cloudName, `${imagePath}/${item.itemImage}`, {
                width: 100,
                crop: 'fit'
              })}
              alt={item.itemImage}
            />
          </div>
        </Grid>
        <Grid item container md={10} xs={8}>
          <Grid item container spacing={8}>
            <Grid item container md={4}>
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'productTitle')}
                >
                  {item.itemTitle}
                </Typography>
                <Hidden smUp>
                  <Typography
                    className={classNames(
                      classes.typography,
                      classes.redTypo,
                      'productTitle'
                    )}
                  >
                    {numeral(item.unitPrice * item.quantity).format('$0,0.00')}
                  </Typography>
                </Hidden>
                {item.options &&
                  item.options.map(option => (
                    <Typography
                      className={classes.typography}
                      key={option.optionId}
                    >
                      {`${option.groupName}: ${option.optionName}`}
                    </Typography>
                  ))}
                <Typography className={classes.typography} gutterBottom>
                  {`SKU: ${item.itemSku}`}
                </Typography>
              </Grid>
              {step !== 'shipping' && isGiftAvailable && (
                <Grid item container spacing={8}>
                  {!existGift && step === 'confirm' && (
                    <GiftMessage
                      to={`${shippingAddress &&
                        shippingAddress.student.firstName} ${shippingAddress &&
                        shippingAddress.student.lastName}`}
                      setGiftMessage={props.setGiftMessage}
                      isCardAvailable={isCardAvailable}
                      occasions={occasions}
                      saveGiftMessage={saveGiftMessage}
                      giftMessage={giftMessage}
                      productId={item.productId}
                    />
                  )}
                  {existGift && (
                    <>
                      {cardImage !== '' && (
                        <Grid item container md={4}>
                          <div
                            className={classNames(classes.blackImg, 'small')}
                          >
                            <img src={cardImage} alt="card_image" />
                          </div>
                        </Grid>
                      )}
                      <Grid
                        item
                        container
                        md={cardImage !== '' ? 6 : 10}
                        direction="column"
                        justify="space-between"
                      >
                        <Typography className={classes.typography}>
                          To: {to}
                        </Typography>
                        <Typography className={classes.typography}>
                          Message: {message}
                        </Typography>
                        <Typography className={classes.typography}>
                          From: {from}
                        </Typography>
                      </Grid>
                      {step === 'confirm' && (
                        <Grid item md={2}>
                          <GiftMessage
                            // eslint-disable-next-line prettier/prettier
                            to={`${shippingAddress && shippingAddress.student.firstName} ${shippingAddress && shippingAddress.student.lastName}`}
                            setGiftMessage={props.setGiftMessage}
                            isCardAvailable={isCardAvailable}
                            occasions={occasions}
                            saveGiftMessage={saveGiftMessage}
                            giftMessage={giftMessage}
                          />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              )}
            </Grid>
            <Hidden smUp>{renderOptions()}</Hidden>
            <Grid item container md={1} direction="column">
              <Hidden smUp>
                <Grid item>
                  <Typography className={classes.typography}>
                    Fulfilled by OCM
                  </Typography>
                </Grid>
              </Hidden>
              <Grid item>
                <Typography
                  className={classNames(classes.typography, 'productTitle')}
                >
                  {`Qty: ${item.quantity}`}
                </Typography>
              </Grid>
            </Grid>
            <Hidden xsDown>
              <Grid item md={2}>
                <Typography
                  className={classNames(classes.typography, 'productTitle')}
                >
                  {numeral(item.unitPrice * item.quantity).format('$0,0.00')}
                </Typography>
              </Grid>
            </Hidden>
            {no === 0 && order.consignments.length > 1 && (
              <Grid item container md={5}>
                {!shippingAddress && step !== 'thankyou' && (
                  <Grid item>
                    <Button
                      className={classNames(
                        classes.secondary,
                        endorsed ? classes.secondaryEndorsed : ''
                      )}
                      disableRipple
                      onClick={onAddDeliveryLocation}
                    >
                      Add Delivery Location
                    </Button>
                  </Grid>
                )}
                {shippingAddress && (
                  <Grid item container spacing={8}>
                    <Grid item container md={8} xs={12} spacing={8}>
                      <Grid item md={2} xs={2}>
                        <PlaceIcon />
                      </Grid>
                      <Grid item container md={10} xs={10} spacing={8}>
                        <Grid item xs={12}>
                          <Typography className={classes.typography}>
                            Delivery Location
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          {/* <Typography>{shippingAddress.type}</Typography> */}
                          {!JSON.parse(shippingAddress.type)
                            .isCampusDelivery && (
                            <>
                              <Typography className={classes.typography}>
                                {`${shippingAddress &&
                                  shippingAddress.student.firstName} 
                                ${shippingAddress &&
                                  shippingAddress.student.lastName}`}
                              </Typography>
                              <Typography className={classes.typography}>
                                {shippingAddress &&
                                  shippingAddress.address.address}
                              </Typography>
                              <Typography className={classes.typography}>
                                {shippingAddress && shippingAddress.address.apt}
                              </Typography>
                              <Typography className={classes.typography}>
                                {`${shippingAddress &&
                                  shippingAddress.address.city}, 
                                  ${shippingAddress &&
                                    shippingAddress.address.state} 
                                  ${shippingAddress &&
                                    shippingAddress.address.zip}`}
                              </Typography>
                            </>
                          )}
                          {JSON.parse(shippingAddress.type)
                            .isCampusDelivery && (
                            <>
                              <Typography className={classes.typography}>
                                Campus Delivery
                              </Typography>
                              <Typography className={classes.typography}>
                                {shippingAddress.address.resHall}
                              </Typography>
                              <Typography
                                className={classes.typography}
                                gutterBottom
                              >
                                {`${
                                  shippingAddress.address.roomNo
                                }${shippingAddress.address.roomNo &&
                                  shippingAddress.address.campusBox &&
                                  ', '}${shippingAddress.address.campusBox}`}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    {step !== 'thankyou' && (
                      <Grid item md={4} xs={12}>
                        <Typography
                          className={classes.typoButton}
                          onClick={onAddDeliveryLocation}
                        >
                          Change
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
          <Hidden smDown>{renderOptions()}</Hidden>
        </Grid>
      </Grid>
    </Grid>
  );
};

Shipment.propTypes = {
  item: PropTypes.object
};

export default withStyles(styles)(Shipment);
