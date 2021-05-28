import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Divider,
  Checkbox,
  Select,
  OutlinedInput,
  Grid,
  RadioGroup,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  Hidden
} from '@material-ui/core';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

import InputField from '../../components/forms/InputField';
import Card from './Card';
import { CheckoutConsumer } from './context';
import {
  addResidentialAddress,
  setBillingAddress as setBilling,
  zipcode,
  getPaypalOrder
} from '../../src/graphql/checkout';
import { subscribeEmail } from '../../src/graphql/homepage';

const PAYMENT_METHODS = [
  {
    value: 'credit',
    name: 'Credit Card'
  },
  {
    value: 'paypal',
    name: 'PayPal'
  }
];
const paypalAddress = {
  address1: 'Paypal',
  city: 'West Trenton',
  stateProvince: 'NJ',
  postalCode: '08628'
};
const zipFormat = RegExp('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$');

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
  return re.test(email);
}

const styles = theme => ({
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    },

    '&.smaller': {
      margin: `${theme.spacing.unit}px 0`
    }
  },
  formControl: {
    width: '100%',
    height: 44,
    border: `1px solid ${theme.palette.common.grey['900']}`,
    borderRadius: '4px',
    fontSize: 20,

    '&:active, &:focus': {
      borderColor: theme.palette.common.grey['900'],
      color: theme.palette.common.grey['800']
    },

    '&:hover > fieldset': {
      border: 'none'
    }
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
  textField: {
    height: 44,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: '100%',
    border: `1px solid ${theme.palette.common.grey['900']}`,
    borderRadius: '4px',
    fontSize: 20,

    '& > fieldset': {
      border: 'none'
    },

    '& > input': {
      padding: 0,
      fontSize: 20,
      color: theme.palette.common.grey['900']
    },

    '&.error': {
      border: `1px solid ${theme.palette.common.error}`,
      color: theme.palette.common.error,
      '& > input': {
        color: theme.palette.common.error
      }
    }
  },
  normalText: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 400,
    fontSize: 20,
    color: theme.palette.common.grey['800']
  },
  error: {
    color: theme.palette.common.error
  },
  margin20: {
    marginTop: -20
  }
});

class Payment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: props.billingAddress.firstName || '',
      lastName: props.billingAddress.lastName || '',
      address: props.billingAddress.address || '',
      apt: props.billingAddress.apt || '',
      city: props.billingAddress.city || '',
      state: props.billingAddress.state || '',
      zip: props.billingAddress.zip || '',
      email: props.billingAddress.email || '',
      phone: props.billingAddress.phone || '',
      selectedMethod: props.paymentMethod.type || 'credit',
      cardNumber: props.paymentMethod.cardInfo.ccNumber || '',
      nameCard: props.paymentMethod.nameCard || '',
      year: props.paymentMethod.cardInfo.ccExpYear || 2019,
      month: props.paymentMethod.cardInfo.ccExpMonth || 1,
      securityCode: props.paymentMethod.cardInfo.ccCvv || '',
      isShipping: false,
      isGoodToGo: false,
      errorMsg: '*Please fill out all required fields.',
      phoneError: false,
      emailError: false,
      zipError: false,
      isValid: false,
      isValidForm: false,
      isValidZip: false,
      issuer: '',
      emailOffer: true
    };

    this.butRef = React.createRef();
  }

  componentDidMount() {
    this.validateFields();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value }, () => this.validate());
  };

  handleZipChange = event => {
    this.setState({ zip: event.target.value }, () => this.validateFields());
  };

  zipValidate = async () => {
    const { zip, isShipping, selectedMethod } = this.state;

    if (selectedMethod === 'paypal') {
      return;
    }

    let zipErr = false;
    let ct = '';
    let st = '';

    if (!isShipping) {
      if (zipFormat.test(zip)) {
        // Mailing address validation
        const zipRes = await this.props.zipcode({
          variables: {
            zip: zip.slice(0, 5)
          }
        });

        if (!zipRes.data.zip) {
          zipErr = true;
        } else {
          ct = zipRes.data.zip.city;
          st = zipRes.data.zip.state;
        }
      } else {
        zipErr = true;
      }
    }

    let errMsg = '';
    if (zipErr) {
      errMsg = 'Invalid Zip Code.';
      ct = '';
      st = '';
    } else {
      errMsg =
        '*Please fill out all required fields and correct invalid inputs.';
    }

    this.setState(
      {
        isValidZip: !zipErr,
        zipError: zipErr,
        city: ct,
        state: st,
        errorMsg: errMsg
      },
      () => this.checkIfValid()
    );
  };

  validate = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      zip,
      cardNumber,
      nameCard,
      year,
      month,
      isValid,
      securityCode,
      selectedMethod,
      isShipping
    } = this.state;

    let phoneErr = false;
    let emailErr = false;
    let empty = false;
    let cardExpired = false;

    if (selectedMethod === 'paypal') {
      if (!email) {
        empty = true;
      }

      if (phone && phone.replace(/[^0-9]/g, '').length < 10) {
        phoneErr = true;
      }

      if (!validateEmail(email)) {
        emailErr = true;
      }

      let errMsg = '';
      if (empty) {
        errMsg = '*Please fill out all required fields.';
      } else if (phoneErr) {
        errMsg = 'Invalid Phone Number.';
      } else if (emailErr) {
        errMsg = 'Invalid Email Format.';
      } else {
        errMsg =
          '*Please fill out all required fields and correct invalid inputs.';
      }

      this.setState(
        {
          isValidForm: !(phoneErr || emailErr || empty),
          phoneError: phoneErr,
          emailError: emailErr,
          errorMsg: errMsg
        },
        () => this.checkIfValid()
      );

      return {
        isValid: !(phoneErr || emailErr || empty),
        errorMsg: errMsg
      };
    }

    if (
      (!isShipping && (!firstName || !lastName || !address || !zip)) ||
      !email ||
      (selectedMethod === 'credit' &&
        (!cardNumber || !nameCard || !year || !month || !securityCode))
    ) {
      empty = true;
    }

    if (year && month) {
      const date = new Date();
      const curYear = date.getFullYear();
      const curMonth = date.getMonth();

      if (
        year < curYear ||
        (year === curYear && curMonth > month) ||
        month < 1 ||
        month > 12
      ) {
        cardExpired = true;
      }
    }

    if (phone && phone.replace(/[^0-9]/g, '').length < 10) {
      phoneErr = true;
    }

    if (!validateEmail(email)) {
      emailErr = true;
    }

    let errMsg = '';
    if (empty) {
      errMsg = '*Please fill out all required fields.';
    } else if (phoneErr) {
      errMsg = 'Invalid Phone Number.';
    } else if (emailErr) {
      errMsg = 'Invalid Email Format.';
    } else if (cardExpired) {
      errMsg = 'Expired Card.';
    } else if (!isValid) {
      errMsg = 'Invalid Card Number';
    } else {
      errMsg =
        '*Please fill out all required fields and correct invalid inputs.';
    }

    this.setState(
      {
        isValidForm: !(
          phoneErr ||
          emailErr ||
          empty ||
          cardExpired ||
          !isValid
        ),
        phoneError: phoneErr,
        emailError: emailErr,
        errorMsg: errMsg
      },
      () => this.checkIfValid()
    );

    return {
      isValid: !(phoneErr || emailErr || empty || cardExpired || !isValid),
      errorMsg: errMsg
    };
  };

  checkIfValid = () => {
    const { isValidForm, isValidZip, selectedMethod } = this.state;
    this.setState({
      isGoodToGo: isValidForm && (isValidZip || selectedMethod === 'paypal')
    });
  };

  validateFields = () => {
    const { isValid, errorMsg } = this.validate();

    this.zipValidate(isValid, errorMsg);
  };

  onUseThisAddress = async e => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      apt,
      city,
      state,
      zip,
      issuer,
      cardNumber,
      securityCode,
      year,
      month,
      isShipping,
      selectedMethod,
      nameCard
    } = this.state;
    const addressInput = {
      firstName,
      lastName,
      email1: email,
      phone1: phone,
      city: city.trim(),
      stateProvince: state,
      postalCode: zip
    };

    const paymentMethod = {
      paymentMethod: selectedMethod === 'credit' ? issuer : 'Paypal',
      ccExpYear: year.toString(),
      ccExpMonth: month.toString(),
      ccNumber: cardNumber.replace(/ /g, ''),
      ccCvv: securityCode
    };
    const {
      setBillingAddress,
      onNext,
      usedAddresses,
      setPaymentMethod,
      order,
      setCompleted
    } = this.props;

    let addressId;
    let res;
    let addressInfo = {
      firstName,
      lastName,
      email,
      phone
    };
    if (!isShipping && selectedMethod !== 'paypal') {
      // Mailing address validation
      const zipRes = await this.props.zipcode({
        variables: {
          zip: zip.slice(0, 5)
        }
      });

      if (!zipRes.data.zip) {
        this.setState({
          isGoodToGo: false,
          errorMsg: 'Invalid zip code.'
        });
        return;
      }

      if (
        city.trim().toUpperCase() !== zipRes.data.zip.city ||
        state !== zipRes.data.zip.state
      ) {
        this.setState({
          isGoodToGo: false,
          errorMsg: 'Input correct city and state.'
        });
        return;
      }

      res = await this.props.addResidentialAddress({
        variables: {
          address: { ...addressInput, address1: address, address2: apt }
        }
      });
      addressId = res.data.addResidentialAddress;
      addressInfo = {
        id: addressId,
        ...addressInput,
        address,
        apt,
        state,
        zip,
        email,
        phone
      };
    } else if (selectedMethod !== 'paypal') {
      addressId = order.consignments[0].addressId;
      const shippingAddress = usedAddresses.filter(
        addr => parseInt(addr.id, 10) === addressId
      )[0];

      res = await this.props.addResidentialAddress({
        variables: {
          address: {
            firstName: shippingAddress.student.firstName,
            lastName: shippingAddress.student.lastName,
            email1: email,
            phone1: phone,
            address1: shippingAddress.address.address,
            address2: shippingAddress.address.apt,
            city: shippingAddress.address.city,
            stateProvince: shippingAddress.address.state,
            postalCode: shippingAddress.address.zip
          }
        }
      });
      addressId = res.data.addResidentialAddress;
      addressInfo = {
        id: addressId,
        firstName: shippingAddress.student.firstName,
        lastName: shippingAddress.student.lastName,
        email,
        phone,
        address: shippingAddress.address.address,
        apt: shippingAddress.address.apt,
        city: shippingAddress.address.city,
        state: shippingAddress.address.state,
        zip: shippingAddress.address.zip,
        birthday: shippingAddress.student.birthday
      };
    } else {
      res = await this.props.addResidentialAddress({
        variables: {
          address: {
            ...paypalAddress,
            firstName,
            lastName,
            email1: email,
            phone1: phone
          }
        }
      });
      addressId = res.data.addResidentialAddress;
    }

    if (!addressId) {
      this.props.renderNotification(
        null,
        'Failed to add billing address. Please try again.'
      );
      return;
    }

    try {
      await this.props.subscribeEmail({
        variables: {
          signup: {
            email,
            firstName: addressInfo.firstName,
            lastName: addressInfo.lastName,
            schoolCode: this.props.schoolcode
          }
        }
      });
    } catch (err) {
      console.error(err.message);
    }

    try {
      await this.props.setBilling({
        variables: {
          billing: {
            addressId,
            orderId: order.id
          }
        }
      });

      setBillingAddress(addressInfo);
      const bSuccessAddPayment = await setPaymentMethod({
        cardInfo: { ...paymentMethod, addressId },
        type: selectedMethod,
        nameCard
      });

      if (bSuccessAddPayment) {
        setCompleted(1);
        onNext();
      }
    } catch (err) {
      this.props.renderNotification(
        err,
        'Failed to set billing address. Please try again later.'
      );
    }
  };

  setCardInfo = (
    cardNumber,
    nameCard,
    expiryDate,
    securityCode,
    issuer,
    isValid
  ) => {
    this.setState(
      {
        cardNumber: cardNumber.replace(' ', ''),
        nameCard,
        year: parseInt(expiryDate.split('/')[1], 10) + 2000,
        month: parseInt(expiryDate.split('/')[0], 10),
        securityCode,
        issuer,
        isValid
      },
      () => this.validate()
    );
  };

  render() {
    const {
      classes,
      order,
      shippingAddress,
      paymentMethod,
      schoolcode
    } = this.props;
    const {
      firstName,
      lastName,
      address,
      apt,
      city,
      state,
      zip,
      email,
      phone,
      selectedMethod,
      isShipping,
      isGoodToGo,
      isValidZip,
      errorMsg,
      emailOffer
    } = this.state;
    const isMultiple = order.consignments.length > 1;
    const endorsed = schoolcode.toLowerCase() !== 'ocm';

    return (
      <form onSubmit={this.onUseThisAddress}>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Typography variant="h5">Payment</Typography>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item container md={12} xs={12}>
            <Grid item md={12} xs={12}>
              <Hidden smDown>
                <RadioGroup
                  aria-label="Payment Method"
                  name="payment_method"
                  className={classes.group}
                  value={selectedMethod}
                  onChange={this.handleChange('selectedMethod')}
                >
                  {PAYMENT_METHODS.map((method, id) => (
                    <FormControlLabel
                      key={id}
                      value={method.value}
                      control={<Radio />}
                      label={method.name}
                    />
                  ))}
                </RadioGroup>
              </Hidden>
              <Hidden smUp>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Select
                    native
                    style={{ height: 44 }}
                    value={selectedMethod}
                    onChange={this.handleChange('selectedMethod')}
                    input={
                      <OutlinedInput
                        name="payment-method"
                        id="payment-method"
                      />
                    }
                  >
                    <option value="credit">Credit Card</option>
                    <option value="paypal">PayPal</option>
                  </Select>
                </FormControl>
              </Hidden>
            </Grid>
            <Grid item md={12}>
              <Divider className={classNames(classes.divider, 'dotted')} />
            </Grid>
            {selectedMethod === 'credit' && (
              <>
                <Card
                  setCardInfo={this.setCardInfo}
                  paymentMethod={paymentMethod}
                />
                <Grid item md={12}>
                  <Divider className={classNames(classes.divider, 'dotted')} />
                </Grid>
              </>
            )}
          </Grid>
          {selectedMethod !== 'paypal' &&
            !isMultiple &&
            !JSON.parse(shippingAddress.type).isCampusDelivery && (
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={isShipping}
                      onChange={() =>
                        this.setState({ isShipping: !isShipping }, () =>
                          this.validateFields()
                        )
                      }
                    />
                  }
                  label="Use Shipping Address as Billing Address"
                />
              </Grid>
            )}
          <Grid item>
            <Typography variant="h5">Billing Information</Typography>
          </Grid>
          <Grid item md={12}>
            <Divider className={classNames(classes.divider, 'dotted')} />
          </Grid>
          <Grid item container>
            <Grid item container spacing={8}>
              <Grid item md={6} xs={12}>
                <InputField
                  placeholder="First Name*"
                  input={{
                    onChange: this.handleChange('firstName'),
                    value: firstName
                  }}
                  required
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputField
                  placeholder="Last Name*"
                  input={{
                    onChange: this.handleChange('lastName'),
                    value: lastName
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          {!isShipping && selectedMethod !== 'paypal' && (
            <React.Fragment>
              <Grid item>
                <Divider
                  className={classNames(classes.divider, 'dotted', 'smaller')}
                />
              </Grid>
              <Grid item container direction="row" spacing={8}>
                <Grid item md={12} xs={12}>
                  <InputField
                    placeholder="Address*"
                    input={{
                      onChange: this.handleChange('address'),
                      value: address
                    }}
                    required
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <InputField
                    placeholder="Apt/Suite/Floor"
                    input={{
                      onChange: this.handleChange('apt'),
                      value: apt
                    }}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <InputField
                    placeholder="Zip*"
                    input={{
                      onChange: this.handleZipChange,
                      value: zip,
                      className: classNames(
                        classes.textField,
                        this.state.zipError && 'error'
                      )
                    }}
                    required
                  />
                </Grid>
                {isValidZip && (
                  <Grid item container md={8} xs={12} alignItems="center">
                    <Typography className={classes.normalText}>
                      {`${city}, ${state}`}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </React.Fragment>
          )}
          <Grid item>
            <Divider
              className={classNames(classes.divider, 'dotted', 'smaller')}
            />
          </Grid>
          <Grid item container>
            <Grid item container>
              <Grid item md={12} xs={12}>
                <InputField
                  placeholder="Email*"
                  input={{
                    onChange: this.handleChange('email'),
                    error: this.state.emailError,
                    value: email
                  }}
                  required
                />
                {this.state.emailError && (
                  <Typography className={classes.error}>
                    Enter a valid email.
                  </Typography>
                )}
              </Grid>
              <Grid item md={6} xs={12}>
                <InputMask
                  mask="(999) 999 - 9999"
                  maskChar=" "
                  value={phone}
                  onChange={this.handleChange('phone')}
                >
                  {() => (
                    <TextField
                      variant="outlined"
                      error={this.state.phoneError}
                      InputProps={{
                        className: classNames(
                          classes.textField,
                          this.state.phoneError && 'error'
                        )
                      }}
                      placeholder="Phone"
                    />
                  )}
                </InputMask>
                {this.state.phoneError && (
                  <Typography className={classes.error}>
                    Enter a valid phone number.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid
            item
            container
            className={classes.margin20}
            justify="space-between"
            alignItems="center"
            direction="column"
            spacing={8}
          >
            <Grid container item justify="center">
              <FormControlLabel
                control={
                  <Checkbox
                    value="sign_up"
                    checked={emailOffer}
                    onChange={(ev, checked) =>
                      this.setState({ emailOffer: checked })
                    }
                  />
                }
                label="Sign-up for special email offers"
              />
            </Grid>
            {!isGoodToGo && (
              <Grid item container justify="center" md={8} sm={8} xs={12}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  className={classes.error}
                >
                  {errorMsg}
                </Typography>
              </Grid>
            )}
            <Grid item container justify="center" md={8} sm={8} xs={12}>
              <Button
                className={classNames(
                  classes.button,
                  endorsed ? classes.endorsedButton : ''
                )}
                variant="contained"
                type="submit"
                disabled={!isGoodToGo}
                fullWidth
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

Payment.propTypes = {
  onNext: PropTypes.func.isRequired
};

const PaymentWithContext = props => (
  <CheckoutConsumer>
    {({
      setBillingAddress,
      paymentMethod,
      setPaymentMethod,
      usedAddresses,
      billingAddress,
      order,
      schoolcode,
      setCompleted,
      renderNotification
    }) => {
      const addressId = order.consignments[0].addressId;
      const shippingAddress = usedAddresses.filter(
        addr => parseInt(addr.id, 10) === addressId
      )[0];

      return (
        <Payment
          usedAddresses={usedAddresses}
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          order={order}
          schoolcode={schoolcode}
          setCompleted={setCompleted}
          shippingAddress={shippingAddress}
          renderNotification={renderNotification}
          {...props}
        />
      );
    }}
  </CheckoutConsumer>
);

export default compose(
  graphql(setBilling, { name: 'setBilling' }),
  graphql(addResidentialAddress, { name: 'addResidentialAddress' }),
  graphql(zipcode, { name: 'zipcode' }),
  graphql(subscribeEmail, { name: 'subscribeEmail' }),
  graphql(getPaypalOrder, { name: 'getPaypalOrder' }),
  withStyles(styles)
)(PaymentWithContext);
